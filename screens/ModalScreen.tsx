import { FontAwesome } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import * as React from "react";
import {
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  TouchableHighlight,
} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Post } from "../hooks/lotide";
import { RootStackParamList, RootStackScreenProps } from "../types";

export default function ModalScreen({ route }: RootStackScreenProps<"Modal">) {
  const post = (route.params as any | undefined)?.post as Post | undefined;
  if (!post) {
    return null;
  }
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
    <View style={styles.item}>
      <Text style={styles.title}>{post.title}</Text>
      {isImage ? (
        <Image
          style={{ ...styles.image, aspectRatio: imgAspect }}
          source={{
            uri: post.href,
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
          onPress={() => openURL(post.href)}
        >
          <Text>{post.href}</Text>
        </TouchableHighlight>
      )}
      {/* <View>
        <HTMLView
          value={"<p><a href=\"http://reddit.com/r/GoldandBlack/comments/pk3vtk/hemingway_on_inflation_and_war/\" rel=\"ugc noopener noreferrer\">link to original reddit post</a> by <a href=\"http://reddit.com/user/mechatomb\" rel=\"ugc noopener noreferrer\">/u/mechatomb</a></p><p>“The first panacea for a mismanaged nation is inflation of the currency; the second is war. Both bring a temporary prosperity; both bring a permanent ruin. But both are the refuge of political and economic opportunists.”<br>Ernest Hemingway, “Notes on the Next War: A Serious Topical Letter” , 1935</p>"}
          // value={post.content_html.replaceAll("<hr>", "").replaceAll("\n", "")}
          renderNode={renderNode}
          stylesheet={{p: {color: '#fff', borderColor: '#f00', borderWidth: 1}}}
        />
      </View> */}
      <View style={styles.foot}>
        <View>
          <Text>{post.community.name}</Text>
          <Text style={styles.by}>by {post.author.username}</Text>
        </View>
        <View>
          <Text style={styles.footText}>
            <FontAwesome name="history" size={12} style={{ marginRight: 15 }} />{" "}
            {displayTime}
          </Text>
        </View>
        <View>
          <Text style={styles.footText}>
            <FontAwesome name="comment" size={12} style={{ marginRight: 15 }} />{" "}
            {post.replies_count_total}
          </Text>
        </View>
        <View>
          <Text style={styles.footText}>
            <FontAwesome
              name="chevron-up"
              size={20}
              style={{ marginRight: 15 }}
            />
            {"   "}
            <Text style={styles.score}>{post.score}</Text>
            {"   "}
            <FontAwesome
              name="chevron-down"
              size={20}
              style={{ marginRight: 15 }}
            />
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#000000",
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

function isImageUrl(url: string): boolean {
  return [".jpg", ".jpeg", ".png", ".bmp", ".gif"].some((ext) =>
    url.endsWith(ext)
  );
}
