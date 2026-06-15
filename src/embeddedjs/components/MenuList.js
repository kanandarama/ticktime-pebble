import {} from "piu/MC";
import { rowSkin, menuStyle, subStyle } from "../styles";

class RowBehavior extends Behavior {
  onCreate(row, data) {
    this.data = data;
  }
  onTouchEnded(row) {
    if (this.data && this.data.onSelect) {
      this.data.onSelect(this.data.item, this.data.index);
    }
  }
}

const MenuRow = Container.template(($) => ({
  left: 0,
  right: 0,
  height: $.subtitle ? 44 : 36,
  skin: rowSkin,
  active: true,
  Behavior: RowBehavior,
  contents: [
    Label($, {
      left: 8,
      right: 8,
      top: $.subtitle ? 4 : 8,
      style: menuStyle,
      string: $.title
    }),
    Label($, {
      left: 8,
      right: 8,
      top: 22,
      style: subStyle,
      string: $.subtitle || ""
    })
  ]
}));

export function buildMenuList($, top, items, onSelect) {
  const rows = items.map((item, index) =>
    MenuRow($, {
      title: item.title,
      subtitle: item.subtitle || "",
      item: item,
      index: index,
      onSelect: onSelect
    })
  );

  return Scroller($, {
    left: 0,
    right: 0,
    top: top || 0,
    bottom: 0,
    clip: true,
    active: true,
    contents: [
      Column($, {
        left: 0,
        right: 0,
        top: 0,
        contents: rows
      })
    ]
  });
}
