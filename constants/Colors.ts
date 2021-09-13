import { PlatformColor } from "react-native";

const tintColorLight = PlatformColor("systemOrange");
const tintColorDark = PlatformColor("systemOrange");

const both = {
  text: PlatformColor("label"),
  secondaryText: PlatformColor("secondaryLabel"),
  placeholderText: PlatformColor("placeholderText"),
  background: PlatformColor("systemBackground"),
  secondaryBackground: PlatformColor("secondarySystemBackground"),

  red: PlatformColor("systemRed"),
  orange: PlatformColor("systemOrange"),
  yellow: PlatformColor("systemYellow"),
  green: PlatformColor("systemGreen"),
  teal: PlatformColor("systemTeal"),
  blue: PlatformColor("systemBlue"),
  indigo: PlatformColor("systemIndigo"),
  purple: PlatformColor("systemPurple"),
};

export default {
  light: {
    ...both,
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    ...both,
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};
