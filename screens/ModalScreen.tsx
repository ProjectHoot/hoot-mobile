import Icon from "@expo/vector-icons/Ionicons";
import React, { useContext } from "react";
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Share,
  Alert,
} from "react-native";
import HTMLView from "react-native-htmlview";
import * as Haptics from "expo-haptics";
import ElapsedTime from "../components/ElapsedTime";
import PostDisplay from "../components/PostDisplay";
import { Text, View } from "../components/Themed";
import { useReplies } from "../hooks/lotide";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import Colors from "../constants/Colors";

export default function ModalScreen({ route }: RootStackScreenProps<"Modal">) {
  const post = (route.params as any | undefined)?.post as Post | undefined;
  if (!post) {
    return null;
  }
  const ctx = useContext(LotideContext).ctx;
  const replies = useReplies(ctx, post.id);
  const theme = useTheme();

  return (
    <ScrollView>
      <View
        style={{
          ...styles.item,
          backgroundColor: theme.background,
        }}
      >
        <PostDisplay post={post} showHtmlContent showCommunityHost />
        <View style={styles.actions}>
          <Icon name="bookmark-outline" size={25} color={theme.text} />
          <Pressable
            hitSlop={5}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.prompt("Reply", "Leave a reply", reply =>
                LotideService.replyToPost(ctx, post.id, reply),
              );
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

function RepliesDisplay({
  replies,
  layer = 0,
}: {
  replies: Replies;
  layer?: number;
}) {
  return (
    <View>
      {replies.items.map(reply => (
        <ReplyDisplay reply={reply} layer={layer} key={reply.id} />
      ))}
    </View>
  );
}

function ReplyDisplay({ reply, layer = 0 }: { reply: Reply; layer: number }) {
  const [showChildren, setShowChildren] = React.useState(true);
  const ctx = useContext(LotideContext).ctx;
  const theme = useTheme();
  return (
    <View style={{ paddingLeft: 0 }}>
      <View
        style={{
          paddingVertical: 8,
          borderTopWidth: 0.5,
          borderTopColor: theme.secondaryBackground,
        }}
      >
        <Pressable
          onPress={() => setShowChildren(s => !s)}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.prompt("Reply", "Leave a reply", newReply =>
              LotideService.replyToReply(ctx, reply.id, newReply),
            );
          }}
        >
          <View
            style={{
              borderLeftWidth: 2,
              borderColor: LAYER_COLORS[layer % LAYER_COLORS.length],
              paddingLeft: 15,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 16,
                marginBottom: 5,
                fontWeight: "500",
              }}
            >
              {reply.author.username}
              {"  "}
              <Text style={{ color: theme.text, fontSize: 14 }}>
                <Icon name="arrow-up" size={14} color={theme.text} light />{" "}
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
                  p: { color: theme.text, fontSize: 16, fontWeight: "300" },
                  h1: {
                    color: theme.text,
                    fontSize: 24,
                    fontWeight: "300",
                  },
                }}
              />
            )}
          </View>
        </Pressable>
      </View>
      {reply.replies && reply.replies.items.length > 0 && showChildren && (
        <View style={{ paddingLeft: 15 }}>
          <RepliesDisplay replies={reply.replies} layer={layer + 1} />
        </View>
      )}
    </View>
  );
}

const LAYER_COLORS = [
  Colors.global.text,
  Colors.global.red,
  Colors.global.orange,
  Colors.global.yellow,
  Colors.global.green,
  Colors.global.teal,
  Colors.global.blue,
  Colors.global.indigo,
  Colors.global.purple,
];
