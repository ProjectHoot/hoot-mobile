import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import ActorDisplay from "../components/ActorDisplay";
import ContentDisplay from "../components/ContentDisplay";
import SuggestLogin from "../components/SuggestLogin";

import { Text, View } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import { transformToFullNotification } from "../transformers/NotificationTransformer";
import { RootTabScreenProps } from "../types";

export default function NotificationScreen({
  navigation,
}: RootTabScreenProps<"NotificationScreen">) {
  const [notifications, setNotifications] = useState<FullNotification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [focusId, setFocusId] = useState(0);
  const theme = useTheme();
  const ctx = useContext(LotideContext).ctx;

  useEffect(() => {
    if (!ctx.login) return;
    LotideService.getNotifications(ctx).then(notifications => {
      const promises = notifications.map(n =>
        transformToFullNotification(ctx, n),
      );
      Promise.all(promises)
        .then(setNotifications)
        .then(() => setIsRefreshing(false));
    });
  }, [focusId]);

  useEffect(
    () => navigation.addListener("focus", () => setFocusId(i => i + 1)),
    [],
  );

  if (!ctx.login) return <SuggestLogin />;

  const renderItem = ({ item }: { item: FullNotification }) => {
    return (
      <View style={[styles.item, { borderColor: theme.secondaryBackground }]}>
        <Text style={styles.name}>{item.post.author.username}</Text>
        <Text style={styles.title}>{item.post.title}</Text>
        <Text>
          In{" "}
          <ActorDisplay
            name={item.post.community.name}
            host={item.post.community.host}
            local={item.post.community.local}
            showHost={"always"}
            colorize={"never"}
          />
        </Text>
        {item.origin.type === "comment" ? (
          <>
            <View style={[styles.level1, { borderColor: theme.secondaryText }]}>
              <Text style={styles.name}>{item.origin.author.username}</Text>
              <ContentDisplay
                contentHtml={item.origin.content_html}
                contentText={item.origin.content_text}
              />
            </View>
            <View style={[styles.level2, { borderColor: theme.tint }]}>
              <Text style={styles.name}>{item.reply.author.username}</Text>
              <ContentDisplay
                contentHtml={item.reply.content_html}
                contentText={item.reply.content_text}
              />
            </View>
          </>
        ) : (
          <>
            <View style={[styles.level1, { borderColor: theme.tint }]}>
              <Text style={styles.name}>{item.reply.author.username}</Text>
              <ContentDisplay
                contentHtml={item.reply.content_html}
                contentText={item.reply.content_text}
              />
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={notifications}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.reply.id}-${index}`}
      refreshing={isRefreshing}
      onRefresh={() => {
        setIsRefreshing(true);
        setFocusId(i => i + 1);
      }}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: { borderBottomWidth: 5, padding: 15 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  level1: {
    marginTop: 5,
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
});
