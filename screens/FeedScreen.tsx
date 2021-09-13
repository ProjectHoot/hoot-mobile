import * as React from "react";
import { StyleSheet, FlatList, StatusBar, Pressable } from "react-native";

import PostDisplay from "../components/PostDisplay";
import { View } from "../components/Themed";
import * as Haptics from "expo-haptics";
import { useFeedPosts } from "../hooks/lotide";
import { RootTabScreenProps } from "../types";
import useTheme from "../hooks/useTheme";

export default function FeedScreen({
  navigation,
}: RootTabScreenProps<"FeedScreen">) {
  const [posts, isLoadingPosts, refreshPosts] = useFeedPosts();
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
      />
    </View>
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
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => navigation.navigate("Post", { post })}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        console.log(JSON.stringify(post, null, 2));
      }}
    >
      <View
        style={[styles.item, { borderBottomColor: theme.secondaryBackground }]}
      >
        <PostDisplay post={post} />
      </View>
    </Pressable>
  );
};
