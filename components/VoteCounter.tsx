import { FontAwesome, Ionicons as Icon } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Post } from "../hooks/lotide";

export interface VoteCounterProps {
  post: Post;
  voteState: VoteState;
  onVote: (voteState: VoteState) => void;
}

export enum VoteState {
  UPVOTE,
  NEUTRAL,
  DOWNVOTE,
}

export default function VoteCounter(props: VoteCounterProps) {
  return (
    <View style={styles.root}>
      <Icon name="arrow-up-outline" color="#ccc" size={25} />
      <Text style={styles.score}>{`  ${props.post.score}  `}</Text>
      <Icon name="arrow-down" color="#ccc" size={25} />
    </View>
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
    color: "#bbb",
  },
});
