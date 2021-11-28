import React from "react";
import { ColorValue, Pressable, StyleSheet, View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Text } from "./Themed";
import useTheme from "../hooks/useTheme";
import * as Haptics from "../services/HapticService";
import ElapsedTime from "./ElapsedTime";
import ContentDisplay from "./ContentDisplay";
import VoteCounter from "./VoteCounter";
import ActorDisplay from "./ActorDisplay";
import { useLotideCtx } from "../hooks/useLotideCtx";
import useComments from "../hooks/useComments";
import useComment from "../hooks/useComment";
import useSelectedComment from "../hooks/useSelectedComment";

export interface CommentsDisplayProps {
  parentType: ContentType;
  parentId: number;
  navigation: any;
  layer?: number;
  postId?: PostId;
  highlightedComments?: CommentId[];
}

export default function CommentsDisplay({
  parentType,
  parentId,
  navigation,
  layer = 0,
  postId,
  highlightedComments = [],
}: CommentsDisplayProps) {
  const { comments, loadNextPage } = useComments(parentType, parentId);
  const theme = useTheme();
  const ctx = useLotideCtx();
  if (!ctx) return null;
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

  if (!comments) return <Text>Can't find comments</Text>;

  return (
    <View>
      {comments.items.map(commentId => (
        <CommentDisplay
          commentId={commentId}
          layer={layer}
          key={commentId}
          navigation={navigation}
          layerColors={layerColors}
          postId={postId}
          highlightedComments={highlightedComments}
        />
      ))}
      {comments.next_page !== null && (
        <Pressable hitSlop={5} onPress={loadNextPage}>
          <Text style={{ color: theme.tint, paddingTop: 5, paddingBottom: 10 }}>
            More comments <Icon name="chevron-down-outline" />
          </Text>
        </Pressable>
      )}
      {comments.next_page === null && layer === 0 && (
        <Text style={{ margin: 17, color: theme.secondaryText }}>
          {comments.items.length > 0 ? "No more comments" : "No comments yet"}
        </Text>
      )}
    </View>
  );
}

function CommentDisplay({
  commentId,
  layer = 0,
  navigation,
  layerColors,
  postId,
  highlightedComments = [],
}: {
  commentId: CommentId;
  layer: number;
  navigation: any;
  layerColors: ColorValue[];
  postId?: PostId;
  highlightedComments?: CommentId[];
}) {
  const comment = useComment(commentId);
  const { comments, loadNextPage } = useComments("comment", commentId);
  const [showChildren, setShowChildren] = React.useState(true);
  const theme = useTheme();
  const ctx = useLotideCtx();
  const [selectedComment, setSelectedComment] = useSelectedComment();

  if (!ctx) return null;

  if (!comment) return <Text>Failed to load comment</Text>;

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
            setSelectedComment(
              selectedComment != comment.id ? comment.id : undefined,
            )
          }
        >
          <View
            style={{
              borderLeftWidth: 2,
              borderColor: layerColors[layer % layerColors.length],
              paddingLeft: 15,
              paddingVertical: 3,
              backgroundColor: highlightedComments.includes(comment.id)
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
                name={comment.author.username}
                host={comment.author.host}
                local={comment.author.local}
                showHost="only_foreign"
                colorize="only_foreign"
                style={{ fontSize: 16, fontWeight: "500" }}
                userId={comment.author.id}
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
                <Icon
                  name={comment.your_vote ? "heart" : "heart-outline"}
                  size={14}
                  color={theme.text}
                  light
                />
                <Text>{` ${comment.score}   `}</Text>
                <ElapsedTime time={comment.created} />
              </View>
            </View>
            {showChildren && !!comment.content_html && (
              <ContentDisplay
                contentHtml={comment.content_html}
                contentText={comment.content_text}
              />
            )}
          </View>
          {selectedComment == comment.id && (
            <View style={styles.buttons}>
              <VoteCounter
                type="comment"
                content={comment}
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
                  navigation.navigate("Comment", {
                    id: comment.id,
                    title: comment.author.username,
                    html: comment.content_html,
                    type: "comment",
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
                    (comment.replies?.items.length || 0) > 0
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
      {comments &&
        comments.items.length > 0 &&
        (showChildren ? (
          <View style={{ paddingLeft: 15 }}>
            <CommentsDisplay
              parentType="comment"
              parentId={commentId}
              layer={layer + 1}
              navigation={navigation}
              postId={postId}
              highlightedComments={highlightedComments}
            />
          </View>
        ) : (
          <Text>...</Text>
        ))}
      {comments == undefined && (
        <Pressable hitSlop={5} onPress={loadNextPage}>
          <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
            <Text style={{ color: theme.tint }}>
              More comments <Icon name="chevron-forward-outline" />
            </Text>
          </View>
        </Pressable>
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
