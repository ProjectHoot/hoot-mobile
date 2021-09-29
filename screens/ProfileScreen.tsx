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
import ActorDisplay from "../components/ActorDisplay";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"ProfileScreen">) {
  const [profile, setProfile] = useState<Profile>();
  const [profileList, setProfileList] = useState<string[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [focusId, setFocusId] = useState(0);
  const theme = useTheme();
  const { ctx, setContext } = useContext(LotideContext);

  useEffect(
    () => navigation.addListener("focus", () => setFocusId(x => x + 1)),
    [],
  );

  useEffect(() => {
    if (!ctx.login) return;
    // TODO: Use the pagination feature
    LotideService.getCommunities(ctx, true).then(communities =>
      setCommunities(communities.items),
    );
  }, [ctx.login?.user.id, focusId]);

  useEffect(() => {
    if (ctx.login !== undefined && ctx.login.user !== undefined) {
      getUserData(ctx, ctx.login?.user.id || 0).then(setProfile);
    }
  }, [ctx.login?.token, focusId]);

  useEffect(() => {
    StorageService.lotideContextKV
      .listKeys()
      .then(keys => setProfileList(keys));
  }, [ctx, focusId]);

  if (ctx.login === undefined) {
    return <SuggestLogin />;
  }

  function logout() {
    Alert.alert(
      "Log out",
      "Would you like to keep the login profile handy for later?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            StorageService.lotideContextKV
              .remove(`${ctx.login?.user.username}@${ctx.apiUrl}`)
              .then(() => LotideService.logout(ctx))
              .then(() => setContext({}));
          },
        },
        {
          text: "Keep",
          style: "default",
          onPress: () => {
            StorageService.lotideContextKV.logout(ctx);
            setContext({});
          },
        },
      ],
      { cancelable: true },
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
              {profile?.username || ctx.login.user.username}
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
        onPress={() => setContext({})}
        title="Add Profile"
        color={theme.tint}
        accessibilityLabel="Add profile"
      />
      {profileList
        .map(p => [p, ...p.split("@")] as string[])
        .map(p => [
          p[0],
          p[1],
          p[2].replace("http://", "").replace("https://", "").split(/[/?#]/)[0],
        ])
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
                  setContext(ctx);
                  setIsEditing(false);
                }
              });
            }}
          >
            <ActorDisplay
              name={p[1]}
              host={p[2]}
              local={true}
              showHost={"always"}
              colorize={"never"}
              newLine={true}
            />
          </Pressable>
        ))}
      <View style={{ paddingTop: 10 }}>
        <Button
          onPress={() => navigation.navigate("NewCommunity")}
          title="Create Community"
          color={theme.tint}
          accessibilityLabel="Create a new community"
        />
      </View>
      <Text style={styles.followingTitle}>Communities You Follow:</Text>
      {communities.map(community => (
        <View
          key={community.id}
          style={[
            styles.altProfileButton,
            { borderColor: theme.secondaryBackground },
          ]}
        >
          <ActorDisplay
            name={community.name}
            host={community.host}
            local={community.local}
            showHost={"always"}
            colorize={"always"}
            newLine={true}
          />
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
