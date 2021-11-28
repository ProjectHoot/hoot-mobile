import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";
import { getUserData } from "../services/LotideService";
import { RootTabScreenProps } from "../types";
import SuggestLogin from "../components/SuggestLogin";
import * as LotideService from "../services/LotideService";
import * as StorageService from "../services/StorageService";
import useTheme from "../hooks/useTheme";
import ActorDisplay from "../components/ActorDisplay";
import { useLotideCtx } from "../hooks/useLotideCtx";
import { useDispatch } from "react-redux";
import { setCtx } from "../slices/lotideSlice";
import { TappableList } from "../components/TappableList";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"ProfileScreen">) {
  const [profile, setProfile] = useState<Profile>();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [focusId, setFocusId] = useState(0);
  const theme = useTheme();
  const ctx = useLotideCtx();
  const dispatch = useDispatch();

  useEffect(
    () => navigation.addListener("focus", () => setFocusId(x => x + 1)),
    [],
  );

  useEffect(() => {
    if (!ctx?.login) return;
    // TODO: Use the pagination feature
    LotideService.getCommunities(ctx, true).then(communities =>
      setCommunities(communities.items),
    );
  }, [ctx?.login?.user.id, focusId]);

  useEffect(() => {
    if (ctx?.login !== undefined && ctx.login.user !== undefined) {
      getUserData(ctx, ctx.login?.user.id || 0).then(setProfile);
    }
  }, [ctx?.login?.token, focusId]);

  if (ctx?.login === undefined) {
    return <SuggestLogin />;
  }

  if (!profile) return <Text>Cannot load profile</Text>;

  function logout() {
    if (!ctx?.login) return;
    if (Platform.OS === "web") {
      StorageService.lotideContextKV
        .remove(`${ctx.login?.user.username}@${ctx.apiUrl}`)
        .then(() => LotideService.logout(ctx))
        .then(() => dispatch(setCtx({})));
      return;
    }
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
              .then(() => dispatch(setCtx({})));
          },
        },
        {
          text: "Keep",
          style: "default",
          onPress: () => {
            StorageService.lotideContextKV.logout(ctx);
            dispatch(setCtx({}));
          },
        },
      ],
      { cancelable: true },
    );
  }

  function comingSoon() {
    Alert.alert("Coming soon", "This feature isn't ready yet");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <View>
          <ActorDisplay
            name={profile.username}
            host={profile.host}
            local={true}
            showHost="always"
            colorize="never"
            newLine
            style={{ fontSize: 18 }}
          />
          {!!profile.avatar && <Text>{profile.avatar.url}</Text>}
          {!!profile.description && <Text>{profile.description}</Text>}
        </View>
      </View>
      <TappableList
        items={[
          {
            title: "Switch Account",
            icon: "person-add-outline",
            onPress: () => dispatch(setCtx({})),
          },
          {
            title: "Log Out",
            icon: "log-out-outline",
            onPress: () => logout(),
          },
          {
            title: "App Settings",
            icon: "settings-outline",
            disabled: true,
            onPress: comingSoon,
          },
          {
            title: "Edit Account",
            icon: "pencil-outline",
            disabled: true,
            onPress: comingSoon,
          },
          {
            title: "Your Posts / Comments",
            icon: "newspaper-outline",
            disabled: true,
            onPress: comingSoon,
          },
          {
            title: "Saved",
            icon: "bookmark-outline",
            disabled: true,
            onPress: comingSoon,
          },
          {
            title: "New Community",
            icon: "people-outline",
            onPress: () => navigation.navigate("NewCommunity"),
          },
        ]}
        style={{ marginHorizontal: 20 }}
      />

      <TappableList
        items={[
          {
            title: "Moderation",
            icon: "shield-outline",
            disabled: true,
            onPress: comingSoon,
          },
        ]}
        style={{ marginHorizontal: 20, marginTop: 20 }}
      />
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
    alignItems: "flex-start",
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
  buttonView: {
    display: "flex",
    alignItems: "center",
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
