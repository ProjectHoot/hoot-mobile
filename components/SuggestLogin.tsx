import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "./Themed";
import HostList from "./HostList";
import Login from "./Login";

export default function SuggestLogin() {
  const [hostName, setHostName] = useState<string>();
  const [domain, setDomain] = useState<string>();
  const [username, setUsername] = useState<string>();

  return (
    <View style={styles.root}>
      {!domain ? (
        <HostList
          onSelect={(domain, name, username) => {
            setHostName(name);
            setDomain(domain);
            setUsername(username);
          }}
        />
      ) : (
        <Login
          hostName={hostName}
          domain={domain}
          username={username}
          onGoBack={() => setDomain(undefined)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  actionButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
