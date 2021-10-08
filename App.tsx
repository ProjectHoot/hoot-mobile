import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import * as StorageService from "./services/StorageService";
import * as LotideService from "./services/LotideService";
import { Provider, useDispatch } from "react-redux";
import { setCtx } from "./slices/lotideSlice";
import reduxStore from "./store/reduxStore";
import { useLotideCtx } from "./hooks/useLotideCtx";
import { Alert } from "react-native";

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const ctx = useLotideCtx();
  const dispatch = useDispatch();

  useEffect(() => {
    StorageService.lotideContext.query().then(ctx => {
      if (ctx !== undefined) {
        dispatch(setCtx(ctx));
      }
    });
  }, []);

  useEffect(() => {
    if (!ctx?.apiUrl) return;
    LotideService.getInstanceInfo(ctx)
      .then(data => {
        console.log(ctx);
        console.log("version", data.apiVersion);
        if (data.apiVersion < 8 || data.apiVersion > 10) throw "Bad version";
        if (data.apiVersion == ctx.apiVersion) return;
        applyNewContext({
          ...ctx,
          apiVersion: data.apiVersion,
        });
      })
      .catch(e => {
        Alert.alert("Failed to login", e);
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
  }, [ctx?.apiUrl, ctx?.apiVersion]);

  function applyNewContext(ctx: LotideContext) {
    StorageService.lotideContextKV
      .store(ctx)
      .then(() => AsyncStorage.setItem("@lotide_ctx", JSON.stringify(ctx)))
      .then(() => dispatch(setCtx(ctx)));
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default function () {
  return (
    <Provider store={reduxStore}>
      <App />
    </Provider>
  );
}
