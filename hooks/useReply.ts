import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reduxStore";
import { useLotideCtx } from "./useLotideCtx";
import * as LotideService from "../services/LotideService";
import { setReplyMulti } from "../slices/replySlice";

/**
 * Gets a single reply
 *
 * For child replies, see useReplies
 */
export default function useReply(replyId: ReplyId): Reply | undefined {
  const dispatch = useDispatch();
  const reply: Reply | undefined = useSelector(
    (state: RootState) => state.replies.replies[replyId],
  );
  const ctx = useLotideCtx();

  useEffect(() => {
    if (!ctx) return;
    if (!reply) {
      LotideService.getReply(ctx, replyId).then(replies => {
        dispatch(setReplyMulti({ replies }));
      });
    }
  }, [reply?.id]);

  return {
    ...reply,
    replies: undefined,
  };
}
