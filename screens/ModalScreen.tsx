import Icon from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Share,
} from "react-native";
import * as Haptics from "../services/HapticService";
import PostDisplay from "../components/PostDisplay";
import { View, Text } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import RepliesDisplay from "../components/RepliesDisplay";
import usePost from "../hooks/usePost";

export default function ModalScreen({
  navigation,
  route,
}: RootStackScreenProps<"Post">) {
  const postId = route.params.postId;
  const post = usePost(postId);
  const [highlightedReplies, setHighlightedReplies] = useState(
    route.params.highlightedReplies,
  );
  const theme = useTheme();

  if (!post) return <Text>No post</Text>;

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View
        style={{
          ...styles.item,
          backgroundColor: theme.background,
        }}
      >
        <PostDisplay
          postId={post.id}
          navigation={navigation}
          showHtmlContent
          showAuthor
        />
        <View style={styles.actions}>
          <Icon name="bookmark-outline" size={25} color={theme.text} />
          <Pressable
            hitSlop={5}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("Reply", {
                id: post.id,
                title: post.title,
                html: post.content_html,
                type: "post",
              });
            }}
          >
            <Icon name="arrow-undo-outline" size={25} color={theme.text} />
          </Pressable>
          <Pressable
            hitSlop={5}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Share.share({
                message: post.title,
                url: `https://dev.goldandblack.xyz/p/posts/${post.id}`,
                title: "Hoot",
              });
            }}
          >
            <Icon name="share-outline" size={25} color={theme.text} />
          </Pressable>
        </View>
        {highlightedReplies && (
          <Pressable onPress={() => setHighlightedReplies(undefined)}>
            <Text style={{ color: theme.tint, paddingVertical: 10 }}>
              Show all replies
            </Text>
          </Pressable>
        )}
        <RepliesDisplay
          parentType="post"
          parentId={post.id}
          navigation={navigation}
          postId={post.id}
          highlightedReplies={highlightedReplies}
        />
        <View style={{ height: 300 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 20,
    padding: 15,
  },
  contentText: {
    fontSize: 12,
  },
  link: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#8884",
    borderRadius: 5,
    marginHorizontal: 15,
  },
  image: {
    width: "100%",
    height: undefined,
    resizeMode: "contain",
  },
  foot: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 15,
    borderBottomColor: "#8884",
    borderBottomWidth: 2,
  },
  by: {
    fontSize: 11,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
});
