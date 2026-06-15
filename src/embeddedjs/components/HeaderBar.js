import {} from "piu/MC";
import { headerSkin, headerStyle, HEADER_HEIGHT } from "../styles";

class HeaderBehavior extends Behavior {
  onCreate(label, data) {
    this.data = data;
  }
  onTouchEnded(label) {
    if (this.data && this.data.onBack) {
      this.data.onBack();
    }
  }
}

export const HeaderBar = Container.template(($) => ({
  left: 0,
  right: 0,
  top: 0,
  height: HEADER_HEIGHT,
  skin: headerSkin,
  contents: [
    Label($, {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      style: headerStyle,
      string: $.title,
      active: !!$.onBack,
      Behavior: HeaderBehavior
    })
  ]
}));
