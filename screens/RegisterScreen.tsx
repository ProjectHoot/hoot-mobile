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
import { View, Text, TextInput } from "../components/Themed";
import { RootStackScreenProps } from "../types";

export default function RegisterScreen({
  navigation,
  route,
}: RootStackScreenProps<"Register">) {
  const [username, setUsername] = useState("");
  const [host, setHost] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const theme = useTheme();
  const lotideContext = useContext(LotideContext);

  function submit() {
    // if (password !== passwordConf) {
    //   Alert.alert("Passwords don't match", "Make sure your passwords match");
    //   return;
    // }
    const fHost = host || "https://hoot.goldandblack.xyz/api/unstable";
    LotideService.register(fHost, username, password)
      .then(data => {
        console.log("RegisterScreen.tsx", JSON.stringify(data, null, 2));
        lotideContext.setContext({ apiUrl: fHost, login: data });
        navigation.pop();
      })
      .catch(console.error);
  }

  return (
    <View style={styles.root}>
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <Text style={{ fontWeight: "300", fontSize: 18, marginBottom: 25 }}>
          Register a new account
        </Text>
        <KeyboardAvoidingView style={{ width: "100%" }} behavior="position">
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
              placeholder="Host URL"
              value={host}
              onChangeText={setHost}
              textContentType="URL"
            />
            <Pressable onPress={() => Alert.alert("unimplemented")}>
              <Icon
                name="search-outline"
                size={25}
                color={theme.secondaryText}
                style={{ marginLeft: 15 }}
              />
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            textContentType="username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            textContentType="password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            textContentType="password"
            secureTextEntry={true}
            value={passwordConf}
            onChangeText={setPasswordConf}
          />
          <View style={styles.actionButtons}>
            <Button
              onPress={submit}
              title="Register"
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
