import Icon from "@expo/vector-icons/Ionicons";
import { openURL } from "expo-linking";
import React, { useMemo, useState } from "react";
import { StyleSheet, Image, TouchableHighlight } from "react-native";
import HTMLView from "react-native-htmlview";
import ElapsedTime from "./ElapsedTime";
import VoteCounter from "./VoteCounter";
import { Text, View } from "../components/Themed";
import useTheme from "../hooks/useTheme";

export interface PostDisplayProps {
  post: Post;
  showHtmlContent?: boolean;
  showCommunityHost?: boolean;
}

export default function PostDisplay(props: PostDisplayProps) {
  const [imgAspect, setImgAspect] = useState(1);
  const isImage = useMemo(() => isImageUrl(props.post.href), [props.post.href]);
  const theme = useTheme();
  return (
    <View>
      <Text style={styles.title}>{props.post.title}</Text>
      {isImage ? (
        <Image
          style={{ ...styles.image, aspectRatio: imgAspect }}
          source={{
            uri: props.post.href,
          }}
          onLoad={event =>
            setImgAspect(
              Math.max(
                event.nativeEvent.source.width /
                  event.nativeEvent.source.height,
                0.25,
              ),
            )
          }
        />
      ) : (
        <TouchableHighlight
          style={styles.link}
          onPress={() => openURL(props.post.href)}
        >
          <Text>{props.post.href}</Text>
        </TouchableHighlight>
      )}
      {props.showHtmlContent && (
        <View>
          <HTMLView
            value={props.post.content_html
              .replaceAll("<hr>", "")
              .replaceAll("\n", "")}
            renderNode={renderNode}
            stylesheet={{
              p: { color: theme.text },
            }}
          />
        </View>
      )}
      <View style={styles.foot}>
        <View>
          <Text>{props.post.community.name}</Text>
          <Text style={styles.by}>by {props.post.author.username}</Text>
          {props.showCommunityHost && (
            <Text style={styles.by}>on {props.post.community.host}</Text>
          )}
        </View>
        <View>
          <ElapsedTime time={props.post.created} />
        </View>
        <View>
          <Text style={styles.footText}>
            <Icon name="chatbubble-outline" size={12} />{" "}
            {props.post.replies_count_total}
          </Text>
        </View>
        <View>
          <VoteCounter
            post={props.post}
            isUpvoted={false}
            onVote={voteState => console.log(voteState)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#000000",
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
  footText: {},
  by: {
    fontSize: 11,
  },
  score: {
    fontSize: 18,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
});

function isImageUrl(url: string): boolean {
  return [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp"].some(ext =>
    url.endsWith(ext),
  );
}

function renderNode(
  node: any,
  index: any,
  siblings: any,
  parent: any,
  defaultRenderer: any,
) {
  if (
    node.name == "iframe" ||
    node.name == "img" ||
    node.name == "hr" ||
    node.name == "script"
  ) {
    return null;
  }
}
