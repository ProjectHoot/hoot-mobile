import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Pressable, StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";
import { getUserData } from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import { RootTabScreenProps } from "../types";
import SuggestLogin from "../components/SuggestLogin";
import * as LotideService from "../services/LotideService";
import * as StorageService from "../services/StorageService";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"ProfileScreen">) {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [profileList, setProfileList] = useState<string[]>([]);
  const lotideContext = useContext(LotideContext);
  const ctx = lotideContext.ctx;

  useEffect(() => {
    if (ctx.login !== undefined && ctx.login.user !== undefined) {
      getUserData(ctx, ctx.login?.user.id || 0).then(setProfile);
    }
  }, [ctx.login?.user?.id]);

  useEffect(() => {
    StorageService.lotideContextKV
      .listKeys()
      .then(keys => setProfileList(keys));
  }, [ctx]);

  if (ctx.login === undefined) {
    return <SuggestLogin navigation={navigation} />;
  }

  function logout() {
    LotideService.logout(ctx).finally(() => {
      lotideContext.setContext({ apiUrl: ctx.apiUrl });
      StorageService.lotideContextKV
        .remove(`${ctx.login?.user.username}@${ctx.apiUrl}`)
        .then(data => console.log("removed login", data));
    });
  }

  function newLogin() {
    Alert.prompt(
      "Login",
      "Login to Hoot",
      (value: any) =>
        LotideService.login(
          "https://hoot.goldandblack.xyz/api/unstable",
          value.login,
          value.password,
        )
          .then(data => {
            console.log("ProfileScreen.tsx", JSON.stringify(data, null, 2));
            const newCtx = {
              ...lotideContext.ctx,
              login: data,
            };
            lotideContext.setContext(newCtx);
            setProfileList(l => [
              `${newCtx.login.user.username}@${newCtx.apiUrl}`,
              ...l,
            ]);
          })
          .catch(console.error),
      "login-password",
    );
  }

  return (
    <View style={styles.container}>
      <Text>{profile?.username}</Text>
      <Text>{profile?.host}</Text>
      <Text>{profile?.avatar?.url}</Text>
      <Text>{profile?.description}</Text>
      <Button
        onPress={logout}
        title="Log Out"
        color="#841584"
        accessibilityLabel="Log out of the Hoot network"
      />
      {profileList.map(p => (
        <Pressable
          key={p}
          onPress={() => {
            StorageService.lotideContextKV.query(p).then(ctx => {
              if (ctx !== undefined) {
                lotideContext.setContext(ctx);
              }
            });
          }}
        >
          <Text style={styles.altProfileButton}>{p}</Text>
        </Pressable>
      ))}
      <Button
        onPress={newLogin}
        title="Add Profile"
        color="#841584"
        accessibilityLabel="Add profile"
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
  altProfileButton: {
    padding: 10,
  },
});
