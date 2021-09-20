import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { View } from "../components/Themed";
import LotideContext from "../store/LotideContext";
import { RootTabScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import useTheme from "../hooks/useTheme";
import SuggestLogin from "../components/SuggestLogin";

export default function NewPostScreen({
  navigation,
}: RootTabScreenProps<"NewPostScreen">) {
  const [communityId, setCommunityId] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const theme = useTheme();
  const lotideContext = useContext(LotideContext);
  const ctx = lotideContext.ctx;

  if (ctx.login === undefined) {
    return <SuggestLogin />;
  }

  function submit() {
    LotideService.submitPost(ctx, {
      community: parseInt(communityId),
      title,
      href: link || undefined,
      content_markdown: content || undefined,
    })
      .then(() => {
        Alert.alert("Success");
      })
      .catch(e => Alert.alert("Could not submit post", e));
  }

  return (
    <KeyboardAvoidingView style={{ width: "100%", height: "100%" }}>
      <TouchableWithoutFeedback
        onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
      >
        <View style={styles.container}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Community ID"
            placeholderTextColor={theme.placeholderText}
            value={communityId}
            onChangeText={setCommunityId}
          />
          <TextInput
            style={[styles.input, styles.title, { color: theme.text }]}
            placeholder="Add a Title"
            placeholderTextColor={theme.placeholderText}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Link"
            placeholderTextColor={theme.placeholderText}
            value={link}
            onChangeText={setLink}
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Add post content"
            placeholderTextColor={theme.placeholderText}
            value={content}
            onChangeText={setContent}
          />
          <Button
            onPress={submit}
            title="Submit"
            color="#841584"
            accessibilityLabel="Login to the Hoot network"
          />
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
