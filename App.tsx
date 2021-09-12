import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import LotideContext, { defaultLotideContext } from "./store/LotideContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [ctx, setContext] = useState<LotideContext>(defaultLotideContext);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <LotideContext.Provider
        value={{
          ctx,
          setContext: (ctx: any) => setContext(ctx),
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
