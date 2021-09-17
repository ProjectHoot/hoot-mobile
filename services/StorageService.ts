import AsyncStorage from "@react-native-async-storage/async-storage";

export const lotideContext = {
  async store(ctx: LotideContext) {
    return AsyncStorage.setItem("@lotide_ctx", JSON.stringify(ctx));
  },
  async query(): Promise<LotideContext | undefined> {
    return AsyncStorage.getItem("@lotide_ctx").then(ctxStr => {
      if (ctxStr !== null) {
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

export const savedContentIds = {
  async store(ctx: LotideContext, id: number, type: "post" | "reply") {
    const [pageId, store] = await this.query(ctx);
    store.items = [{ id, type }, ...store.items];
    if (store.items.length > 3) {
      store.next_page = Math.random().toString(16).substr(2, 16);
      serviceKV.store("@content_id_current_pages", ctx.apiUrl, store.next_page);
    }
    AsyncStorage.setItem(`@content_id_page[${pageId}]`, JSON.stringify(store));
  },

  async query(
    ctx: LotideContext,
    page?: string,
  ): Promise<[string, Paged<SavedContentId>]> {
    const pageId = page || (await this.getCurrentPage(ctx));
    const storeStr = await AsyncStorage.getItem(`@content_id_page[${pageId}]`);
    const store = storeStr
      ? JSON.parse(storeStr)
      : { items: [], next_page: null };
    return [pageId, store];
  },

  async getCurrentPage(ctx: LotideContext): Promise<string> {
    return await serviceKV.queryOrStore(
      "@content_id_current_pages",
      ctx.apiUrl,
      () => Math.random().toString(16).substr(2, 16),
    );
  },
};

const serviceKV = {
  async store<T>(path: string, k: string, v: T) {
    const storeStr = await AsyncStorage.getItem(path);
    const store = storeStr ? JSON.parse(storeStr) : {};
    store[k] = v;
    await AsyncStorage.setItem(path, JSON.stringify(store));
  },

  async query<T>(path: string, k: string): Promise<T | undefined> {
    const storeStr = await AsyncStorage.getItem(path);
    return storeStr ? JSON.parse(storeStr)[k] : undefined;
  },

  async queryOrStore<T>(path: string, k: string, v: () => T): Promise<T> {
    const value = await this.query<T>(path, k);
    if (value === undefined) {
      this.store(path, k, v());
      return v();
    } else {
      return value;
    }
  },

  async listKeys(path: string): Promise<string[]> {
    const storeStr = await AsyncStorage.getItem(path);
    const store = storeStr ? JSON.parse(storeStr) : {};
    return Object.keys(store);
  },

  async remove<T>(path: string, k: string): Promise<T | undefined> {
    const storeStr = await AsyncStorage.getItem(path);
    const store = storeStr ? JSON.parse(storeStr) : {};
    const v = store[k];
    delete store[k];
    await AsyncStorage.setItem(path, JSON.stringify(store));
    return v;
  },
};
