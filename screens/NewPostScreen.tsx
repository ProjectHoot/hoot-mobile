import React, { useContext, useEffect, useState } from "react";
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
import { View, Text } from "../components/Themed";
import LotideContext from "../store/LotideContext";
import { RootTabScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import useTheme from "../hooks/useTheme";
import SuggestLogin from "../components/SuggestLogin";
import CommunityFinder from "../components/CommunityFinder";
import ActorDisplay from "../components/ActorDisplay";

export default function NewPostScreen({
  navigation,
}: RootTabScreenProps<"NewPostScreen">) {
  const [community, setCommunity] = useState<Community | null>();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const theme = useTheme();
  const lotideContext = useContext(LotideContext);
  const ctx = lotideContext.ctx;

  useEffect(() => {
    return navigation.addListener("focus", () => {
      console.log(community);
      if (community === null) {
        setCommunity(undefined);
      }
    });
  }, [community, community?.id]);

  if (ctx.login === undefined) {
    return <SuggestLogin />;
  }

  if (community === null)
    return <CommunityFinder onSelect={setCommunity} onlyWhenTyping />;

  function submit() {
    if (!community) return;
    LotideService.submitPost(ctx, {
      community: community.id,
      title,
      href: link || undefined,
      content_markdown: content || undefined,
    })
      .then(data => {
        LotideService.getPost(ctx, data.id).then(post => {
          reset();
          navigation.navigate("Post", { post });
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
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Add post content"
                placeholderTextColor={theme.placeholderText}
                value={content}
                onChangeText={setContent}
              />
            </>
          ) : (
            <Text style={{ color: theme.secondaryText }}>
              {title.length > 0 && 4 - title.length}
            </Text>
          )}
          {!!community && (!!link || content.length > 10) && (
            <Button
              onPress={submit}
              title="Submit"
              color={theme.tint}
              accessibilityLabel="Submit new post"
            />
          )}
          {content.length < 11 && content.length > 0 && (
            <Text style={{ color: theme.secondaryText }}>
              {11 - content.length}
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
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
