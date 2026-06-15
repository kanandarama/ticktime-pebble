import {} from "piu/MC";
import { HeaderBar } from "../components/HeaderBar";
import { buildMenuList } from "../components/MenuList";
import { blackSkin, HEADER_HEIGHT } from "../styles";

const QUICK_TITLES = ["New task", "Reminder", "Call", "Buy groceries", "Email"];

export function createQuickAddScreen($, app, step, data) {
  if (step === "project") {
    const projects = app.getCache().projects || [];
    const items = projects.map((project) => ({
      id: project.id,
      title: project.name,
      subtitle: "Select list",
      project: project
    }));
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
        HeaderBar($, { title: "Quick Add", onBack: () => app.goHome() }),
        buildMenuList($, HEADER_HEIGHT, items, (item) => {
          if (item.project) {
            app.openQuickAddTitle(item.project);
          }
        })
      ]
    }));
  }

  const items = QUICK_TITLES.map((title) => ({
    id: title,
    title: title,
    subtitle: data.project.name
  }));

  return Container.template(($) => ({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    skin: blackSkin,
    contents: [
      HeaderBar($, { title: "Task Title", onBack: () => app.openQuickAdd() }),
      buildMenuList($, HEADER_HEIGHT, items, (item) =>
        app.createQuickTask(data.project, item.id)
      )
    ]
  }));
}
