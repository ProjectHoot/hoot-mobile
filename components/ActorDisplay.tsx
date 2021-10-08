import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text } from "./Themed";
import useTheme from "../hooks/useTheme";
import { useLotideCtx } from "../hooks/useLotideCtx";

export interface ActorDisplayProps {
  name: string;
  host: string;
  local: boolean;
  colorize?: "always" | "never" | "only_foreign";
  showHost?: "always" | "never" | "only_foreign";
  newLine?: boolean;
  style?: StyleProp<TextStyle>;
  styleName?: StyleProp<TextStyle>;
  styleHost?: StyleProp<TextStyle>;
  userId?: UserId;
}

export function ActorDisplay(props: ActorDisplayProps) {
  const theme = useTheme();
  const ctx = useLotideCtx();
  const colorize = props.colorize || "never";
  const showHost = props.showHost || "only_foreign";

  const isUser: boolean =
    (props.userId && props.userId == ctx?.login?.user.id) || false;

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

  const nameStyle = isUser
    ? { color: theme.secondaryTint }
    : shouldColorize
    ? { color: props.local ? theme.blue : theme.green }
    : {};

  return (
    <Text style={[styles.root, props.style]}>
      <Text style={[styles.name, nameStyle, props.styleName]}>
        {props.name}
      </Text>
      {shouldShowHost && (
        <Text
          style={[styles.host, { color: theme.secondaryText }, props.styleHost]}
        >
          {props.newLine && "\n"}
          {!props.newLine && "@"}
          {props.host}
        </Text>
      )}
      {isUser && (
        <Text
          style={[styles.host, { color: theme.secondaryText }, props.styleHost]}
        >
          {" (you)"}
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

export default React.memo(ActorDisplay);
