import React, { useState } from "react";
import { RootStackScreenProps } from "../types";
import { Text, TextInput, View } from "../components/Themed";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import useTheme from "../hooks/useTheme";
import * as LotideService from "../services/LotideService";

export default function ForgotPasswordScreen({
  navigation,
  route,
}: RootStackScreenProps<"ForgotPassword">) {
  const [isAwaitingKey, setIsAwaitingKey] = useState(false);
  const [email, setEmail] = useState("");
  const [validKey, setValidKey] = useState<string>();
  const [password, setPassword] = useState("");
  const theme = useTheme();

  function submitEmail() {
    if (!email)
      return Alert.alert(
        "Email address required",
        "An email with a password reset key will be emailed to you",
      );
    LotideService.forgotPasswordRequestKey(
      { apiUrl: `https://${route.params.node}/api/unstable` },
      email,
    )
      .then(() => {
        setIsAwaitingKey(true);
      })
      .catch(e => Alert.alert("Failed to send reset key", e));
  }

  function submitPassword() {
    if (!password) return Alert.alert("Password required");
    if (!validKey) return Alert.alert("No key", "Fail. This shouldn't happen");
    LotideService.forgotPasswordReset(
      { apiUrl: `https://${route.params.node}/api/unstable` },
      validKey,
      password,
    ).then(() => navigation.popToTop());
  }

  function keyChange(key: string) {
    if (key.length < 6) return;
    LotideService.forgotPasswordTestKey(
      { apiUrl: `https://${route.params.node}/api/unstable` },
      key,
    ).then(() => setValidKey(key));
  }

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
    >
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        <Pressable>
          <Text>{route.params.node}</Text>
        </Pressable>
        {!isAwaitingKey ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCompleteType="email"
              returnKeyType="go"
              autoCapitalize="none"
            />
            <Button title="Submit" onPress={submitEmail} color={theme.tint} />
          </>
        ) : (
          <>
            {validKey ? (
              <>
                <TextInput
                  placeholder="New Password"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  textContentType="password"
                  autoCompleteType="password"
                />
                <View style={styles.actionButtons}>
                  <Button
                    title="Go Back"
                    onPress={() => setIsAwaitingKey(false)}
                    color={theme.secondaryTint}
                  />
                  <Button
                    title="Submit"
                    onPress={submitPassword}
                    color={theme.tint}
                  />
                </View>
              </>
            ) : (
              <TextInput
                placeholder="Key"
                style={styles.input}
                onChangeText={keyChange}
                autoCapitalize="none"
              />
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  actionButtons: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
