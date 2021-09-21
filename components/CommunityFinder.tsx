import React, { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import LotideContext from "../store/LotideContext";
import { TextInput, View } from "./Themed";
import * as LotideService from "../services/LotideService";
import ActorDisplay from "./ActorDisplay";
import useTheme from "../hooks/useTheme";

export interface CommunityFinderProps {
  placeholder?: string;
  onlyWhenTyping?: boolean;
  onSelect: (community: Community) => void;
}

export default function CommunityFinder(props: CommunityFinderProps) {
  const [communities, setCommunities] = useState<Paged<Community>>();
  const [filterText, setFilterText] = useState("");
  const ctx = useContext(LotideContext).ctx;
  const theme = useTheme();

  const communitiesToDisplay = (() => {
    if (props.onlyWhenTyping && filterText === "") return [];
    if (!communities) return [];
    if (filterText === "") return communities.items;
    return communities.items.filter(
      c =>
        c.name.toLowerCase().includes(filterText.toLowerCase()) ||
        c.host.includes(filterText.toLowerCase()),
    );
  })();

  useEffect(() => {
    LotideService.getCommunities(ctx, false).then(setCommunities);
  }, [ctx.login?.token]);

  const renderItem = ({ item }: { item: Community }) => {
    return (
      <Pressable
        onPress={() => props.onSelect(item)}
        style={[
          styles.item,
          {
            borderColor: theme.secondaryBackground,
          },
        ]}
      >
        <ActorDisplay
          name={item.name}
          host={item.host}
          local={item.local}
          colorize={"always"}
          newLine
        />
        {item.your_follow?.accepted && (
          <Icon name="checkmark" size={20} color={theme.secondaryTint} />
        )}
      </Pressable>
    );
  };

  return (
    <View>
      <TextInput
        placeholder={props.placeholder || "Filter communities"}
        value={filterText}
        onChangeText={setFilterText}
        style={styles.input}
      />
      <FlatList
        data={communitiesToDisplay}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
});
