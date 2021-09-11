import { FontAwesome, Ionicons as Icon } from "@expo/vector-icons";
import React, { useState } from "react";
import { PlatformColor, Pressable, StyleSheet } from "react-native";
import { View, Text } from "./Themed";
import { Post, applyVote, removeVote } from "../hooks/lotide";
import useTheme from "../hooks/useTheme";
import * as Haptics from "expo-haptics";

export interface VoteCounterProps {
  post: Post;
  isUpvoted: boolean;
  onVote: (isUpvote: boolean) => void;
}

export default function VoteCounter(props: VoteCounterProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const theme = useTheme();

  function toggleVote() {
    if (isUpvoted) {
      removeVote;
    } else {
      applyVote(props.post.id)
        .then((data) => data.text())
        .then((data) => console.log(data))
        .catch((e) => console.log(e));
    }
    setIsUpvoted(!isUpvoted);
  }

  let scoreColor = theme.text;

  if (isUpvoted) {
    scoreColor = PlatformColor("systemRed");
  }

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleVote();
      }}
      hitSlop={7}
    >
      <View style={styles.root}>
        <Icon
          name={isUpvoted ? "heart" : "heart-outline"}
          color={scoreColor}
          size={25}
        />

        <Text style={{ ...styles.score, color: scoreColor }}>{`  ${
          props.post.score + (isUpvoted ? 1 : 0)
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
  },
});
