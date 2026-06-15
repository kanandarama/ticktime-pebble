import { OpenApiClient } from "../api/openApi";
import { loadCache, saveCache } from "../storage/cache";

export async function syncAll(client) {
  const projects = await client.getProjects();
  const openProjects = projects.filter((p) => !p.closed);
  const tasksByProject = {};

  for (let i = 0; i < openProjects.length; i++) {
    const project = openProjects[i];
    try {
      const data = await client.getProjectData(project.id);
      tasksByProject[project.id] = data.tasks;
    } catch (e) {
      console.log("Failed to sync project " + project.name + ": " + e);
      tasksByProject[project.id] = [];
    }
  }

  const cache = {
    projects: openProjects,
    tasksByProject: tasksByProject,
    lastSync: Date.now()
  };
  saveCache(cache);
  return cache;
}

export function createClient(token) {
  return new OpenApiClient(token);
}

export function getAllTasks(cache) {
  const tasks = [];
  const projects = cache.projects || [];
  projects.forEach((project) => {
    const projectTasks = cache.tasksByProject[project.id] || [];
    projectTasks.forEach((task) => {
      tasks.push({
        ...task,
        projectName: project.name,
        projectColor: project.color
      });
    });
  });
  return tasks;
}

export function getTasksForProject(cache, projectId) {
  const project = (cache.projects || []).find((p) => p.id === projectId);
  const tasks = cache.tasksByProject[projectId] || [];
  return tasks.map((task) => ({
    ...task,
    projectName: project ? project.name : "",
    projectColor: project ? project.color : "#888888"
  }));
}

export function findTask(cache, projectId, taskId) {
  const tasks = cache.tasksByProject[projectId] || [];
  return tasks.find((t) => t.id === taskId) || null;
}

export function updateCachedTask(cache, task) {
  const list = cache.tasksByProject[task.projectId] || [];
  const index = list.findIndex((t) => t.id === task.id);
  if (index >= 0) {
    list[index] = task;
  } else {
    list.push(task);
  }
  cache.tasksByProject[task.projectId] = list;
  saveCache(cache);
  return cache;
}

export function removeCachedTask(cache, projectId, taskId) {
  const list = cache.tasksByProject[projectId] || [];
  cache.tasksByProject[projectId] = list.filter((t) => t.id !== taskId);
  saveCache(cache);
  return cache;
}

export function loadLocalCache() {
  return loadCache();
}
