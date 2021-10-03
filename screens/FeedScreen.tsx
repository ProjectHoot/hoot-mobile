import React, { useContext, useState } from "react";
import { StyleSheet, FlatList, Pressable, Platform } from "react-native";

import PostDisplay from "../components/PostDisplay";
import { View } from "../components/Themed";
import * as Haptics from "../services/HapticService";
import { usePosts } from "../hooks/lotide";
import { RootTabScreenProps } from "../types";
import useTheme from "../hooks/useTheme";
import LotideContext from "../store/LotideContext";
import SuggestLogin from "../components/SuggestLogin";
import { hasLogin } from "../services/LotideService";
import SwipeAction from "../components/SwipeAction";
import useVote from "../hooks/useVote";

export default function FeedScreen({
  navigation,
  route,
}: RootTabScreenProps<"FeedScreen">) {
  const sort = route.params.sort;
  const ctx = useContext(LotideContext).ctx;
  const [posts, isLoadingPosts, refreshPosts, loadNextPage] = usePosts(
    sort,
    true,
  );
  if (!hasLogin(ctx)) return <SuggestLogin />;
  const renderItem = ({ item }: { item: Post }) => (
    <Item post={item} navigation={navigation} />
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(post, index) => `${post.id}-${index}`}
        refreshing={isLoadingPosts}
        onRefresh={refreshPosts}
        onEndReachedThreshold={2}
        onEndReached={loadNextPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginVertical: 0,
    marginHorizontal: 0,
    borderBottomWidth: 8,
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
});

const Item = ({ post, navigation }: { post: Post; navigation: any }) => {
  const { isUpvoted, addVote, removeVote } = useVote("post", post);
  const [isCommitting, setIsCommitting] = useState(false);
  const theme = useTheme();

  return (
    <SwipeAction
      iconLeftSide={
        isUpvoted !== isCommitting
          ? ["heart-dislike", "heart-dislike-outline"]
          : ["heart-outline", "heart"]
      }
      iconRightSide={["arrow-undo-outline", "arrow-undo"]}
      colorLeftSide={theme.red}
      colorRightSide={theme.blue}
      onLeftSide={() => {
        isUpvoted ? removeVote() : addVote();
        setIsCommitting(true);
      }}
      onRightSide={() => {
        navigation.navigate("Reply", {
          id: post.id,
          title: post.title,
          html: post.content_html,
          type: "post",
        });
      }}
      onReturnToCenter={() => setIsCommitting(false)}
      backgroundColor={theme.secondaryBackground}
      style={{ borderBottomWidth: 8, borderColor: theme.secondaryBackground }}
    >
      <Pressable
        style={{
          width: "100%",
          ...(Platform.OS == "web" ? { cursor: "pointer" } : {}),
        }}
        onPress={() => navigation.navigate("Post", { post })}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          console.log(post);
        }}
      >
        <View style={[]}>
          <PostDisplay post={post} navigation={navigation} />
        </View>
      </Pressable>
    </SwipeAction>
  );
};
