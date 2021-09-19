import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "./Themed";
import useTheme from "../hooks/useTheme";

export interface ActorDisplayProps {
  name: string;
  host: string;
  local: boolean;
  colorize?: "always" | "never" | "only_foreign";
  showHost?: "always" | "never" | "only_foreign";
  newLine?: boolean;
}

export default function ActorDisplay(props: ActorDisplayProps) {
  const theme = useTheme();
  const colorize = props.colorize || "never";
  const showHost = props.showHost || "only_foreign";

  const shouldDoIfLocal = (
    when: "always" | "never" | "only_foreign",
    local: boolean,
  ) => {
    if (when === "always") return true;
    if (when === "never") return false;
    return !local;
  };

  const shouldColorize = shouldDoIfLocal(colorize, props.local);
  const shouldShowHost = shouldDoIfLocal(showHost, props.local);

  const nameStyle = shouldColorize
    ? { color: props.local ? theme.blue : theme.green }
    : {};

  return (
    <Text style={styles.root}>
      <Text style={[styles.name, nameStyle]}>{props.name}</Text>
      {shouldShowHost && (
        <Text style={[styles.host, { color: theme.secondaryText }]}>
          {props.newLine && "\n"}@{props.host}
        </Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {},
  name: {
    fontWeight: "500",
  },
  host: {
    fontWeight: "200",
  },
});
