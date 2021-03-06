import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { View, Text, TextInput as TextInputThemed } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import useTheme from "../hooks/useTheme";
import SuggestLogin from "../components/SuggestLogin";
import CommunityFinder from "../components/CommunityFinder";
import ActorDisplay from "../components/ActorDisplay";
import { useLotideCtx } from "../hooks/useLotideCtx";
import { useDispatch } from "react-redux";
import { setPost } from "../slices/postSlice";

export default function NewPostScreen({
  navigation,
  route,
}: RootTabScreenProps<"NewPostScreen">) {
  const dispatch = useDispatch();
  const [community, setCommunity] = useState<Community | null | undefined>(
    route.params.community,
  );
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const theme = useTheme();
  const ctx = useLotideCtx();

  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (route.params.community) {
        return setCommunity(route.params.community);
      }
      if (community === null) {
        return setCommunity(undefined);
      }
    });
  }, [community, community?.id, route.params.community?.id]);

  if (!ctx?.login) {
    return <SuggestLogin />;
  }

  if (community === null)
    return <CommunityFinder onSelect={setCommunity} onlyWhenTyping />;

  function submit() {
    if (!ctx || !community) return;
    LotideService.submitPost(ctx, {
      community: community.id,
      title: title,
      href: link || undefined,
      content_markdown: content || " ",
    })
      .then(data => {
        LotideService.getPost(ctx, data.id).then(post => {
          reset();
          dispatch(setPost({ post }));
          navigation.navigate("Post", { postId: post.id });
        });
      })
      .catch(e => Alert.alert("Could not submit post", e));
  }

  function reset() {
    setCommunity(undefined);
    setTitle("");
    setLink("");
    setContent("");
  }

  return (
    <KeyboardAvoidingView style={{ width: "100%", height: "100%" }}>
      <TouchableWithoutFeedback
        onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
      >
        <View style={styles.container}>
          <Pressable onPress={() => setCommunity(null)}>
            {community ? (
              <ActorDisplay
                name={community.name}
                host={community.host}
                local={community.local}
                colorize={"always"}
                showHost={"always"}
                newLine
                style={styles.input}
              />
            ) : (
              <Text style={[styles.input, { color: theme.secondaryText }]}>
                Select a Community
              </Text>
            )}
          </Pressable>
          <TextInput
            style={[styles.input, styles.title, { color: theme.text }]}
            placeholder="Add a Title"
            placeholderTextColor={theme.placeholderText}
            value={title}
            onChangeText={setTitle}
          />
          {title.length >= 4 ? (
            <>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Link"
                placeholderTextColor={theme.placeholderText}
                value={link}
                onChangeText={setLink}
                keyboardType="url"
                textContentType="URL"
              />
              <TextInputThemed
                style={{ marginVertical: 20, minHeight: 100 }}
                multiline
                placeholder="Add post content"
                value={content}
                onChangeText={setContent}
              />
            </>
          ) : (
            <Text style={{ color: theme.secondaryText }}>
              {title.length > 0 && 4 - title.length}
            </Text>
          )}
          {!!community && title.length >= 4 && (
            <Button
              onPress={submit}
              title="Submit"
              color={theme.tint}
              accessibilityLabel="Submit new post"
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    padding: 15,
    height: "100%",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  inputContainer: {
    width: "100%",
    padding: 20,
  },
  input: {
    paddingVertical: 10,
    width: "100%",
    borderRadius: 8,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 1,
  },
});
