import {} from "piu/MC";
import { HeaderBar } from "../components/HeaderBar";
import { buildMenuList } from "../components/MenuList";
import { blackSkin, HEADER_HEIGHT } from "../styles";

export function createHomeScreen($, app) {
  const cache = app.getCache();
  const taskCount = app.getAllTasks().length;
  const syncLabel = cache.lastSync
    ? "Synced " + new Date(cache.lastSync).toLocaleTimeString()
    : "Not synced yet";

  const items = [
    { id: "today", title: "Today", subtitle: "Due today" },
    { id: "tomorrow", title: "Tomorrow", subtitle: "Due tomorrow" },
    { id: "overdue", title: "Overdue", subtitle: "Past due" },
    { id: "all", title: "All Tasks", subtitle: taskCount + " tasks" },
    { id: "projects", title: "Projects", subtitle: (cache.projects || []).length + " lists" },
    { id: "quickadd", title: "Quick Add", subtitle: "New task" },
    { id: "sync", title: "Sync Now", subtitle: syncLabel },
    { id: "settings", title: "Settings", subtitle: app.isConnected() ? "Connected" : "Not connected" }
  ];

  return Container.template(($) => ({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    skin: blackSkin,
    contents: [
      HeaderBar($, { title: "TickTime" }),
      buildMenuList($, HEADER_HEIGHT, items, (item) => app.handleHomeAction(item.id))
    ]
  }));
}
