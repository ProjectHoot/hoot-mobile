import React, { useContext, useRef, useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { Text, TextInput } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import ContentDisplay from "../components/ContentDisplay";
import { ScrollView } from "react-native-gesture-handler";

export default function ReplyScreen({
  navigation,
  route,
}: RootStackScreenProps<"Reply">) {
  const [text, setText] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const theme = useTheme();
  const ctx = useContext(LotideContext).ctx;
  const id = route.params.id;
  const title = route.params.title;
  const html = route.params.html;
  const type = route.params.type;

  function submit() {
    if (type === "post") {
      LotideService.replyToPost(ctx, id, text).then(() => navigation.pop());
    } else {
      LotideService.replyToReply(ctx, id, text).then(() => navigation.pop());
    }
  }

  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView ref={scrollRef}>
        <Pressable
          style={styles.root}
          onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
        >
          <Text>Reply to {type}</Text>
          {!!title && <Text style={styles.title}>{title}</Text>}
          {html && <ContentDisplay contentHtml={html} />}
          <TextInput
            style={styles.input}
            multiline
            placeholder="Type your reply"
            value={text}
            onChangeText={setText}
            onFocus={scrollToBottom}
          />
          <Button title="Submit" color={theme.tint} onPress={submit} />
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 20, paddingBottom: 100 },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    marginVertical: 20,
    minHeight: 100,
  },
});
