import Icon from "@expo/vector-icons/Ionicons";
import { openURL } from "expo-linking";
import React, { useMemo, useState } from "react";
import { StyleSheet, Image, Pressable } from "react-native";
import ElapsedTime from "./ElapsedTime";
import VoteCounter from "./VoteCounter";
import { Text, View } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import * as Haptics from "../services/HapticService";
import ContentDisplay from "./ContentDisplay";
import ActorDisplay from "./ActorDisplay";

export interface PostDisplayProps {
  post: Post;
  navigation: any;
  showHtmlContent?: boolean;
  showAuthor?: boolean;
}

export default function PostDisplay(props: PostDisplayProps) {
  const [imgAspect, setImgAspect] = useState(1);
  const isImage = useMemo(() => isImageUrl(props.post.href), [props.post.href]);
  const theme = useTheme();

  const post = props.post;

  return (
    <View>
      <Text style={styles.title}>
        {props.post.sticky && (
          <>
            <Icon name="pin" size={25} color={theme.secondaryTint} />{" "}
          </>
        )}
        {props.post.title}
      </Text>
      {props.post.href &&
        (isImage ? (
          <Image
            style={{
              ...styles.image,
              aspectRatio: imgAspect,
              backgroundColor: theme.secondaryBackground,
            }}
            source={{
              uri: props.post.href,
            }}
            onLoad={event =>
              setImgAspect(
                Math.max(
                  event.nativeEvent.source.width /
                    event.nativeEvent.source.height,
                  0.5,
                ),
              )
            }
          />
        ) : (
          <Pressable
            style={[
              styles.link,
              { backgroundColor: theme.secondaryBackground },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (props.post.href) {
                openURL(props.post.href);
              }
            }}
          >
            <Text>{props.post.href}</Text>
          </Pressable>
        ))}
      {props.showHtmlContent && !!props.post.content_html && (
        <View style={{ padding: 15 }}>
          <ContentDisplay
            contentHtml={props.post.content_html}
            contentText={props.post.content_text}
          />
        </View>
      )}
      {props.showAuthor && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingTop: 15,
          }}
        >
          <Text style={styles.by}>by{"   "}</Text>
          <ActorDisplay
            name={post.author.username}
            host={post.author.host}
            local={post.author.local}
            showHost={"only_foreign"}
            colorize={"always"}
            newLine={true}
          />
        </View>
      )}
      <View style={styles.foot}>
        <Pressable
          hitSlop={8}
          onPress={() =>
            props.navigation.navigate("Community", {
              community: props.post.community,
            })
          }
          style={[
            styles.footItem,
            {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          {props.showAuthor && <Text style={styles.by}>in{"   "}</Text>}
          <ActorDisplay
            name={post.community.name}
            host={post.community.host}
            local={post.community.local}
            showHost={"only_foreign"}
            colorize={props.showAuthor ? "always" : "never"}
            newLine={true}
          />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.footItem}>
          <ElapsedTime time={props.post.created} />
        </View>
        <View style={styles.footItem}>
          <Text style={styles.footText}>
            <Icon name="chatbubble-outline" size={12} />{" "}
            {props.post.replies_count_total}
          </Text>
        </View>
        <View style={styles.footItem}>
          <VoteCounter type="post" content={post} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
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
  },
  footText: {},
  footItem: {
    padding: 15,
  },
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

function isImageUrl(url?: string): boolean {
  if (!url) return false;
  return [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp"].some(ext =>
    url.endsWith(ext),
  );
}
