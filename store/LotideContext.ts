import { createContext } from "react";

export const defaultLotideContext: LotideContext = {
  apiUrl: "https://hoot.goldandblack.xyz/api/unstable",
  login: undefined,
};

export default createContext({
  ctx: defaultLotideContext,
  setContext: (ctx: LotideContext) => {},
});
