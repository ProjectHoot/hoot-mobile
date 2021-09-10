import { FontAwesome, Ionicons as Icon } from "@expo/vector-icons";
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
      <Icon name="time-outline" color="#ccc" size={14} /> {elapsedTime}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    color: "#ccc",
  },
});
