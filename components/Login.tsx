import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput as DefaultTextInput,
} from "react-native";
import { Text, TextInput, View } from "./Themed";
import * as LotideService from "../services/LotideService";
import useTheme from "../hooks/useTheme";
import { useNavigation } from "@react-navigation/core";
import { useDispatch } from "react-redux";
import { setCtx } from "../slices/lotideSlice";

export interface LoginProps {
  hostName?: string;
  domain: string;
  username?: string;
  onGoBack: () => void;
}

export default function Login(props: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(props.username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const usernameRef = useRef<DefaultTextInput>(null);
  const passwordRef = useRef<DefaultTextInput>(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  function fail(message: string) {
    Alert.alert("Failed to submit", message);
  }

  function register() {
    if (!username) return fail("Please enter a username");
    if (!password) return fail("Enter a password");
    if (!email) return fail("Please enter an email address");

    LotideService.register(
      `https://${props.domain}/api/unstable`,
      username,
      password,
      email,
    )
      .then(data => {
        dispatch(
          setCtx({
            apiUrl: `https://${props.domain}/api/unstable`,
            login: data,
          }),
        );
      })
      .catch(e => {
        Alert.alert("Failed to register", e);
        console.error(e);
      });
  }

  function login() {
    if (!username) return fail("Please enter a username");
    if (!password) return fail("Enter a password");

    LotideService.login(
      `https://${props.domain}/api/unstable`,
      username,
      password,
    )
      .then(data => {
        dispatch(
          setCtx({
            apiUrl: `https://${props.domain}/api/unstable`,
            login: data,
          }),
        );
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
        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCompleteType="email"
            returnKeyType="next"
            onSubmitEditing={() => usernameRef.current?.focus()}
          />
        )}
        <TextInput
          ref={usernameRef}
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          keyboardType="ascii-capable"
          textContentType="username"
          autoCompleteType="username"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          textContentType={isRegistering ? "newPassword" : "password"}
          autoCompleteType="password"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        {!isRegistering && (
          <Pressable
            style={{ padding: 15 }}
            onPress={() =>
              navigation.navigate("ForgotPassword", { node: props.domain })
            }
          >
            <Text secondary>Forgot Password</Text>
          </Pressable>
        )}
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
