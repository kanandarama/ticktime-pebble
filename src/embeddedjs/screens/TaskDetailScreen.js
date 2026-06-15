import {} from "piu/MC";
import { formatDueDate, PRIORITY_LABELS } from "../api/models";
import { HeaderBar } from "../components/HeaderBar";
import { buildMenuList } from "../components/MenuList";
import { blackSkin, HEADER_HEIGHT } from "../styles";

export function createTaskDetailScreen($, app, task) {
  const due = formatDueDate(task.dueDate);
  const priority = PRIORITY_LABELS[task.priority] || "None";
  const subtasks = (task.items || []).map((item) => ({
    id: item.id,
    title: (item.status === 1 ? "✓ " : "○ ") + item.title,
    subtitle: "",
    item: item
  }));

  const items = [
    { id: "title", title: task.title, subtitle: task.projectName || "" },
    { id: "meta", title: "Due: " + (due || "None"), subtitle: "Priority: " + priority + " (tap)" }
  ];

  if (task.content) {
    items.push({ id: "content", title: task.content, subtitle: "" });
  }

  subtasks.forEach((st) => items.push(st));

  items.push({ id: "complete", title: "Complete Task", subtitle: "" });
  items.push({ id: "delete", title: "Delete Task", subtitle: "" });

  return Container.template(($) => ({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    skin: blackSkin,
    contents: [
      HeaderBar($, { title: "Task", onBack: () => app.goBack() }),
      buildMenuList($, HEADER_HEIGHT, items, (item) =>
        app.handleTaskAction(task, item.id, item.item)
      )
    ]
  }));
}
