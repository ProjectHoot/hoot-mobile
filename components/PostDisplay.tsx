import { FontAwesome } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { Post } from "../hooks/lotide";
import ElapsedTime from "./ElapsedTime";
import VoteCounter, { VoteState } from "./VoteCounter";

export interface PostDisplayProps {
  post: Post;
  showHtmlContent?: boolean;
  showCommunityHost?: boolean;
}

export default function PostDisplay(props: PostDisplayProps) {
  const [imgAspect, setImgAspect] = useState(1);
  const isImage = isImageUrl(props.post.href);
  return (
    <View>
      <Text style={styles.title}>{props.post.title}</Text>
      {isImage ? (
        <Image
          style={{ ...styles.image, aspectRatio: imgAspect }}
          source={{
            uri: props.post.href,
          }}
          onLoad={(event) =>
            setImgAspect(
              Math.max(
                event.nativeEvent.source.width /
                  event.nativeEvent.source.height,
                0.25
              )
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
              p: { color: "#ddd" },
            }}
          />
        </View>
      )}
      <View style={styles.foot}>
        <View>
          <Text style={{ color: "#fff" }}>{props.post.community.name}</Text>
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
            <FontAwesome name="comment" size={12} style={{ marginRight: 15 }} />{" "}
            {props.post.replies_count_total}
          </Text>
        </View>
        <View>
          <VoteCounter
            post={props.post}
            voteState={VoteState.NEUTRAL}
            onVote={(voteState) => console.log(voteState)}
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
    borderBottomColor: "#8884",
    borderBottomWidth: 2,
    color: "#fff",
  },
  footText: {
    color: "#ccc",
  },
  by: {
    fontSize: 11,
    color: "#fff",
  },
  score: {
    fontSize: 18,
    color: "#bbb",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    color: "#ccc",
    padding: 10,
  },
});

function isImageUrl(url: string): boolean {
  return [".jpg", ".jpeg", ".png", ".bmp", ".gif"].some((ext) =>
    url.endsWith(ext)
  );
}

function renderNode(
  node: any,
  index: any,
  siblings: any,
  parent: any,
  defaultRenderer: any
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
