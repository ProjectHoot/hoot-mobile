import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import { useLotideCtx } from "../hooks/useLotideCtx";

export default function NewCommunityScreen({
  navigation,
}: RootStackScreenProps<"NewCommunity">) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const theme = useTheme();
  const ctx = useLotideCtx();

  if (!ctx) return null;

  function submit() {
    if (!ctx?.login) return;
    LotideService.newCommunity(ctx, name)
      .then(async data => {
        const id = data.community.id;
        if (description) {
          await LotideService.editCommunity(ctx, id, description);
        }
        await LotideService.followCommunity(ctx, id);
        const community = await LotideService.getCommunity(ctx, id);
        navigation.replace("Community", { community });
      })
      .catch(e => Alert.alert("Failed to create community", e));
  }

  return (
    <View style={styles.root}>
      <TextInput
        style={[styles.input, { fontSize: 20, color: theme.text }]}
        placeholder="Community Name"
        placeholderTextColor={theme.placeholderText}
        value={name}
        onChangeText={setName}
      />
      {name.length >= 4 ? (
        <>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Description (Optional)"
            placeholderTextColor={theme.placeholderText}
            value={description}
            onChangeText={setDescription}
          />
          <Button
            title="Submit"
            color={theme.tint}
            onPress={submit}
            accessibilityLabel="Create new community"
          />
        </>
      ) : (
        <Text>{name.length > 0 && 4 - name.length}</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
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
