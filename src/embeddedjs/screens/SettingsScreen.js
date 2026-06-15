import {} from "piu/MC";
import { HeaderBar } from "../components/HeaderBar";
import { buildMenuList } from "../components/MenuList";
import { blackSkin, HEADER_HEIGHT } from "../styles";

export function createSettingsScreen($, app) {
  const connected = app.isConnected();
  const items = [
    {
      id: "status",
      title: connected ? "Status: Connected" : "Status: Not connected",
      subtitle: app.getStatusMessage()
    },
    { id: "connect", title: "Connect TickTick", subtitle: "Open browser to log in" },
    { id: "code", title: "Enter Auth Code", subtitle: "After browser login" },
    { id: "disconnect", title: "Disconnect", subtitle: "Remove saved token" },
    { id: "default", title: "Default Project", subtitle: app.getDefaultProjectName() }
  ];

  return Container.template(($) => ({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    skin: blackSkin,
    contents: [
      HeaderBar($, { title: "Settings", onBack: () => app.goHome() }),
      buildMenuList($, HEADER_HEIGHT, items, (item) => app.handleSettingsAction(item.id))
    ]
  }));
}
