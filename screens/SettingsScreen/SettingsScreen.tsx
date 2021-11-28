import React from "react";
import { View } from "../../components/Themed";
import { SettingsScreen, SettingsData } from "react-native-settings-screen";

export default () => {
  return (
    <View>
      <SettingsScreen data={DATA} />
    </View>
  );
};

const DATA: SettingsData = [
  {
    type: "SECTION",
    header: "FEED",
    rows: [{ title: "Default Sort", subtitle: "Subtitle" }],
  },
];
