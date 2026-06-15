import {} from "piu/MC";

export const blackSkin = new Skin({ fill: "black" });
export const whiteSkin = new Skin({ fill: "white" });
export const headerSkin = new Skin({ fill: "#1a1a1a" });
export const rowSkin = new Skin({ fill: ["#222222", "#333333"] });
export const accentSkin = new Skin({ fill: "#4A90D9" });
export const dangerSkin = new Skin({ fill: "#8B0000" });

export const titleStyle = new Style({
  font: "bold 18px Gothic",
  color: "white",
  horizontal: "center"
});

export const headerStyle = new Style({
  font: "bold 14px Gothic",
  color: "white",
  left: 8,
  right: 8,
  top: 6,
  bottom: 6
});

export const menuStyle = new Style({
  font: "14px Gothic",
  color: "white",
  left: 10,
  right: 10,
  top: 10,
  bottom: 10
});

export const subStyle = new Style({
  font: "12px Gothic",
  color: "#AAAAAA",
  left: 10,
  right: 10,
  top: 0,
  bottom: 8
});

export const bodyStyle = new Style({
  font: "14px Gothic",
  color: "white",
  left: 8,
  right: 8,
  top: 4,
  bottom: 4
});

export const smallStyle = new Style({
  font: "12px Gothic",
  color: "#CCCCCC",
  left: 8,
  right: 8
});

export const SCREEN_HEIGHT = 228;
export const HEADER_HEIGHT = 28;
