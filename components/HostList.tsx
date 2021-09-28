import React, { useContext, useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import KnownHosts from "../constants/KnownHosts";
import ActorDisplay from "./ActorDisplay";
import { Text, TextInput, View } from "./Themed";
import * as LotideService from "../services/LotideService";
import useTheme from "../hooks/useTheme";
import { lotideContextKV } from "../services/StorageService";
import LotideContext from "../store/LotideContext";

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
  const [existingProfiles, setExistingProfiles] = useState<
    [string, LotideContext][]
  >([]);
  const theme = useTheme();
  const lotideContext = useContext(LotideContext);

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

  useEffect(() => {
    lotideContextKV
      .getStore()
      .then(object => Object.entries(object))
      .then(setExistingProfiles);
  }, []);

  const renderItem = ({ item }: { item: HostData }) => {
    const enabled = item.instanceInfo?.software.version.startsWith("0.9.");
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
            styleName={{
              fontSize: 24,
              fontWeight: "300",
              fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
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
    <ScrollView style={styles.root}>
      <Text style={styles.title}>Login to continue</Text>
      {existingProfiles.length > 0 && (
        <Text style={styles.subtitle}>Select an existing profile</Text>
      )}
      {existingProfiles.map(p => {
        const [username, url] = p[0].split("@");
        return (
          <Pressable
            key={p[0]}
            onPress={() => {
              lotideContext.setContext(p[1]);
            }}
          >
            <ActorDisplay
              name={username}
              host={
                url
                  .replace("http://", "")
                  .replace("https://", "")
                  .split(/[/?#]/)[0]
              }
              local={true}
              showHost={"always"}
              newLine={true}
              style={{ paddingVertical: 5, paddingBottom: 10 }}
            />
          </Pressable>
        );
      })}
      <Text style={styles.subtitle}>
        {existingProfiles.length > 0
          ? "Or sign into a new acount"
          : "Enter a host or select one below"}
      </Text>
      <TextInput
        placeholder="Host domain"
        style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        value={hostText}
        onChangeText={setHostText}
        onSubmitEditing={() => props.onSelect(hostText.toLowerCase())}
        keyboardType="url"
        returnKeyType="next"
      />
      {knownHosts
        .filter(
          x =>
            hostText === "" ||
            x.domain.includes(hostText.toLowerCase()) ||
            x.name.toLowerCase().includes(hostText.toLowerCase()),
        )
        .map(item => (
          <View key={item.domain}>{renderItem({ item })}</View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
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
