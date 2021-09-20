import React, { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { View, Text } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { getCommunities } from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import * as Haptics from "../services/HapticService";
import { RootTabScreenProps } from "../types";
import ActorDisplay from "../components/ActorDisplay";
import SuggestLogin from "../components/SuggestLogin";

export default function SearchScreen({
  navigation,
}: RootTabScreenProps<"SearchScreen">) {
  const [text, onChangeText] = React.useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [focusId, setFocusId] = useState(0);
  const ctx = useContext(LotideContext).ctx;
  const theme = useTheme();

  useEffect(() => {
    if (!ctx.login) return;
    // TODO: Use the pagination feature
    getCommunities(ctx).then(communities => setCommunities(communities.items));
  }, [ctx, focusId]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setFocusId(x => x + 1);
    });
  });

  if (!ctx.login) return <SuggestLogin />;

  const renderItem = ({ item }: { item: Community }) => (
    <Item community={item} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, backgroundColor: theme.secondaryBackground },
          ]}
          placeholder="Search"
          placeholderTextColor={theme.placeholderText}
          onChangeText={onChangeText}
          value={text}
        />
      </View>
      <Text>Popular communities:</Text>
      <FlatList
        data={communities}
        renderItem={renderItem}
        keyExtractor={(post, index) => `${post.id}-${index}`}
        style={{ width: "100%" }}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    borderRadius: 8,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 50,
    marginHorizontal: 20,
    marginBottom: 1,
    borderBottomWidth: 1,
  },
});

const Item = ({
  community,
  navigation,
}: {
  community: Community;
  navigation: any;
}) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => navigation.navigate("Community", { community })}
      onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
    >
      <View
        style={[styles.item, { borderBottomColor: theme.secondaryBackground }]}
      >
        <ActorDisplay
          name={community.name}
          host={community.host}
          local={community.local}
          showHost={"only_foreign"}
          colorize={"always"}
          newLine={true}
        />
        {community.your_follow?.accepted && (
          <Icon name="checkmark" size={20} color={theme.secondaryTint} />
        )}
      </View>
    </Pressable>
  );
};
