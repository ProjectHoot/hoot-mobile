import React, { useContext, useState } from "react";
import { ColorValue, Pressable, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { View, Text } from "./Themed";
import useTheme from "../hooks/useTheme";
import * as Haptics from "../services/HapticService";
import ElapsedTime from "./ElapsedTime";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import ContentDisplay from "./ContentDisplay";
import { SelectedReplyContext } from "../store/SelectedReplyContext";
import VoteCounter from "./VoteCounter";
import ActorDisplay from "./ActorDisplay";

export interface RepliesDisplayProps {
  replies: Paged<Reply>;
  navigation: any;
  layer?: number;
  postId?: PostId;
  replyId?: ReplyId;
  highlightedReplies?: ReplyId[];
}

export default function RepliesDisplay({
  replies,
  navigation,
  layer = 0,
  postId,
  replyId,
  highlightedReplies = [],
}: RepliesDisplayProps) {
  const [nextPageData, setNextPageData] = useState<Paged<Reply>>();
  const theme = useTheme();
  const ctx = useContext(LotideContext).ctx;
  const layerColors = [
    theme.text,
    theme.red,
    theme.orange,
    theme.yellow,
    theme.green,
    theme.teal,
    theme.blue,
    theme.indigo,
    theme.purple,
  ];

  return (
    <View>
      {replies.items.map(reply => (
        <ReplyDisplay
          reply={reply}
          layer={layer}
          key={reply.id}
          navigation={navigation}
          layerColors={layerColors}
          postId={postId}
          highlightedReplies={highlightedReplies}
        />
      ))}
      {replies.next_page !== null &&
        nextPageData === undefined &&
        (postId || replyId) && (
          <Pressable
            hitSlop={5}
            onPress={() => {
              if (replyId) {
                LotideService.getReplyReplies(
                  ctx,
                  replyId,
                  replies.next_page || undefined,
                ).then(setNextPageData);
              } else if (postId) {
                LotideService.getPostReplies(
                  ctx,
                  postId,
                  replies.next_page || undefined,
                ).then(setNextPageData);
              }
            }}
          >
            <Text
              style={{ color: theme.tint, paddingTop: 5, paddingBottom: 10 }}
            >
              More replies <Icon name="chevron-down-outline" />
            </Text>
          </Pressable>
        )}
      {nextPageData !== undefined && (
        <RepliesDisplay
          replies={nextPageData}
          navigation={navigation}
          layer={layer}
          postId={postId}
          replyId={replyId}
          highlightedReplies={highlightedReplies}
        />
      )}
      {replies.next_page === null && layer === 0 && (
        <Text style={{ margin: 17, color: theme.secondaryText }}>
          {replies.items.length > 0 ? "No more replies" : "No replies yet"}
        </Text>
      )}
    </View>
  );
}

function ReplyDisplay({
  reply,
  layer = 0,
  navigation,
  layerColors,
  postId,
  highlightedReplies = [],
}: {
  reply: Reply;
  layer: number;
  navigation: any;
  layerColors: ColorValue[];
  postId?: PostId;
  highlightedReplies?: ReplyId[];
}) {
  const [nextPageData, setNextPageData] = useState<Paged<Reply>>();
  const [showChildren, setShowChildren] = React.useState(true);
  const theme = useTheme();
  const { ctx } = useContext(LotideContext);
  const [selectedReply, setSelectedReply] = useContext(SelectedReplyContext);

  return (
    <View style={{ paddingLeft: 0 }}>
      <View
        style={{
          paddingVertical: 8,
          borderTopWidth: 0.5,
          borderTopColor: theme.secondaryBackground,
        }}
      >
        <Pressable
          onPress={() =>
            setSelectedReply(selectedReply != reply.id ? reply.id : undefined)
          }
        >
          <View
            style={{
              borderLeftWidth: 2,
              borderColor: layerColors[layer % layerColors.length],
              paddingLeft: 15,
              paddingVertical: 3,
              backgroundColor: highlightedReplies.includes(reply.id)
                ? theme.secondaryBackground
                : theme.background,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: 5,
              }}
            >
              <ActorDisplay
                name={reply.author.username}
                host={reply.author.host}
                local={reply.author.local}
                showHost="only_foreign"
                colorize="only_foreign"
                style={{ fontSize: 16, fontWeight: "500" }}
              />
              <View
                style={{
                  marginRight: 15,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text>{!showChildren && "...    "}</Text>
                <Icon name="heart-outline" size={14} color={theme.text} light />
                <Text>{` ${reply.score}   `}</Text>
                <ElapsedTime time={reply.created} />
              </View>
            </View>
            {showChildren && !!reply.content_html && (
              <ContentDisplay
                contentHtml={reply.content_html}
                contentText={reply.content_text}
              />
            )}
          </View>
          {selectedReply == reply.id && (
            <View style={styles.buttons}>
              <VoteCounter
                type="reply"
                content={reply}
                hideCount
                style={styles.button}
              />
              {/* <Pressable style={styles.button}>
                <Icon color={theme.text} size={20} name="bookmark-outline" />
              </Pressable> */}
              <Pressable
                style={styles.button}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate("Reply", {
                    id: reply.id,
                    title: reply.author.username,
                    html: reply.content_html,
                    type: "reply",
                  });
                }}
              >
                <Icon color={theme.text} size={20} name="arrow-undo-outline" />
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => {
                  setShowChildren(s => !s);
                }}
              >
                <Icon
                  color={
                    (reply.replies?.items.length || 0) > 0
                      ? theme.text
                      : theme.secondaryText
                  }
                  size={20}
                  name={
                    showChildren ? "chevron-up-outline" : "chevron-down-outline"
                  }
                />
              </Pressable>
              {/* <Pressable style={styles.button}>
                <Icon
                  color={theme.text}
                  size={20}
                  name="ellipsis-vertical-outline"
                />
              </Pressable> */}
            </View>
          )}
        </Pressable>
      </View>
      {reply.replies !== null
        ? reply.replies.items.length > 0 &&
          (showChildren ? (
            <View style={{ paddingLeft: 15 }}>
              <RepliesDisplay
                replies={reply.replies}
                layer={layer + 1}
                navigation={navigation}
                postId={postId}
                replyId={reply.id}
                highlightedReplies={highlightedReplies}
              />
            </View>
          ) : (
            <Text>...</Text>
          ))
        : nextPageData === undefined && (
            <Pressable
              hitSlop={5}
              onPress={() => {
                LotideService.getReplyReplies(ctx, reply.id).then(
                  setNextPageData,
                );
              }}
            >
              <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                <Text style={{ color: theme.tint }}>
                  More replies <Icon name="chevron-forward-outline" />
                </Text>
              </View>
            </Pressable>
          )}
      {nextPageData !== undefined && (
        <View style={{ paddingLeft: 15 }}>
          <RepliesDisplay
            replies={nextPageData}
            navigation={navigation}
            layer={layer + 1}
            postId={postId}
            replyId={reply.id}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  button: {
    padding: 10,
    paddingHorizontal: 15,
  },
});
