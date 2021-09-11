import { FontAwesome } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import * as React from "react";
import {
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
  TouchableHighlight,
  Pressable,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { WebView } from "react-native-webview";

import EditScreenInfo from "../components/EditScreenInfo";
import ElapsedTime from "../components/ElapsedTime";
import PostDisplay from "../components/PostDisplay";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { usePosts, Post } from "../hooks/lotide";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [refreshCount, setRefreshCount] = React.useState(1);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const posts = usePosts(refreshCount);
  const renderItem = ({ item }: { item: Post }) => (
    <Item post={item} navigation={navigation} />
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(post, index) => `${post.id}-${index}`}
        refreshing={posts.length === 0 || isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          setTimeout(() => {
            setRefreshCount((c) => c + 1);
            setIsRefreshing(false);
          }, 1000);
        }}
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
    borderBottomColor: "#5555",
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

const Item = ({ post, navigation }: { post: Post; navigation: any }) => {
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
    <Pressable
      onPress={() => navigation.navigate("Post", { post })}
      onLongPress={() => console.log("long press")}
    >
      <View style={styles.item}>
        <PostDisplay post={post} />
      </View>
    </Pressable>
  );
};

function isImageUrl(url: string): boolean {
  return [".jpg", ".jpeg", ".png", ".bmp", ".gif"].some((ext) =>
    url.endsWith(ext)
  );
}
