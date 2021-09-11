import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import LoginContext, { defaultStore } from "./store/LoginContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [login, setLogin] = useState(defaultStore);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <LoginContext.Provider value={{ login, setLogin }}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </LoginContext.Provider>
    );
  }
}
