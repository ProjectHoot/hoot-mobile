import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";
import { getUserData } from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import { RootTabScreenProps } from "../types";
import * as LotideService from "../services/LotideService";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"ProfileScreen">) {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const lotideContext = useContext(LotideContext);
  const ctx = lotideContext.ctx;

  useEffect(() => {
    if (ctx.login !== undefined) {
      getUserData(ctx, ctx.login?.user.id || 0).then(setProfile);
    }
  }, [ctx.login?.user?.id]);

  if (ctx.login === undefined) {
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
          color="#841584"
          accessibilityLabel="Login to the Hoot network"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{profile?.username}</Text>
      <Text>{profile?.host}</Text>
      <Text>{profile?.avatar?.url}</Text>
      <Text>{profile?.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    height: 40,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
