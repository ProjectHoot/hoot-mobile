import AsyncStorage from "@react-native-async-storage/async-storage";

export const lotideContext = {
  async store(ctx: LotideContext) {
    return AsyncStorage.setItem("@lotide_ctx", JSON.stringify(ctx));
  },
  async query(): Promise<LotideContext | undefined> {
    return AsyncStorage.getItem("@lotide_ctx").then(ctxStr => {
      if (ctxStr !== null) {
        console.log("HEY");
        return JSON.parse(ctxStr) as LotideContext;
      } else {
        return undefined;
      }
    });
  },
};

export const lotideContextKV = {
  async store(ctx: LotideContext) {
    if (!ctx.login) return;
    const name = `${ctx.login.user.username}@${ctx.apiUrl}`;
    serviceKV.store("@lotide_ctx_arr", name, ctx);
  },
  async query(k: string): Promise<LotideContext | undefined> {
    return serviceKV.query<LotideContext>("@lotide_ctx_arr", k);
  },
  async listKeys(): Promise<string[]> {
    return serviceKV.listKeys("@lotide_ctx_arr");
  },
  async remove(k: string): Promise<LotideContext | undefined> {
    return serviceKV.remove("@lotide_ctx_arr", k);
  },
};

const serviceKV = {
  async store<T>(path: string, k: string, v: T) {
    const storeStr = await AsyncStorage.getItem(path);
    console.log("ASNTEHUS");
    const store = storeStr ? JSON.parse(storeStr) : {};
    store[k] = v;
    await AsyncStorage.setItem(path, JSON.stringify(store));
  },

  async query<T>(path: string, k: string): Promise<T | undefined> {
    const storeStr = await AsyncStorage.getItem(path);
    console.log("BKRBKSOTEHJ");
    return storeStr ? JSON.parse(storeStr)[k] : undefined;
  },

  async listKeys(path: string): Promise<string[]> {
    const storeStr = await AsyncStorage.getItem(path);
    console.log("CKBSNPTOBJ");
    const store = storeStr ? JSON.parse(storeStr) : {};
    return Object.keys(store);
  },

  async remove<T>(path: string, k: string): Promise<T | undefined> {
    const storeStr = await AsyncStorage.getItem(path);
    console.log("DMKSNPTBONS");
    const store = storeStr ? JSON.parse(storeStr) : {};
    const v = store[k];
    delete store[k];
    await AsyncStorage.setItem(path, JSON.stringify(store));
    return v;
  },
};
