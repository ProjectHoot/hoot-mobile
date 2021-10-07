import { useSelector } from "react-redux";
import { RootState } from "../store/reduxStore";

export function useLotideCtx() {
  const ctx = useSelector((state: RootState) => state.lotide.ctx);
  return ctx;
}
