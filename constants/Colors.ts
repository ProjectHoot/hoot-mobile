import { PlatformColor } from "react-native";

const tintColorLight = PlatformColor("systemOrange");
const tintColorDark = PlatformColor("systemOrange");

const both = {
  text: PlatformColor("label"),
  background: PlatformColor("systemBackground"),
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
