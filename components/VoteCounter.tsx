import { Ionicons as Icon } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { View, Text } from "./Themed";
import useTheme from "../hooks/useTheme";
import * as Haptics from "expo-haptics";
import LotideContext from "../store/LotideContext";
import * as LotideService from "../services/LotideService";

export interface VoteCounterProps {
  post: Post;
  isUpvoted: boolean;
  onVote?: (isUpvote: boolean) => void;
}

export default function VoteCounter(props: VoteCounterProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const theme = useTheme();
  const ctx = useContext(LotideContext).ctx;

  const isUpvotedByAPI =
    props.post.your_vote !== null && props.post.your_vote !== undefined;

  useEffect(() => setIsUpvoted(isUpvotedByAPI), [props.post.your_vote]);

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
      LotideService.removeVote(ctx, props.post.id).then(() =>
        setIsUpvoted(false),
      );
    } else {
      LotideService.applyVote(ctx, props.post.id).then(() =>
        setIsUpvoted(true),
      );
    }
  }

  let scoreColor = theme.text;

  if (isUpvoted) {
    scoreColor = theme.red;
  }

  const shouldAddOne = isUpvoted && !isUpvotedByAPI;
  const shouldSubtractOne = !isUpvoted && isUpvotedByAPI;

  return (
    <Pressable onPress={() => toggleVote()} hitSlop={7}>
      <View style={styles.root}>
        <Icon
          name={isUpvoted ? "heart" : "heart-outline"}
          color={scoreColor}
          size={25}
        />

        <Text style={{ ...styles.score, color: scoreColor }}>{`  ${
          props.post.score + +shouldAddOne - +shouldSubtractOne
        }  `}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 18,
    minWidth: 28,
  },
});
