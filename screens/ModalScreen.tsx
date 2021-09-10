import { FontAwesome } from "@expo/vector-icons";
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
import { Text, View } from "../components/Themed";
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
  const seconds = Math.round((Date.now() - Date.parse(post.created)) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const displayTime =
    (minutes < 60 && `${minutes}m`) ||
    (hours < 24 && `${hours}h`) ||
    (days < 7 && `${days}d`) ||
    `${weeks}w`;
  return (
    <ScrollView>
      <View style={styles.item}>
        <Text style={styles.title}>{post.title}</Text>
        {isImage ? (
          <Image
            style={{ ...styles.image, aspectRatio: imgAspect }}
            source={{
              uri: post.href,
            }}
            onLoad={(event) =>
              setImgAspect(
                Math.max(
                  event.nativeEvent.source.width /
                    event.nativeEvent.source.height,
                  0.25
                )
              )
            }
          />
        ) : (
          <TouchableHighlight
            style={styles.link}
            onPress={() => openURL(post.href)}
          >
            <Text>{post.href}</Text>
          </TouchableHighlight>
        )}
        <View>
          <HTMLView
            value={post.content_html
              .replaceAll("<hr>", "")
              .replaceAll("\n", "")}
            renderNode={renderNode}
            stylesheet={{
              p: { color: "#ddd" },
            }}
          />
        </View>
        <View style={styles.foot}>
          <View>
            <Text>{post.community.name}</Text>
            <Text style={styles.by}>by {post.author.username}</Text>
            <Text style={styles.by}>on {post.community.host}</Text>
          </View>
          <View>
            <Text style={styles.footText}>
              <FontAwesome
                name="history"
                size={12}
                style={{ marginRight: 15 }}
              />{" "}
              {displayTime}
            </Text>
          </View>
          <View>
            <Text style={styles.footText}>
              <FontAwesome
                name="comment"
                size={12}
                style={{ marginRight: 15 }}
              />{" "}
              {post.replies_count_total}
            </Text>
          </View>
          <View>
            <Text style={styles.footText}>
              <FontAwesome
                name="chevron-up"
                size={20}
                style={{ marginRight: 15 }}
              />
              {"   "}
              <Text style={styles.score}>{post.score}</Text>
              {"   "}
              <FontAwesome
                name="chevron-down"
                size={20}
                style={{ marginRight: 15 }}
              />
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <FontAwesome
            name="bookmark"
            size={20}
            style={{ marginRight: 15 }}
            color="#ccc"
          />
          <FontAwesome
            name="reply"
            size={20}
            style={{ marginRight: 15 }}
            color="#ccc"
          />
          <FontAwesome
            name="share-square"
            size={20}
            style={{ marginRight: 15 }}
            color="#ccc"
          />
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
  const seconds = Math.round((Date.now() - Date.parse(reply.created)) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const displayTime =
    (minutes < 60 && `${minutes}m`) ||
    (hours < 24 && `${hours}h`) ||
    (days < 7 && `${days}d`) ||
    `${weeks}w`;
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
                <FontAwesome
                  name="arrow-up"
                  size={14}
                  style={{ marginRight: 15 }}
                  color="#888a"
                />{" "}
                {reply.score}
                {"   "}
                <FontAwesome
                  name="history"
                  size={14}
                  style={{ marginRight: 15 }}
                  color="#888a"
                />{" "}
                {displayTime}
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
