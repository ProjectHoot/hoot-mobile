import React, { useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { TextInput } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import ActorDisplay from "../components/ActorDisplay";
import { useLotideCtx } from "../hooks/useLotideCtx";

export default function ReplyScreen({
  navigation,
  route,
}: RootStackScreenProps<"EditCommunity">) {
  const community = route.params.community;
  const [description, setDescription] = useState(community.description || "");
  const theme = useTheme();
  const ctx = useLotideCtx();

  function submit() {
    if (!ctx) return;
    LotideService.editCommunity(ctx, community.id, description)
      .then(() => LotideService.getCommunity(ctx, community.id))
      .then(data =>
        navigation.navigate("Community", {
          community: { ...data, description },
        }),
      )
      .catch(e => Alert.alert("Failed to edit community", e));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable
        style={styles.root}
        onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
      >
        <ActorDisplay
          name={community.name}
          host={community.host}
          local={community.local}
          showHost="always"
          newLine
          style={styles.title}
        />
        <TextInput
          style={styles.input}
          multiline
          placeholder="Add a description"
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Submit" color={theme.tint} onPress={submit} />
      </Pressable>
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
