import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text } from "react-native";

export interface ElapsedTimeProps {
  time: string;
}

export default function ElapsedTime(props: ElapsedTimeProps) {
  const seconds = Math.round((Date.now() - Date.parse(props.time)) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const displayTime =
    (minutes < 60 && `${minutes}m`) ||
    (hours < 24 && `${hours}h`) ||
    (days < 7 && `${days}d`) ||
    `${weeks}w`;
  return (
    <Text style={styles.root}>
      <FontAwesome name="history" size={12} style={{ marginRight: 15 }} />{" "}
      {displayTime}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    color: "#ccc",
  },
});
