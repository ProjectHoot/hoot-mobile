import Icon from "@expo/vector-icons/Ionicons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Share,
} from "react-native";
import HTMLView from "react-native-htmlview";
import * as Haptics from "expo-haptics";
import ElapsedTime from "../components/ElapsedTime";
import PostDisplay from "../components/PostDisplay";
import { Text, View } from "../components/Themed";
import { useReplies } from "../hooks/lotide";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import LotideContext from "../store/LotideContext";

export default function ModalScreen({
  navigation,
  route,
}: RootStackScreenProps<"Modal">) {
  const post = route.params.post;
  const [focusId, setFocusId] = useState(0);
  const ctx = useContext(LotideContext).ctx;
  const replies = useReplies(ctx, post.id, [focusId]);
  const theme = useTheme();

  useEffect(() => {
    navigation.addListener("focus", () => {
      setFocusId(x => x + 1);
    });
  });

  return (
    <ScrollView>
      <View
        style={{
          ...styles.item,
          backgroundColor: theme.background,
        }}
      >
        <PostDisplay
          post={post}
          navigation={navigation}
          showHtmlContent
          showCommunityHost
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
        <RepliesDisplay replies={replies} navigation={navigation} />
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
  navigation,
}: {
  replies: Paged<Reply>;
  layer?: number;
  navigation: any;
}) {
  return (
    <View>
      {replies.items.map(reply => (
        <ReplyDisplay
          reply={reply}
          layer={layer}
          key={reply.id}
          navigation={navigation}
        />
      ))}
    </View>
  );
}

function ReplyDisplay({
  reply,
  layer = 0,
  navigation,
}: {
  reply: Reply;
  layer: number;
  navigation: any;
}) {
  const [showChildren, setShowChildren] = React.useState(true);
  const theme = useTheme();
  const layerColors = useMemo(
    () => [
      theme.text,
      theme.red,
      theme.orange,
      theme.yellow,
      theme.green,
      theme.teal,
      theme.blue,
      theme.indigo,
      theme.purple,
    ],
    [],
  );
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
            navigation.navigate("Reply", {
              id: reply.id,
              title: reply.author.username,
              html: reply.content_html,
              type: "reply",
            });
          }}
        >
          <View
            style={{
              borderLeftWidth: 2,
              borderColor: layerColors[layer % layerColors.length],
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
            {showChildren && !!reply.content_html && (
              <HTMLView
                value={reply.content_html
                  .replace(/<hr>/g, "")
                  .replace(/\n/g, "")}
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
          <RepliesDisplay
            replies={reply.replies}
            layer={layer + 1}
            navigation={navigation}
          />
        </View>
      )}
    </View>
  );
}
