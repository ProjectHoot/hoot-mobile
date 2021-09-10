import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import useElapsedTime from "../hooks/useElapsedTime";

export interface ElapsedTimeProps {
  time: string;
}

export default function ElapsedTime(props: ElapsedTimeProps) {
  const elapsedTime = useElapsedTime(props.time);
  return (
    <Text style={styles.root}>
      <FontAwesome name="history" size={12} style={{ marginRight: 15 }} />{" "}
      {elapsedTime}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    color: "#ccc",
  },
});
