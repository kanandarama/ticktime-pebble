import {} from "piu/MC";
import { formatDueDate } from "../api/models";
import { HeaderBar } from "../components/HeaderBar";
import { buildMenuList } from "../components/MenuList";
import { blackSkin, HEADER_HEIGHT } from "../styles";

export function createTaskListScreen($, app, title, tasks) {
  const items = tasks.map((task) => ({
    id: task.id,
    projectId: task.projectId,
    title: (task.status === 2 ? "✓ " : "") + task.title,
    subtitle: [task.projectName, formatDueDate(task.dueDate)].filter(Boolean).join(" · "),
    task: task
  }));

  if (!items.length) {
    items.push({ id: "empty", title: "No tasks", subtitle: "Try syncing", task: null });
  }

  return Container.template(($) => ({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    skin: blackSkin,
    contents: [
      HeaderBar($, { title: title, onBack: () => app.goHome() }),
      buildMenuList($, HEADER_HEIGHT, items, (item) => {
        if (item.task) {
          app.openTask(item.task);
        }
      })
    ]
  }));
}
