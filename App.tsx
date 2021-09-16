import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import LotideContext, { defaultLotideContext } from "./store/LotideContext";
import * as StorageService from "./services/StorageService";
import { lotideRequest } from "./services/LotideService";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [ctx, setContext] = useState<LotideContext>(defaultLotideContext);

  useEffect(() => {
    fetch("https://hoot.goldandblack.xyz/api/unstable/logins", {
      method: "POST",
      body: JSON.stringify({ username: "bradnon", password: "asdf" }),
    })
      .then(data => data.json())
      .then(() => console.log("got it"))
      .catch(e => {
        console.error("don't got it", e);
      });
    lotideRequest(
      { apiUrl: "https://hoot.goldandblack.xyz/api/unstable" },
      "POST",
      "logins",
      { username: "bradnon", password: "asdf" },
      true,
    )
      .then(data => data.json())
      .then(data => console.log("got the other", data));
    StorageService.lotideContext.query().then(ctx => {
      if (ctx !== undefined) {
        setContext(ctx);
      }
    });
  }, []);

  function applyNewContext(ctx: LotideContext) {
    StorageService.lotideContextKV.store(ctx);
    AsyncStorage.setItem("@lotide_ctx", JSON.stringify(ctx)).then();
    setContext(ctx);
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <LotideContext.Provider
        value={{
          ctx,
          setContext: (ctx: LotideContext) => applyNewContext(ctx),
        }}
      >
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </LotideContext.Provider>
    );
  }
}
