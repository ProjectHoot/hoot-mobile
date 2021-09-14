import React, { useContext } from "react";
import { Alert, Button, StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import { View, Text } from "./Themed";

export default function SuggestLogin() {
  const theme = useTheme();
  const lotideContext = useContext(LotideContext);

  function login() {
    Alert.prompt(
      "Login",
      "Login to Hoot",
      (value: any) =>
        LotideService.login(
          { apiUrl: "https://hoot.goldandblack.xyz/api/unstable" },
          value.login,
          value.password,
        )
          .then(data => {
            console.log("index.tsx", JSON.stringify(data, null, 2));
            lotideContext.setContext({
              ...lotideContext.ctx,
              login: data,
            });
          })
          .catch(console.error),
      "login-password",
    );
  }

  return (
    <View style={styles.container}>
      <Text>You are not logged in</Text>
      <Button
        onPress={login}
        title="Login"
        color={theme.tint}
        accessibilityLabel="Login to the Hoot network"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
