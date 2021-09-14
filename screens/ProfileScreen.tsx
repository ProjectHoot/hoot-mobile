import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";
import { getUserData } from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import { RootTabScreenProps } from "../types";
import SuggestLogin from "../components/SuggestLogin";
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
    return <SuggestLogin />;
  }

  function logout() {
    LotideService.logout(ctx).then(() => {
      lotideContext.setContext({ apiUrl: ctx.apiUrl });
    });
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
