import { useDispatch, useSelector } from "react-redux";
import { setSelectedReply } from "../slices/replySlice";
import { RootState } from "../store/reduxStore";

export default function useSelectedReply(): [
  ReplyId | undefined,
  (id?: ReplyId) => void,
] {
  const dispatch = useDispatch();
  const selectedReply = useSelector(
    (state: RootState) => state.replies.selectedReply,
  );
  function set(id?: ReplyId) {
    dispatch(setSelectedReply(id));
  }
  return [selectedReply, set];
}
