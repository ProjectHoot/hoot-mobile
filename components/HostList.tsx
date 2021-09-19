import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import KnownHosts, { KnownHost } from "../constants/KnownHosts";
import ActorDisplay from "./ActorDisplay";
import { Text, TextInput, View } from "./Themed";
import * as LotideService from "../services/LotideService";
import { ThemeProvider } from "@react-navigation/native";
import useTheme from "../hooks/useTheme";

export interface HostListProps {
  onSelect: (domain: string, name?: string) => void;
}

interface HostData {
  name: string;
  domain: string;
  instanceInfo?: InstanceInfo | null;
}

export default function HostList(props: HostListProps) {
  const [hostText, setHostText] = useState("");
  const [knownHosts, setKnowHosts] = useState<HostData[]>(KnownHosts);
  const theme = useTheme();

  useEffect(() => {
    KnownHosts.map((h, i) => {
      return LotideService.getInstanceInfo({
        apiUrl: `https://${h.domain}/api/unstable`,
      })
        .then(d => {
          setKnowHosts(hosts =>
            hosts.map((h2, j) =>
              i !== j
                ? h2
                : { name: h2.name, domain: h2.domain, instanceInfo: d },
            ),
          );
        })
        .catch(() => {
          setKnowHosts(hosts =>
            hosts.map((h2, j) =>
              i !== j
                ? h2
                : { name: h2.name, domain: h2.domain, instanceInfo: null },
            ),
          );
        });
    });
  }, []);

  const renderItem = ({ item }: { item: HostData }) => {
    const enabled = item.instanceInfo?.software.version === "0.9.0-pre";
    const color = enabled ? theme.text : theme.secondaryText;
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: theme.secondaryBackground,
          paddingVertical: 10,
        }}
      >
        <Pressable
          onPress={() => enabled && props.onSelect(item.domain, item.name)}
        >
          <ActorDisplay
            name={item.name}
            host={item.domain}
            local={false}
            newLine={true}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#fff",
            }}
            styleName={{
              fontSize: 24,
              fontWeight: "300",
              color,
            }}
          />
          {item.instanceInfo ? (
            <>
              <Text style={{ color: theme.secondaryText }}>
                {item.instanceInfo.software.version}
                {!enabled && " - Out of date"}
              </Text>
              {!!item.instanceInfo.description && (
                <Text style={{ color }}>{item.instanceInfo.description}</Text>
              )}
            </>
          ) : item.instanceInfo === null ? (
            <Text style={{ color }}>Failed to load info</Text>
          ) : (
            <Text style={{ color }}>Loading...</Text>
          )}
        </Pressable>
      </View>
    );
  };
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Login to continue</Text>
      <Text style={styles.subtitle}>Enter a host or select one below</Text>
      <TextInput
        placeholder="Host domain"
        style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        value={hostText}
        onChangeText={setHostText}
        onSubmitEditing={() => props.onSelect(hostText.toLowerCase())}
        keyboardType="url"
        returnKeyType="next"
      />
      <FlatList
        data={knownHosts.filter(
          x =>
            hostText === "" ||
            x.domain.includes(hostText.toLowerCase()) ||
            x.name.toLowerCase().includes(hostText.toLowerCase()),
        )}
        renderItem={renderItem}
        keyExtractor={item => item.domain}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontWeight: "300",
    marginBottom: 10,
  },
});
