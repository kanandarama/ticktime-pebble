import { isTaskComplete } from "../api/models";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDue(task) {
  if (!task.dueDate) {
    return null;
  }
  const d = new Date(task.dueDate);
  return isNaN(d.getTime()) ? null : d;
}

export function filterIncomplete(tasks) {
  return tasks.filter((task) => !isTaskComplete(task));
}

export function filterToday(tasks) {
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return filterIncomplete(tasks).filter((task) => {
    const due = parseDue(task);
    if (!due) {
      return false;
    }
    return due >= today && due < tomorrow;
  });
}

export function filterTomorrow(tasks) {
  const tomorrow = startOfDay(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  return filterIncomplete(tasks).filter((task) => {
    const due = parseDue(task);
    if (!due) {
      return false;
    }
    return due >= tomorrow && due < dayAfter;
  });
}

export function filterOverdue(tasks) {
  const today = startOfDay(new Date());
  return filterIncomplete(tasks).filter((task) => {
    const due = parseDue(task);
    if (!due) {
      return false;
    }
    return due < today;
  });
}

export function sortByDueThenPriority(tasks) {
  return tasks.slice().sort((a, b) => {
    const dueA = parseDue(a);
    const dueB = parseDue(b);
    if (dueA && dueB && dueA.getTime() !== dueB.getTime()) {
      return dueA - dueB;
    }
    if (dueA && !dueB) {
      return -1;
    }
    if (!dueA && dueB) {
      return 1;
    }
    return (b.priority || 0) - (a.priority || 0);
  });
}
