import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export import ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle;

export async function impactAsync(style: ImpactFeedbackStyle) {
  if (Platform.OS === "web") return;
  await Haptics.impactAsync(style);
}
