import React, { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput } from "react-native";
import { View, Text } from "../components/Themed";
import useTheme from "../hooks/useTheme";
import { getCommunities } from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import * as Haptics from "expo-haptics";
import { RootTabScreenProps } from "../types";

/*
{
  "id": 13,
  "name": "Capitalism",
  "local": true,
  "host": "hoot.goldandblack.xyz",
  "remote_url": null,
  "description": "",
  "description_html": null,
  "description_text": ""
}
*/

export default function Search({ navigation }: RootTabScreenProps<"Search">) {
  const [text, onChangeText] = React.useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const ctx = useContext(LotideContext).ctx;
  const theme = useTheme();
  useEffect(() => {
    getCommunities(ctx).then(setCommunities);
  }, []);
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
      onPress={() => console.log("lol")}
      onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
    >
      <View
        style={[styles.item, { backgroundColor: theme.secondaryBackground }]}
      >
        <Text
          style={{
            color: community.local ? theme.blue : theme.green,
            fontWeight: "bold",
          }}
        >
          {community.name}{" "}
          {!community.local && (
            <Text style={{ color: theme.secondaryText, fontWeight: "300" }}>
              | {community.host}
            </Text>
          )}
        </Text>
      </View>
    </Pressable>
  );
};
