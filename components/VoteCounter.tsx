import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text } from "react-native";
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
    <Text style={styles.root}>
      <FontAwesome name="chevron-up" size={20} style={{ marginRight: 15 }} />
      {"   "}
      <Text style={styles.score}>{props.post.score}</Text>
      {"   "}
      <FontAwesome name="chevron-down" size={20} style={{ marginRight: 15 }} />
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    color: "#ccc",
  },
  score: {
    fontSize: 18,
    color: "#bbb",
  },
});
