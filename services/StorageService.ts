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
