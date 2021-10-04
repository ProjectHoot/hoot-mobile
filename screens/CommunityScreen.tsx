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
import { ActorDisplay } from "../components/ActorDisplay";
import { useNavigation } from "@react-navigation/native";

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
  }, [route.params.community.id, route.params.community.description, reloadId]);

  const renderItem = ({ item }: { item: Post }) => (
    <Item post={item} navigation={navigation} />
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        ListHeaderComponent={
          <ListHeader community={community} setReloadId={setReloadId} />
        }
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
    padding: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
  },
  title: {
    fontSize: 20,
  },
  description: {
    marginTop: 10,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
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

type ListHeaderProps = {
  community: Community;
  setReloadId: (a: (x: number) => number) => void;
};

const ListHeader = React.memo((props: ListHeaderProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const community = props.community;
  const setReloadId = props.setReloadId;
  const { ctx } = useContext(LotideContext);

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
    <View
      style={[
        styles.header,
        {
          borderBottomColor: theme.tertiaryBackground,
        },
      ]}
    >
      <View>
        <ActorDisplay
          name={community.name}
          host={community.host}
          local={community.local}
          newLine={true}
          colorize="always"
          showHost="always"
          styleName={[styles.title]}
        />
        {community.description !== "" && (
          <Text style={styles.description}>{community.description}</Text>
        )}
      </View>
      <View style={[styles.buttons]}>
        <Button
          onPress={() => navigation.navigate("NewPostScreen", { community })}
          title="Post"
          color={theme.tint}
          accessibilityLabel="Post to this community"
        />
        {community.you_are_moderator && (
          <Button
            onPress={() => navigation.navigate("EditCommunity", { community })}
            title="Edit"
            color={theme.tint}
            accessibilityLabel="Edit your community community"
          />
        )}
        {isFollowing ? (
          <Button
            onPress={unfollow}
            title="Unfollow"
            color={theme.secondaryTint}
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
    </View>
  );
});
