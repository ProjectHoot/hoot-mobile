import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, FlatList, Pressable, StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import * as Haptics from "../services/HapticService";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import { usePosts } from "../hooks/lotide";
import PostDisplay from "../components/PostDisplay";

export default function CommunityScreen({
  navigation,
  route,
}: RootStackScreenProps<"Community">) {
  const [community, setCommunity] = useState(route.params.community);
  const [posts, isLoadingPosts, refreshPosts, loadNextPage] = usePosts(
    "hot",
    undefined,
    community.id,
  );
  const [reloadId, setReloadId] = useState(0);
  const theme = useTheme();
  const ctx = useContext(LotideContext).ctx;

  useEffect(() => {
    LotideService.getCommunity(ctx, community.id).then(setCommunity);
  }, [route.params.community.id, reloadId]);

  const renderItem = ({ item }: { item: Post }) => (
    <Item post={item} navigation={navigation} />
  );

  const isFollowing = community.your_follow?.accepted || false;

  function follow() {
    LotideService.followCommunity(ctx, community.id).then(data => {
      if (data.accepted === false) {
        Alert.alert(
          "Follow request rejected.",
          "This could be an issue with the node you are connected to.",
        );
      }
      setReloadId(x => x + 1);
    });
  }

  function unfollow() {
    LotideService.unfollowCommunity(ctx, community.id).then(() => {
      setReloadId(x => x + 1);
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.secondaryBackground },
        ]}
      >
        <View>
          <Text style={[styles.title]}>{community.name}</Text>
          <Text
            style={{
              color: community.local ? theme.blue : theme.green,
              fontWeight: "500",
            }}
          >
            {community.host}
          </Text>
          {community.description !== "" && (
            <Text>
              {"\n"}
              {community.description}
            </Text>
          )}
        </View>
        {isFollowing ? (
          <Button
            onPress={unfollow}
            title="Unfollow"
            color={theme.tint}
            accessibilityLabel="Stop seeing posts from this community"
          />
        ) : (
          <Button
            onPress={follow}
            title="Follow"
            color={theme.tint}
            accessibilityLabel="See posts from this community in your feed"
          />
        )}
      </View>
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
  root: {
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
  },
  item: {
    marginVertical: 0,
    marginHorizontal: 0,
    borderBottomWidth: 8,
  },
});

const Item = ({ post, navigation }: { post: Post; navigation: any }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => navigation.navigate("Post", { post })}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }}
    >
      <View
        style={[styles.item, { borderBottomColor: theme.secondaryBackground }]}
      >
        <PostDisplay post={post} navigation={navigation} />
      </View>
    </Pressable>
  );
};
