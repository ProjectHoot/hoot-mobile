import { Ionicons as Icon } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { View, Text } from "./Themed";
import useTheme from "../hooks/useTheme";
import * as Haptics from "../services/HapticService";
import LotideContext from "../store/LotideContext";
import useVote from "../hooks/useVote";

export interface VoteCounterProps {
  content: Post | Reply;
  type: ContentType;
  hideCount?: boolean;
  style?: ViewStyle;
  onVote?: (isUpvote: boolean) => void;
}

export default function VoteCounter(props: VoteCounterProps) {
  const theme = useTheme();
  const { ctx } = useContext(LotideContext);
  const { isUpvoted, score, addVote, removeVote } = useVote(
    props.type,
    props.content,
  );

  function toggleVote() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (ctx.login === undefined) {
      Alert.alert(
        "Login to like",
        "Leave a like when you login to a community",
      );
      return;
    }

    if (isUpvoted) {
      removeVote();
    } else {
      addVote();
    }
  }

  const scoreColor = isUpvoted ? theme.red : theme.text;

  return (
    <Pressable
      onPress={() => toggleVote()}
      hitSlop={7}
      style={[styles.root, props.style]}
    >
      <View style={styles.root}>
        <Icon
          name={isUpvoted ? "heart" : "heart-outline"}
          color={scoreColor}
          size={25}
        />
        {!props.hideCount && (
          <Text
            style={{ ...styles.score, color: scoreColor }}
          >{`  ${score}  `}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    ...(Platform.OS == "web" ? { cursor: "pointer" } : {}),
  },
  score: {
    fontSize: 18,
    minWidth: 28,
  },
});
