import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Pressable, ScrollView, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { View, Text, TextInput } from "../components/Themed";
import { getUserData } from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import { RootTabScreenProps } from "../types";
import SuggestLogin from "../components/SuggestLogin";
import * as LotideService from "../services/LotideService";
import * as StorageService from "../services/StorageService";
import useTheme from "../hooks/useTheme";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"ProfileScreen">) {
  const [profile, setProfile] = useState<Profile>();
  const [profileList, setProfileList] = useState<string[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const lotideContext = useContext(LotideContext);
  const ctx = lotideContext.ctx;

  useEffect(() => {
    // TODO: Use the pagination feature
    LotideService.getCommunities(ctx, true).then(communities =>
      setCommunities(communities.items),
    );
  }, [ctx.login?.user.id]);

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
        .then();
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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <View>
          <Pressable hitSlop={10} onPress={() => setIsEditing(x => !x)}>
            <Text style={styles.title}>
              {profile?.username}
              {"  "}
              <Icon
                name="pencil-outline"
                size={20}
                color={theme.secondaryText}
              />
            </Text>
          </Pressable>
          <Text style={{ color: theme.secondaryText }}>{profile?.host}</Text>
          {!!profile?.avatar && <Text>{profile?.avatar?.url}</Text>}
          {!!profile?.description && <Text>{profile?.description}</Text>}
        </View>
        <Button
          onPress={logout}
          title="Log Out"
          color={theme.secondaryTint}
          accessibilityLabel="Log out of the Hoot network"
        />
      </View>
      {isEditing && (
        <View style={styles.editView}>
          <TextInput style={styles.editViewText} placeholder="New email" />
          <TextInput
            style={styles.editViewText}
            placeholder="User bio"
            multiline={true}
          />
          <TextInput style={styles.editViewText} placeholder="New password" />
          <TextInput
            style={styles.editViewText}
            placeholder="Confirm new password"
          />
          <View style={styles.editViewActionButtons}>
            <Button
              onPress={() => setIsEditing(false)}
              title="Cancel"
              color={theme.secondaryTint}
              accessibilityLabel="Add profile"
            />
            <Button
              onPress={() => Alert.alert("unimplemented")}
              title="Submit"
              color={theme.tint}
              accessibilityLabel="Add profile"
            />
          </View>
        </View>
      )}
      <Button
        onPress={newLogin}
        title="Add Profile"
        color={theme.tint}
        accessibilityLabel="Add profile"
      />
      {profileList
        .map(p => [p, ...p.split("@")] as string[])
        .map(p => (
          <Pressable
            key={p[0]}
            style={[
              styles.altProfileButton,
              { borderColor: theme.secondaryBackground },
            ]}
            onPress={() => {
              StorageService.lotideContextKV.query(p[0]).then(ctx => {
                if (ctx !== undefined) {
                  lotideContext.setContext(ctx);
                  setIsEditing(false);
                }
              });
            }}
          >
            <Text style={{ fontWeight: "500" }}>
              {p[1]}
              <Text style={{ fontWeight: "300", color: theme.secondaryText }}>
                @{p[2]}
              </Text>
            </Text>
          </Pressable>
        ))}
      <Text style={styles.followingTitle}>Communities You Follow:</Text>
      {communities.map(community => (
        <View
          key={community.id}
          style={[
            styles.altProfileButton,
            { borderColor: theme.secondaryBackground },
          ]}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: community.local ? theme.blue : theme.green,
            }}
          >
            {community.name}
            <Text style={{ fontWeight: "300", color: theme.secondaryText }}>
              {" "}
              @{community.host}
            </Text>
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  followingTitle: {
    fontSize: 18,
    fontWeight: "500",
    padding: 20,
  },
  editView: {
    margin: 20,
  },
  editViewText: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  editViewActionButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
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
  altProfileButton: {
    marginHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
});
