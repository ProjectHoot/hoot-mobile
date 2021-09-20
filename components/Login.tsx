import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { Text, TextInput, View } from "./Themed";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import useTheme from "../hooks/useTheme";

export interface LoginProps {
  hostName?: string;
  domain: string;
  onGoBack: () => void;
}

export default function Login(props: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();
  const lotideContext = useContext(LotideContext);

  function register() {
    LotideService.register(
      `https://${props.domain}/api/unstable`,
      username,
      password,
    )
      .then(data => {
        lotideContext.setContext({
          apiUrl: `https://${props.domain}/api/unstable`,
          login: data,
        });
      })
      .catch(e => {
        Alert.alert("Failed to register", e);
        console.error(e);
      });
  }

  function login() {
    LotideService.login(
      `https://${props.domain}/api/unstable`,
      username,
      password,
    )
      .then(data => {
        lotideContext.setContext({
          apiUrl: `https://${props.domain}/api/unstable`,
          login: data,
        });
      })
      .catch(e => {
        Alert.alert("Failed to login", e);
        console.error(e);
      });
  }

  function submit() {
    if (isRegistering) {
      register();
    } else {
      login();
    }
  }

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
    >
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        {props.hostName ? (
          <Pressable style={{ alignItems: "center" }}>
            <Text style={styles.name}>{props.hostName}</Text>
            <Text style={[styles.domain, { color: theme.secondaryText }]}>
              {props.domain}
            </Text>
          </Pressable>
        ) : (
          <Pressable>
            <Text style={{ fontSize: 24 }}>{props.domain}</Text>
          </Pressable>
        )}
        <Pressable hitSlop={5} onPress={() => setIsRegistering(x => !x)}>
          <Text style={[styles.loginRegister, { color: theme.secondaryText }]}>
            <Text
              style={{
                color: isRegistering
                  ? theme.secondaryText
                  : theme.secondaryTint,
              }}
            >
              Login
            </Text>
            {" | "}
            <Text
              style={{
                color: isRegistering
                  ? theme.secondaryTint
                  : theme.secondaryText,
              }}
            >
              Register
            </Text>
          </Text>
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View style={styles.actionButtons}>
          <Button
            title="Change Host"
            onPress={props.onGoBack}
            color={theme.secondaryTint}
          />
          <Button
            title={isRegistering ? "Register" : "Login"}
            onPress={submit}
            color={theme.tint}
          />
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
  },
  name: {
    fontSize: 50,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  domain: {
    fontWeight: "300",
  },
  loginRegister: {
    padding: 15,
  },
  input: {
    width: "100%",
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  actionButtons: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
