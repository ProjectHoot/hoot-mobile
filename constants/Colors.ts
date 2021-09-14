import { PlatformColor } from "react-native";

const tintColor = PlatformColor("systemOrange");

const both = {
  tint: tintColor,
  secondaryTint: PlatformColor("systemPurple"),
  text: PlatformColor("label"),
  secondaryText: PlatformColor("secondaryLabel"),
  placeholderText: PlatformColor("placeholderText"),
  background: PlatformColor("systemBackground"),
  secondaryBackground: PlatformColor("secondarySystemBackground"),
  tertiaryBackground: PlatformColor("tertiarySystemBackground"),
  tabIconDefault: PlatformColor("secondaryLabel"),
  tabIconSelected: tintColor,

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
  global: both,
  light: {
    ...both,
  },
  dark: {
    ...both,
  },
};
