import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import LotideContext, { defaultLotideContext } from "./store/LotideContext";
import * as StorageService from "./services/StorageService";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [ctx, setContext] = useState<LotideContext>(defaultLotideContext);

  useEffect(() => {
    StorageService.lotideContext.query().then(ctx => {
      if (ctx !== undefined) {
        console.log("Loaded Lotide context", ctx);
        setContext(ctx);
      }
    });
  }, []);

  function applyNewContext(ctx: LotideContext) {
    AsyncStorage.setItem("@lotide_ctx", JSON.stringify(ctx)).then(() =>
      console.log("Saved Lotide context"),
    );
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
