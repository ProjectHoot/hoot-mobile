import { ColorValue, Platform } from "react-native";
const PlatformColor =
  Platform.OS === "web" ? () => {} : require("react-native").PlatformColor;

export interface ColorsObject {
  tint: ColorValue;
  secondaryTint: ColorValue;
  text: ColorValue;
  secondaryText: ColorValue;
  placeholderText: ColorValue;
  background: ColorValue;
  secondaryBackground: ColorValue;
  tertiaryBackground: ColorValue;
  tabIconDefault: ColorValue;
  tabIconSelected: ColorValue;

  red: ColorValue;
  orange: ColorValue;
  yellow: ColorValue;
  green: ColorValue;
  teal: ColorValue;
  blue: ColorValue;
  indigo: ColorValue;
  purple: ColorValue;
}

export default {
  light: Platform.OS === "ios" ? buildIOS() : buildAltLight(),
  dark: Platform.OS === "ios" ? buildIOS() : buildAltDark(),
};

function buildIOS(): ColorsObject {
  return {
    tint: PlatformColor("systemOrange"),
    secondaryTint: PlatformColor("systemPurple"),
    text: PlatformColor("label"),
    secondaryText: PlatformColor("secondaryLabel"),
    placeholderText: PlatformColor("placeholderText"),
    background: PlatformColor("systemBackground"),
    secondaryBackground: PlatformColor("secondarySystemBackground"),
    tertiaryBackground: PlatformColor("tertiarySystemBackground"),
    tabIconDefault: PlatformColor("secondaryLabel"),
    tabIconSelected: PlatformColor("systemOrange"),

    red: PlatformColor("systemRed"),
    orange: PlatformColor("systemOrange"),
    yellow: PlatformColor("systemYellow"),
    green: PlatformColor("systemGreen"),
    teal: PlatformColor("systemTeal"),
    blue: PlatformColor("systemBlue"),
    indigo: PlatformColor("systemIndigo"),
    purple: PlatformColor("systemPurple"),
  };
}

function buildAltLight(): ColorsObject {
  return {
    tint: "orange",
    secondaryTint: "purple",
    text: "#111",
    secondaryText: "#333",
    placeholderText: "#444",
    background: "#fff",
    secondaryBackground: "#eee",
    tertiaryBackground: "#ccc",
    tabIconDefault: "#ccc",
    tabIconSelected: "orange",

    red: "red",
    orange: "orange",
    yellow: "yellow",
    green: "green",
    teal: "eeal",
    blue: "blue",
    indigo: "indigo",
    purple: "purple",
  };
}

function buildAltDark(): ColorsObject {
  return {
    tint: "orange",
    secondaryTint: "purple",
    text: "#fff",
    secondaryText: "#666",
    placeholderText: "#aaa",
    background: "#111",
    secondaryBackground: "#222",
    tertiaryBackground: "#222",
    tabIconDefault: "#ccc",
    tabIconSelected: "orange",

    red: "red",
    orange: "orange",
    yellow: "yellow",
    green: "green",
    teal: "eeal",
    blue: "#68f",
    indigo: "indigo",
    purple: "purple",
  };
}
