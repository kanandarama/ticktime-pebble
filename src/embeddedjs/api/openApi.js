import { TickTickClient } from "./client";
import { normalizeProject, normalizeTask } from "./models";

const API_BASE = "https://api.ticktick.com/open/v1";

export class OpenApiClient extends TickTickClient {
  constructor(token) {
    super();
    this.token = token;
  }

  async request(path, options) {
    const url = API_BASE + path;
    const headers = {
      Authorization: "Bearer " + this.token,
      Accept: "application/json"
    };
    if (options && options.body) {
      headers["Content-Type"] = "application/json";
    }
    const response = await fetch(url, {
      method: (options && options.method) || "GET",
      headers: headers,
      body: options && options.body ? JSON.stringify(options.body) : undefined
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error("API " + response.status + ": " + text);
    }
    if (response.status === 204) {
      return null;
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.indexOf("application/json") >= 0) {
      return response.json();
    }
    return null;
  }

  async getProjects() {
    const data = await this.request("/project");
    return (data || []).map(normalizeProject);
  }

  async getProject(projectId) {
    const data = await this.request("/project/" + projectId);
    return normalizeProject(data);
  }

  async getProjectData(projectId) {
    const data = await this.request("/project/" + projectId + "/data");
    return {
      project: normalizeProject(data.project),
      tasks: (data.tasks || []).map(normalizeTask),
      columns: data.columns || []
    };
  }

  async createProject(project) {
    const data = await this.request("/project", { method: "POST", body: project });
    return normalizeProject(data);
  }

  async updateProject(projectId, project) {
    const data = await this.request("/project/" + projectId, { method: "POST", body: project });
    return normalizeProject(data);
  }

  async deleteProject(projectId) {
    await this.request("/project/" + projectId, { method: "DELETE" });
  }

  async getTask(projectId, taskId) {
    const data = await this.request("/project/" + projectId + "/task/" + taskId);
    return normalizeTask(data);
  }

  async createTask(task) {
    const data = await this.request("/task", { method: "POST", body: task });
    return normalizeTask(data);
  }

  async updateTask(task) {
    const data = await this.request("/task/" + task.id, { method: "POST", body: task });
    return normalizeTask(data);
  }

  async completeTask(projectId, taskId) {
    await this.request("/project/" + projectId + "/task/" + taskId + "/complete", {
      method: "POST"
    });
  }

  async deleteTask(projectId, taskId) {
    await this.request("/project/" + projectId + "/task/" + taskId, {
      method: "DELETE"
    });
  }
}
