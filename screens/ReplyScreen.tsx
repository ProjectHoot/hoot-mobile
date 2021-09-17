import React, { useContext, useState } from "react";
import { Button, StyleSheet } from "react-native";
import { View, Text, TextInput } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";

export default function ReplyScreen({
  navigation,
  route,
}: RootStackScreenProps<"Reply">) {
  const [text, setText] = useState("");
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

  return (
    <View style={styles.root}>
      <Text>Reply to {type}</Text>
      {!!title && <Text style={styles.title}>{title}</Text>}
      <Text>{html}</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Type your reply"
        value={text}
        onChangeText={setText}
      />
      <Button title="Submit" color={theme.tint} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { padding: 20 },
  title: {
    fontSize: 24,
  },
  input: {
    marginBottom: 10,
  },
});
