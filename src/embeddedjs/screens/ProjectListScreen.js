import {} from "piu/MC";
import { HeaderBar } from "../components/HeaderBar";
import { buildMenuList } from "../components/MenuList";
import { blackSkin, HEADER_HEIGHT } from "../styles";

export function createProjectListScreen($, app) {
  const projects = app.getCache().projects || [];
  const items = projects.map((project) => ({
    id: project.id,
    title: project.name,
    subtitle: project.viewMode || "list",
    project: project
  }));

  items.push({ id: "new", title: "+ New Project", subtitle: "Create list", project: null });

  if (!items.length) {
    items.push({ id: "empty", title: "No projects", subtitle: "Sync first", project: null });
  }

  return Container.template(($) => ({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    skin: blackSkin,
    contents: [
      HeaderBar($, { title: "Projects", onBack: () => app.goHome() }),
      buildMenuList($, HEADER_HEIGHT, items, (item) => {
        if (item.id === "new") {
          app.createProject();
        } else if (item.project) {
          app.openProject(item.project);
        }
      })
    ]
  }));
}
