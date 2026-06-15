export const PRIORITY_LABELS = { 0: "", 1: "Low", 3: "Med", 5: "High" };
export const PRIORITY_COLORS = ["#888888", "#4A90D9", "#F5A623", "#D0021B"];

export function truncate(text, max) {
  if (!text) {
    return "";
  }
  if (text.length <= max) {
    return text;
  }
  return text.substring(0, max - 1) + "…";
}

export function normalizeProject(project) {
  return {
    id: project.id,
    name: truncate(project.name || "Untitled", 40),
    color: project.color || "#888888",
    closed: !!project.closed,
    viewMode: project.viewMode || "list"
  };
}

export function normalizeTask(task) {
  return {
    id: task.id,
    projectId: task.projectId,
    title: truncate(task.title || "Untitled", 80),
    content: task.content || "",
    desc: task.desc || "",
    priority: task.priority || 0,
    status: task.status || 0,
    dueDate: task.dueDate || null,
    startDate: task.startDate || null,
    isAllDay: !!task.isAllDay,
    repeatFlag: task.repeatFlag || "",
    reminders: task.reminders || [],
    items: (task.items || []).map(normalizeChecklistItem),
    sortOrder: task.sortOrder || 0
  };
}

export function normalizeChecklistItem(item) {
  return {
    id: item.id,
    title: truncate(item.title || "", 60),
    status: item.status || 0,
    sortOrder: item.sortOrder || 0
  };
}

export function formatDueDate(iso) {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (isNaN(date.getTime())) {
    return "";
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return month + "/" + day;
}

export function isTaskComplete(task) {
  return task.status === 2 || !!task.completedTime;
}
