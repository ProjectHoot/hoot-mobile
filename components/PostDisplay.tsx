import React from "react";
import Icon from "@expo/vector-icons/Ionicons";
import { StyleSheet, Pressable, Platform, ViewStyle } from "react-native";
import ElapsedTime from "./ElapsedTime";
import VoteCounter from "./VoteCounter";
import { Text, View } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import ContentDisplay from "./ContentDisplay";
import ActorDisplay from "./ActorDisplay";
import usePost from "../hooks/usePost";
import HrefDisplay from "./HrefDisplay";

export interface PostDisplayProps {
  postId: PostId;
  navigation: any;
  truncateContent?: boolean;
  showAuthor?: boolean;
}

export default function PostDisplay(props: PostDisplayProps) {
  const post = usePost(props.postId);
  const theme = useTheme();

  if (!post) return <Text>Failed to load post</Text>;

  return (
    <View>
      <Text style={styles.title}>
        {post.sticky && (
          <>
            <Icon name="pin" size={25} color={theme.secondaryTint} />{" "}
          </>
        )}
        {post.title} {post.id}
      </Text>
      <ActorDisplay
        name={post.author.username}
        host={post.author.host}
        local={post.author.local}
        showHost={"only_foreign"}
        colorize={"never"}
        newLine={true}
        userId={post.author.id}
        style={styles.username}
      />
      {post.href && <HrefDisplay href={post.href} />}
      {!!post.content_html && (
        <View style={{ padding: 15 }}>
          <ContentDisplay
            contentHtml={post.content_html}
            contentText={post.content_text}
            maxChars={props.truncateContent ? 200 : undefined}
            postId={post.id}
          />
        </View>
      )}
      <View style={styles.foot}>
        <Pressable
          hitSlop={8}
          onPress={() =>
            props.navigation.navigate("Community", {
              community: post.community,
            })
          }
          style={[styles.footItem, styles.pointer]}
        >
          <ActorDisplay
            name={post.community.name}
            host={post.community.host}
            local={post.community.local}
            showHost={"only_foreign"}
            colorize={props.showAuthor ? "always" : "never"}
            newLine={true}
          />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.footItem}>
          <ElapsedTime time={post.created} />
        </View>
        <View style={styles.footItem}>
          <Text style={styles.footText}>
            <Icon name="chatbubble-outline" size={12} />{" "}
            {post.replies_count_total}
          </Text>
        </View>
        <View style={styles.footItem}>
          <VoteCounter type="post" content={post} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
  pointer: {
    ...(Platform.OS == "web" ? { cursor: "pointer" } : {}),
  } as ViewStyle,
  title: {
    fontSize: 20,
    padding: 15,
  },
  username: {
    paddingLeft: 15,
    paddingBottom: 15,
  },
  contentText: {
    fontSize: 12,
  },
  link: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 15,
    ...(Platform.OS == "web" ? { cursor: "pointer" } : {}),
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
  },
  footText: {},
  footItem: {
    padding: 15,
  },
  by: {
    fontSize: 11,
  },
  score: {
    fontSize: 18,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
});
