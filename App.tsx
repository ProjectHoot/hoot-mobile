import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import LotideContext, { defaultLotideContext } from "./store/LotideContext";
import * as StorageService from "./services/StorageService";
import * as LotideService from "./services/LotideService";
import { Provider } from "react-redux";
import reduxStore from "./store/reduxStore";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [ctx, setContext] = useState<LotideContext>(defaultLotideContext);

  useEffect(() => {
    StorageService.lotideContext.query().then(ctx => {
      if (ctx !== undefined) {
        setContext(ctx);
      }
    });
  }, []);

  useEffect(() => {
    if (!ctx.apiUrl) return;
    LotideService.getInstanceInfo(ctx)
      .then(data => {
        console.log(data);
        if (!data.software.version.startsWith("0.9.")) {
          throw "Bad version";
        }
      })
      .catch(() => {
        StorageService.lotideContextKV
          .remove(`${ctx.login?.user.username}@${ctx.apiUrl}`)
          .then(() => applyNewContext({}));
      });
    if (!ctx.login) return;
    LotideService.getUserData(ctx, ctx.login.user.id).catch(() => {
      StorageService.lotideContextKV
        .remove(`${ctx.login?.user.username}@${ctx.apiUrl}`)
        .then(() => applyNewContext({}));
    });
  }, [ctx]);

  function applyNewContext(ctx: LotideContext) {
    StorageService.lotideContextKV
      .store(ctx)
      .then(() => AsyncStorage.setItem("@lotide_ctx", JSON.stringify(ctx)))
      .then(() => setContext(ctx));
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={reduxStore}>
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
      </Provider>
    );
  }
}
