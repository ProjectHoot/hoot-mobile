import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import KnownHosts from "../constants/KnownHosts";
import ActorDisplay from "./ActorDisplay";
import { Text, TextInput, View } from "./Themed";
import * as LotideService from "../services/LotideService";
import useTheme from "../hooks/useTheme";
import { lotideContextKV } from "../services/StorageService";
import { setCtx } from "../slices/lotideSlice";
import { useDispatch } from "react-redux";
import ContentDisplay from "./ContentDisplay";

export interface HostListProps {
  onSelect: (domain: string, name?: string, username?: string) => void;
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
  const dispatch = useDispatch();

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
    const enabled = (item.instanceInfo?.apiVersion || 0) > 8;
    const color = enabled ? theme.text : theme.secondaryText;
    const description = item.instanceInfo?.description;
    return (
      <View
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth || 1,
          borderColor: theme.secondaryText,
          paddingVertical: 25,
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
                {item.instanceInfo.software.name}{" "}
                {item.instanceInfo.software.version}
                {!enabled && " - Out of date"}
              </Text>
              {!!description &&
                (typeof description === "string" ? (
                  <Text style={{ color }}>{description}</Text>
                ) : (
                  <ContentDisplay
                    contentHtml={description.content_html}
                    contentMarkdown={description.content_markdown}
                    contentText={description.content_text}
                  />
                ))}
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
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>Login to continue</Text>
      {existingProfiles.length > 0 && (
        <Text style={styles.subtitle}>Select an existing profile</Text>
      )}
      {existingProfiles.map(p => {
        const [username, url] = p[0].split("@");
        const isUnlocked = !!p[1].login;
        const color = isUnlocked ? theme.text : theme.secondaryText;
        const host = url
          .replace("http://", "")
          .replace("https://", "")
          .split(/[/?#]/)[0];
        const hostName = KnownHosts.find(x => x.domain == host)?.name;
        return (
          <Pressable
            key={p[0]}
            onPress={() => {
              if (isUnlocked) {
                dispatch(setCtx(p[1]));
              } else {
                props.onSelect(host.toLowerCase(), undefined, username);
              }
            }}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              name={isUnlocked ? "lock-open-outline" : "lock-closed-outline"}
              color={color}
              style={{ marginRight: 10 }}
              size={20}
            />
            <ActorDisplay
              name={username}
              host={host}
              local={true}
              showHost={"always"}
              newLine={true}
              style={{ paddingVertical: 15, paddingBottom: 10 }}
              styleName={{ color }}
            />
            <View style={{ flex: 1 }} />
            <Text
              style={{
                fontSize: 16,
                color,
                fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
              }}
            >
              {hostName}
            </Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "300",
    marginBottom: 10,
    marginTop: 15,
    textAlign: "center",
  },
});
