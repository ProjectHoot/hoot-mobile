import { Ionicons as Icon } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { Text } from "./Themed";
import useElapsedTime from "../hooks/useElapsedTime";

export interface ElapsedTimeProps {
  time: string;
}

export default function ElapsedTime(props: ElapsedTimeProps) {
  const elapsedTime = useElapsedTime(props.time);
  return (
    <Pressable
      hitSlop={8}
      onPress={() => Alert.alert("Date posted", props.time)}
    >
      <Text style={styles.root}>
        <Icon name="time-outline" size={14} /> {elapsedTime}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {},
});
