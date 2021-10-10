import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import ActorDisplay from "../components/ActorDisplay";
import ContentDisplay from "../components/ContentDisplay";
import SuggestLogin from "../components/SuggestLogin";

import { Text, View } from "../components/Themed";
import { useLotideCtx } from "../hooks/useLotideCtx";
import usePost from "../hooks/usePost";
import useReply from "../hooks/useReply";
import useTheme from "../hooks/useTheme";
import * as LotideService from "../services/LotideService";
import { RootTabScreenProps } from "../types";

export default function NotificationScreen({
  navigation,
}: RootTabScreenProps<"NotificationScreen">) {
  const [notifications, setNotifications] = useState<FullNotification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [focusId, setFocusId] = useState(0);
  const theme = useTheme();
  const ctx = useLotideCtx();

  useEffect(() => {
    if (!ctx?.login) return;
    LotideService.getNotifications(ctx)
      .then(setNotifications)
      .then(() => setIsRefreshing(false));
  }, [focusId]);

  useEffect(
    () => navigation.addListener("focus", () => setFocusId(i => i + 1)),
    [],
  );

  if (!ctx?.login) return <SuggestLogin />;

  const renderItem = ({ item }: { item: FullNotification }) => (
    <Item item={item} />
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      data={notifications}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.replyId}-${index}`}
      refreshing={isRefreshing}
      onRefresh={() => {
        setIsRefreshing(true);
        setFocusId(i => i + 1);
      }}
    ></FlatList>
  );
}

const Item = ({ item }: { item: FullNotification }) => {
  const post = usePost(item.postId);
  const originReply = useReply(
    item.origin.type == "reply" ? item.origin.id : undefined,
  );
  const reply = useReply(item.replyId);
  const theme = useTheme();
  const navigation = useNavigation();

  if (!post || !reply || (item.origin.type === "reply" && !originReply))
    return null;

  return (
    <Pressable
      style={[
        styles.item,
        {
          borderBottomColor: theme.secondaryBackground,
        },
      ]}
      onPress={() => {
        const highlightedReplies =
          item.origin.type === "reply"
            ? [item.origin.id, item.replyId]
            : [item.replyId];
        navigation.navigate("Post", {
          postId: item.postId,
          highlightedReplies,
        });
      }}
    >
      <Text>
        New reply to your {item.origin.type == "post" ? "Post" : "Reply"}
      </Text>
      <Text style={styles.title}>{post.title}</Text>
      <ActorDisplay
        name={post.author.username}
        host={post.author.host}
        local={post.author.local}
        showHost="only_foreign"
        colorize="never"
        userId={post.author.id}
      />
      {item.origin.type === "reply" && originReply ? (
        <>
          <View style={[styles.level1, { borderColor: theme.secondaryText }]}>
            <ActorDisplay
              name={originReply.author.username}
              host={originReply.author.host}
              local={originReply.author.local}
              showHost="only_foreign"
              colorize="only_foreign"
              userId={originReply.author.id}
            />
            <ContentDisplay
              contentHtml={originReply.content_html}
              contentText={originReply.content_text}
            />
          </View>
          <View
            style={[
              styles.level2,
              {
                borderColor: theme.tint,
                backgroundColor: theme.secondaryBackground,
              },
            ]}
          >
            <ActorDisplay
              name={reply.author.username}
              host={reply.author.host}
              local={reply.author.local}
              showHost="only_foreign"
              colorize="only_foreign"
            />
            <ContentDisplay
              contentHtml={reply.content_html}
              contentText={reply.content_text}
            />
          </View>
        </>
      ) : (
        <>
          <View
            style={[
              styles.level1,
              {
                borderColor: theme.tint,
                backgroundColor: theme.secondaryBackground,
              },
            ]}
          >
            <ActorDisplay
              name={reply.author.username}
              host={reply.author.host}
              local={reply.author.local}
              showHost="only_foreign"
              colorize="only_foreign"
            />
            <ContentDisplay
              contentHtml={reply.content_html}
              contentText={reply.content_text}
            />
          </View>
        </>
      )}
      <View style={styles.community}>
        <ActorDisplay
          name={post.community.name}
          host={post.community.host}
          local={post.community.local}
          showHost={"always"}
          colorize={"never"}
          newLine
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    borderBottomWidth: 5,
    padding: 15,
  },
  title: {
    fontSize: 20,
    marginTop: 15,
  },
  level1: {
    marginTop: 15,
    borderLeftWidth: 2,
    paddingLeft: 15,
    padding: 5,
  },
  level2: {
    marginTop: 5,
    marginLeft: 15,
    borderLeftWidth: 2,
    paddingLeft: 15,
    padding: 5,
  },
  name: {
    fontWeight: "600",
    marginBottom: 3,
  },
  thin: {
    fontWeight: "200",
  },
  community: {
    marginTop: 15,
  },
});
