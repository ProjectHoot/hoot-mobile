import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import useTheme from "../hooks/useTheme";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import { View, Text, TextInput } from "./Themed";

export default function SuggestLogin() {
  const [isSplitUsername, setIsSplitUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [host, setHost] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();
  const lotideContext = useContext(LotideContext);

  function login() {
    const [fUsername, fHost] = isSplitUsername
      ? [username, host]
      : username.split("@");
    LotideService.login(
      { apiUrl: fHost || "https://hoot.goldandblack.xyz/api/unstable" },
      fUsername,
      password,
    )
      .then(data => {
        console.log("index.tsx", JSON.stringify(data, null, 2));
        lotideContext.setContext({
          ...lotideContext.ctx,
          login: data,
        });
      })
      .catch(console.error);
  }

  function toggleSplitView() {
    if (isSplitUsername) {
      setUsername(`${username}@${host}`);
      setHost("");
    } else {
      const [newUsername, newHost] = username.split("@");
      setUsername(newUsername || "");
      setHost(newHost || "");
    }
    setIsSplitUsername(x => !x);
  }

  return (
    <View style={styles.root}>
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <Text style={{ fontWeight: "300", fontSize: 18, marginBottom: 25 }}>
          You are not logged in
        </Text>
        <KeyboardAvoidingView style={{ width: "100%" }} behavior="height">
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <TextInput
              style={[
                styles.input,
                { marginBottom: 0, width: "auto", flex: 1 },
              ]}
              placeholder={
                isSplitUsername ? "Host URL" : "username@http://host.url"
              }
              value={isSplitUsername ? host : username}
              onChangeText={isSplitUsername ? setHost : setUsername}
              textContentType="URL"
            />
            {isSplitUsername && (
              <Pressable onPress={() => Alert.alert("unimplemented")}>
                <Icon
                  name="search-outline"
                  size={25}
                  color={theme.secondaryText}
                  style={{ marginLeft: 15 }}
                />
              </Pressable>
            )}
            <Pressable onPress={toggleSplitView}>
              <Icon
                name={isSplitUsername ? "chevron-down" : "chevron-forward"}
                size={25}
                color={theme.secondaryText}
                style={{ marginLeft: 15 }}
              />
            </Pressable>
          </View>
          {isSplitUsername && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              textContentType="username"
              value={username}
              onChangeText={setUsername}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            textContentType="password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.actionButtons}>
            <Button
              onPress={login}
              title="Register"
              color={theme.secondaryTint}
              accessibilityLabel="Login to the Hoot network"
            />
            <Button
              onPress={login}
              title="Login"
              color={theme.tint}
              accessibilityLabel="Login to the Hoot network"
            />
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  actionButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
