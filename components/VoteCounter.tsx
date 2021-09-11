import { FontAwesome, Ionicons as Icon } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Post, applyVote, removeVote } from "../hooks/lotide";

export interface VoteCounterProps {
  post: Post;
  isUpvoted: boolean;
  onVote: (isUpvote: boolean) => void;
}

export default function VoteCounter(props: VoteCounterProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);

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

  let scoreColor = "#bbb";

  if (isUpvoted) {
    scoreColor = "#F23";
  }

  return (
    <Pressable onPress={() => toggleVote()} hitSlop={7}>
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
    color: "#ccc",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 18,
  },
});
