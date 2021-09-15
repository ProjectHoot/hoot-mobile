import React, { useContext } from "react";
import { Alert, Button } from "react-native";
import { View, Text } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { RootStackScreenProps } from "../types";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";

export default function CommunityScreen({
  navigation,
  route,
}: RootStackScreenProps<"Community">) {
  const community = route.params.community;
  const theme = useTheme();
  const ctx = useContext(LotideContext).ctx;

  function subscribe() {
    LotideService.followCommunity(ctx, community.id).then(() =>
      Alert.alert("Subscribed!"),
    );
  }

  return (
    <View>
      <Text>
        {community.name}@{community.host}
      </Text>
      <Button
        onPress={subscribe}
        title="Subscribe"
        color={theme.tint}
        accessibilityLabel="Login to the Hoot network"
      />
    </View>
  );
}
