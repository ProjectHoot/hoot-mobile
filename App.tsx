import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import LotideContext, { defaultLotideContext } from "./store/LotideContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [ctx, setContext] = useState<LotideContext>(defaultLotideContext);

  useEffect(() => {
    AsyncStorage.getItem("@lotide_ctx").then(ctxStr => {
      if (ctxStr !== null) {
        console.log("Loaded Lotide context", ctxStr);
        setContext(JSON.parse(ctxStr));
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
          setContext: (ctx: any) => applyNewContext(ctx),
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
