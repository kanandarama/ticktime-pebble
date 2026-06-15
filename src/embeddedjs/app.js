import {} from "piu/MC";
import { blackSkin, titleStyle } from "./styles";
import {
  initAuth,
  requestToken,
  startAuth,
  logout,
  submitAuthCode,
  AUTH_STATUS
} from "./services/auth";
import {
  syncAll,
  createClient,
  getAllTasks,
  getTasksForProject,
  updateCachedTask,
  removeCachedTask,
  loadLocalCache
} from "./services/sync";
import {
  filterToday,
  filterTomorrow,
  filterOverdue,
  filterIncomplete,
  sortByDueThenPriority
} from "./services/views";
import { getToken, setToken, loadSettings, saveSettings, saveCache } from "./storage/cache";
import { createHomeScreen } from "./screens/HomeScreen";
import { createTaskListScreen } from "./screens/TaskListScreen";
import { createTaskDetailScreen } from "./screens/TaskDetailScreen";
import { createProjectListScreen } from "./screens/ProjectListScreen";
import { createSettingsScreen } from "./screens/SettingsScreen";
import { createQuickAddScreen } from "./screens/QuickAddScreen";

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

class AppController {
  constructor(application) {
    this.application = application;
    this.cache = loadLocalCache();
    this.token = getToken();
    this.connected = !!this.token;
    this.statusMessage = "";
    this.screenStack = [];
    this.quickAddData = null;
    this.authCodeBuffer = "";
    this.authCodeCharIndex = 0;
    this.settings = loadSettings();
    this.busy = false;
    this.currentScreen = "home";
    this.renderScreen = () => this.navigateHome();
  }

  start() {
    initAuth((event) => this.onAuthEvent(event));
    watch.addEventListener("connected", () => {
      if (watch.connected.pebblekit) {
        requestToken();
      }
    });
    if (watch.connected.pebblekit) {
      requestToken();
    }
    this.navigateHome();
  }

  onAuthEvent(event) {
    if (event.AUTH_TOKEN) {
      this.token = event.AUTH_TOKEN;
      setToken(this.token);
      this.connected = true;
      this.statusMessage = "Logged in";
    }
    if (event.AUTH_STATUS === AUTH_STATUS.DISCONNECTED) {
      this.token = null;
      setToken(null);
      this.connected = false;
      this.statusMessage = "Logged out";
    }
    if (event.AUTH_STATUS === AUTH_STATUS.PENDING) {
      this.statusMessage = "Check phone browser";
    }
    if (event.AUTH_STATUS === AUTH_STATUS.ERROR) {
      this.statusMessage = event.ERROR_MSG || "Auth error";
    }
    this.rerender();
  }

  isConnected() {
    return this.connected && !!this.token;
  }

  getStatusMessage() {
    return this.statusMessage || (this.isConnected() ? "Ready" : "Log in to sync");
  }

  getCache() {
    return this.cache;
  }

  getAllTasks() {
    return getAllTasks(this.cache);
  }

  getDefaultProjectName() {
    const id = this.settings.defaultProjectId;
    if (!id) {
      return "Not set";
    }
    const project = (this.cache.projects || []).find((p) => p.id === id);
    return project ? project.name : "Not set";
  }

  getClient() {
    if (!this.token) {
      throw new Error("Not connected");
    }
    return createClient(this.token);
  }

  clearContents() {
    let child = this.application.first;
    while (child) {
      const next = child.next;
      this.application.remove(child);
      child = next;
    }
  }

  showScreen(name, renderScreen) {
    this.currentScreen = name;
    this.renderScreen = renderScreen;
    const Template = renderScreen();
    const screen = Template($, {});
    this.clearContents();
    this.application.add(screen);
  }

  rerender() {
    this.showScreen(this.currentScreen, this.renderScreen);
  }

  navigateHome() {
    this.screenStack = [];
    this.showScreen("home", () => createHomeScreen($, this));
  }

  goHome() {
    this.navigateHome();
  }

  goBack() {
    if (this.screenStack.length) {
      const prev = this.screenStack.pop();
      prev();
    } else {
      this.navigateHome();
    }
  }

  pushScreen(name, renderScreen) {
    this.screenStack.push(() => this.showScreen(this.currentScreen, this.renderScreen));
    this.showScreen(name, renderScreen);
  }

  async runBusy(label, fn) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    this.statusMessage = label;
    try {
      await fn();
    } catch (e) {
      this.statusMessage = String(e.message || e);
      console.log("Error: " + this.statusMessage);
    } finally {
      this.busy = false;
    }
  }

  async syncNow() {
    if (!this.isConnected()) {
      this.statusMessage = "Connect TickTick first";
      this.openSettings();
      return;
    }
    await this.runBusy("Syncing…", async () => {
      if (!watch.connected.pebblekit) {
        throw new Error("Phone not connected");
      }
      const client = this.getClient();
      this.cache = await syncAll(client);
      this.statusMessage = "Sync complete";
      this.navigateHome();
    });
  }

  openTaskList(title, tasks) {
    const sorted = sortByDueThenPriority(tasks);
    this.pushScreen("tasks", () => createTaskListScreen($, this, title, sorted));
  }

  openTask(task) {
    this.pushScreen("task", () => createTaskDetailScreen($, this, task));
  }

  openProject(project) {
    const tasks = getTasksForProject(this.cache, project.id);
    this.openTaskList(project.name, tasks);
  }

  openProjects() {
    this.pushScreen("projects", () => createProjectListScreen($, this));
  }

  openSettings() {
    this.pushScreen("settings", () => createSettingsScreen($, this));
  }

  openQuickAdd() {
    this.pushScreen("quickadd", () => createQuickAddScreen($, this, "project"));
  }

  openQuickAddTitle(project) {
    this.quickAddData = { project: project };
    this.showScreen("quickadd-title", () =>
      createQuickAddScreen($, this, "title", this.quickAddData)
    );
  }

  openAuthCodeEntry() {
    this.authCodeBuffer = "";
    this.authCodeCharIndex = 0;
    this.pushScreen("code", () => this.createAuthCodeScreen());
  }

  createAuthCodeScreen() {
    const self = this;
    return Container.template(($) => ({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      skin: blackSkin,
      contents: [
        Label($, {
          left: 8,
          right: 8,
          top: 30,
          style: titleStyle,
          string: "Auth Code"
        }),
        Label($, {
          left: 8,
          right: 8,
          top: 70,
          style: titleStyle,
          string: self.authCodeBuffer || "(empty)"
        }),
        Label($, {
          left: 8,
          right: 8,
          top: 110,
          style: titleStyle,
          string: "Char: " + CODE_CHARS[self.authCodeCharIndex]
        }),
        Label($, {
          left: 8,
          right: 8,
          top: 150,
          style: titleStyle,
          string: "Up: next char"
        }),
        Label($, {
          left: 8,
          right: 8,
          top: 175,
          style: titleStyle,
          string: "Sel: add · Down: submit"
        })
      ],
      active: true,
      Behavior: class extends Behavior {
        onKeyDown(container, key) {
          if (key === "up") {
            self.authCodeCharIndex = (self.authCodeCharIndex + 1) % CODE_CHARS.length;
            self.rerender();
          } else if (key === "select") {
            self.authCodeBuffer += CODE_CHARS[self.authCodeCharIndex];
            self.rerender();
          } else if (key === "back") {
            if (self.authCodeBuffer.length) {
              self.authCodeBuffer = self.authCodeBuffer.slice(0, -1);
              self.rerender();
            } else {
              self.goBack();
            }
          } else if (key === "down") {
            if (self.authCodeBuffer.length) {
              submitAuthCode(self.authCodeBuffer);
              self.statusMessage = "Submitting code…";
              self.goBack();
            }
          }
        }
      }
    }));
  }

  handleHomeAction(action) {
    const all = this.getAllTasks();
    if (action === "today") {
      this.openTaskList("Today", filterToday(all));
    } else if (action === "tomorrow") {
      this.openTaskList("Tomorrow", filterTomorrow(all));
    } else if (action === "overdue") {
      this.openTaskList("Overdue", filterOverdue(all));
    } else if (action === "all") {
      this.openTaskList("All Tasks", filterIncomplete(all));
    } else if (action === "projects") {
      this.openProjects();
    } else if (action === "quickadd") {
      this.openQuickAdd();
    } else if (action === "sync") {
      this.syncNow();
    } else if (action === "settings") {
      this.openSettings();
    }
  }

  handleSettingsAction(action) {
    if (action === "connect") {
      startAuth();
      this.statusMessage = "Opening browser…";
      this.rerender();
    } else if (action === "code") {
      this.openAuthCodeEntry();
    } else if (action === "disconnect") {
      logout();
      this.token = null;
      setToken(null);
      this.connected = false;
      this.statusMessage = "Disconnected";
      this.navigateHome();
    } else if (action === "default") {
      this.openProjects();
    }
  }

  async handleTaskAction(task, action, subtask) {
    if (action === "meta") {
      await this.cycleTaskPriority(task);
      return;
    }
    if (action === "complete") {
      await this.runBusy("Completing…", async () => {
        const client = this.getClient();
        await client.completeTask(task.projectId, task.id);
        task.status = 2;
        this.cache = updateCachedTask(this.cache, task);
        this.goBack();
      });
      return;
    }
    if (action === "delete") {
      await this.runBusy("Deleting…", async () => {
        const client = this.getClient();
        await client.deleteTask(task.projectId, task.id);
        this.cache = removeCachedTask(this.cache, task.projectId, task.id);
        this.goBack();
      });
      return;
    }
    if (subtask && subtask.id) {
      await this.runBusy("Updating…", async () => {
        const client = this.getClient();
        const fresh = await client.getTask(task.projectId, task.id);
        const items = (fresh.items || []).map((item) => {
          if (item.id === subtask.id) {
            return { ...item, status: item.status === 1 ? 0 : 1 };
          }
          return item;
        });
        const updated = await client.updateTask({ ...fresh, items: items });
        this.cache = updateCachedTask(this.cache, updated);
        this.showScreen("task", () => createTaskDetailScreen($, this, updated));
      });
    }
  }

  async createQuickTask(project, title) {
    await this.runBusy("Creating…", async () => {
      const client = this.getClient();
      const created = await client.createTask({
        title: title,
        projectId: project.id
      });
      this.cache = updateCachedTask(this.cache, created);
      this.settings.defaultProjectId = project.id;
      saveSettings(this.settings);
      this.statusMessage = "Task created";
      this.navigateHome();
    });
  }

  async createProject() {
    await this.runBusy("Creating list…", async () => {
      const client = this.getClient();
      const count = (this.cache.projects || []).length + 1;
      const created = await client.createProject({
        name: "List " + count,
        color: "#4A90D9",
        viewMode: "list",
        kind: "TASK"
      });
      this.cache.projects = (this.cache.projects || []).concat([created]);
      this.cache.tasksByProject[created.id] = [];
      saveCache(this.cache);
      this.statusMessage = "Project created";
      this.openProjects();
    });
  }

  async cycleTaskPriority(task) {
    const order = [0, 1, 3, 5];
    const current = order.indexOf(task.priority || 0);
    const next = order[(current + 1) % order.length];
    await this.runBusy("Updating…", async () => {
      const client = this.getClient();
      const updated = await client.updateTask({
        ...task,
        priority: next
      });
      this.cache = updateCachedTask(this.cache, updated);
      this.showScreen("task", () => createTaskDetailScreen($, this, updated));
    });
  }
}

class RootBehavior extends Behavior {
  onCreate(application) {
    this.controller = new AppController(application);
    this.controller.start();
  }
  onKeyDown(application, key) {
    if (this.controller.currentScreen === "code") {
      return;
    }
    if (key === "back") {
      this.controller.goBack();
    }
  }
}

const TickTimeApplication = Application.template(($) => ({
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  skin: blackSkin,
  Behavior: RootBehavior,
  contents: []
}));

export default TickTimeApplication;
