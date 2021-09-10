import Icon from "@expo/vector-icons/Ionicons";
import { openURL } from "expo-linking";
import * as React from "react";
import {
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  TouchableHighlight,
  ScrollView,
  Pressable,
} from "react-native";
import HTMLView from "react-native-htmlview";

import EditScreenInfo from "../components/EditScreenInfo";
import ElapsedTime from "../components/ElapsedTime";
import PostDisplay from "../components/PostDisplay";
import { Text, View } from "../components/Themed";
import VoteCounter, { VoteState } from "../components/VoteCounter";
import { Replies, Reply, Post, useReplies } from "../hooks/lotide";
import { RootStackParamList, RootStackScreenProps } from "../types";

export default function ModalScreen({ route }: RootStackScreenProps<"Modal">) {
  const post = (route.params as any | undefined)?.post as Post | undefined;
  if (!post) {
    return null;
  }
  const replies = useReplies(post.id);
  const [imgAspect, setImgAspect] = React.useState(1);
  const isImage = isImageUrl(post.href);

  return (
    <ScrollView>
      <View style={styles.item}>
        <PostDisplay post={post} showHtmlContent showCommunityHost />
        <View style={styles.actions}>
          <Icon name="bookmark-outline" color="#ccc" size={20} />
          <Icon name="return-up-back-outline" color="#ccc" size={20} />
          <Icon name="share-outline" color="#ccc" size={20} />
        </View>
        <RepliesDisplay replies={replies} />
      </View>
      <View>
        <Text style={{ textAlign: "center" }}>
          {"\n"}
          {replies.items.length === 0 ? "No replies yet" : "No more replies"}
          {"\n\n\n\n"}
        </Text>
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
    backgroundColor: "#000000",
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 20,
    padding: 15,
    color: "#eee",
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
  footText: {
    color: "#ccc",
  },
  by: {
    fontSize: 11,
  },
  score: {
    fontSize: 18,
    color: "#bbb",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    color: "#ccc",
    padding: 10,
  },
});

function renderNode(
  node: any,
  index: any,
  siblings: any,
  parent: any,
  defaultRenderer: any
) {
  if (node.name == "iframe" || node.name == "img" || node.name == "hr") {
    return null;
  }
}

function isImageUrl(url: string): boolean {
  return [".jpg", ".jpeg", ".png", ".bmp", ".gif"].some((ext) =>
    url.endsWith(ext)
  );
}

function RepliesDisplay({
  replies,
  layer = 0,
}: {
  replies: Replies;
  layer?: number;
}) {
  return (
    <View>
      {replies.items.map((reply) => (
        <ReplyDisplay reply={reply} layer={layer} key={reply.id} />
      ))}
    </View>
  );
}

function ReplyDisplay({ reply, layer = 0 }: { reply: Reply; layer: number }) {
  const [showChildren, setShowChildren] = React.useState(true);
  return (
    <View style={{ paddingLeft: 0 }}>
      <View
        style={{
          paddingVertical: 8,
          borderTopWidth: 0.5,
          borderTopColor: "#8884",
        }}
      >
        <Pressable onPress={() => setShowChildren((s) => !s)}>
          <View
            style={{
              borderLeftWidth: 2,
              borderColor: LAYER_COLORS[layer % LAYER_COLORS.length],
              paddingLeft: 15,
              paddingVertical: 3,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, marginBottom: 5 }}>
              {reply.author.username}
              {"  "}
              <Text style={{ color: "#888", fontSize: 14 }}>
                <Icon name="arrow-up" size={14} color="#888a" light />{" "}
                {reply.score}
                {"   "}
                <ElapsedTime time={reply.created} />
              </Text>
            </Text>
            {showChildren && (
              <HTMLView
                value={reply.content_html.replaceAll("\n", "")}
                // value="<h1>hello</h1>"
                stylesheet={{
                  p: { color: "#ddd", fontSize: 16 },
                  h1: {
                    color: "#ddd",
                    fontSize: 24,
                  },
                }}
              />
            )}
          </View>
        </Pressable>
      </View>
      {reply.replies.items.length > 0 && showChildren && (
        <View style={{ paddingLeft: 15 }}>
          <RepliesDisplay replies={reply.replies} layer={layer + 1} />
        </View>
      )}
    </View>
  );
}

const LAYER_COLORS = ["#AAA", "#A22", "#AA2", "#2A2", "#2AA", "#22A"];
