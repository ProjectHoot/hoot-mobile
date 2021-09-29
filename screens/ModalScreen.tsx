import Icon from "@expo/vector-icons/Ionicons";
import React, { useContext, useEffect, useState } from "react";
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
import { useReplies } from "../hooks/lotide";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import LotideContext from "../store/LotideContext";
import RepliesDisplay from "../components/RepliesDisplay";
import { SelectedReplyContext } from "../store/SelectedReplyContext";

export default function ModalScreen({
  navigation,
  route,
}: RootStackScreenProps<"Post">) {
  const post = route.params.post;
  const [highlightedReplies, setHighlightedReplies] = useState(
    route.params.highlightedReplies,
  );
  const [focusId, setFocusId] = useState(0);
  const [selectedReply, setSelectedReply] = useState<ReplyId>();
  const ctx = useContext(LotideContext).ctx;
  const replies = useReplies(
    ctx,
    post.id,
    [focusId, highlightedReplies?.join(",")],
    highlightedReplies?.[0],
  );
  const theme = useTheme();

  useEffect(
    () => navigation.addListener("focus", () => setFocusId(x => x + 1)),
    [],
  );

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
        {highlightedReplies && (
          <Pressable onPress={() => setHighlightedReplies(undefined)}>
            <Text style={{ color: theme.tint, paddingVertical: 10 }}>
              Show all replies
            </Text>
          </Pressable>
        )}
        <SelectedReplyContext.Provider
          value={[selectedReply, setSelectedReply]}
        >
          <RepliesDisplay
            replies={replies}
            navigation={navigation}
            postId={post.id}
            highlightedReplies={highlightedReplies}
          />
        </SelectedReplyContext.Provider>
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
