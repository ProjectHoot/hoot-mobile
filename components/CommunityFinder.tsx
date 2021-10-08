import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import * as LotideService from "../services/LotideService";
import ActorDisplay from "./ActorDisplay";
import useTheme from "../hooks/useTheme";
import { useLotideCtx } from "../hooks/useLotideCtx";

export interface CommunityFinderProps {
  placeholder?: string;
  onlyWhenTyping?: boolean;
  focusId?: number;
  onSelect: (community: Community) => void;
}

export default function CommunityFinder(props: CommunityFinderProps) {
  const [communities, setCommunities] = useState<Paged<Community>>();
  const [filterText, setFilterText] = useState("");
  const ctx = useLotideCtx();
  const theme = useTheme();

  const communitiesToDisplay = (() => {
    if (props.onlyWhenTyping && filterText === "") return [];
    if (!communities) return [];
    if (filterText === "") return communities.items;
    return communities.items.filter(c =>
      c.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  })();

  useEffect(() => {
    if (!ctx) return;
    LotideService.getCommunities(ctx, false).then(setCommunities);
  }, [ctx?.login?.token, props.focusId]);

  const renderItem = ({ item }: { item: Community }) => {
    return (
      <Pressable
        onPress={() => props.onSelect(item)}
        style={[
          styles.item,
          {
            borderColor: theme.tertiaryBackground,
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ActorDisplay
            name={item.name}
            host={item.host}
            local={item.local}
            colorize={"always"}
            newLine
          />
          <View style={{ display: "flex", flexDirection: "row" }}>
            {item.you_are_moderator && (
              <Icon
                name="shield-outline"
                size={20}
                color={theme.secondaryTint}
              />
            )}
            {item.your_follow?.accepted && (
              <Icon
                name="checkmark"
                size={20}
                color={theme.secondaryTint}
                style={{ marginLeft: 5 }}
              />
            )}
          </View>
        </View>
        {!!item.description && item.description.length > 0 && (
          <Text style={{ color: theme.secondaryText, marginTop: 10 }}>
            {item.description?.substring(0, 120)}
            {(item.description?.length || 0) > 120 && "..."}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      data={communitiesToDisplay}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={styles.list}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <View style={{ backgroundColor: theme.background, padding: 15 }}>
          <TextInput
            placeholder={props.placeholder || "Filter communities"}
            placeholderTextColor={theme.placeholderText}
            value={filterText}
            onChangeText={setFilterText}
            style={[styles.input, { color: theme.text }]}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 25,
    paddingVertical: 10,
  },
  list: {
    paddingBottom: 50,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth || 1,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
});
