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
export default function useReply(replyId?: ReplyId): Reply | undefined {
  const dispatch = useDispatch();
  const reply: Reply | undefined = useSelector((state: RootState) =>
    replyId ? state.replies.replies[replyId] : undefined,
  );
  const ctx = useLotideCtx();

  useEffect(() => {
    if (!ctx) return;
    if (!replyId) return;
    if (!reply) {
      LotideService.getReply(ctx, replyId)
        .then(replies => {
          dispatch(setReplyMulti({ replies }));
        })
        .catch(() => console.log(`Reply ${replyId} could not be loaded`));
    }
  }, [reply?.id]);

  return (
    reply && {
      ...reply,
      replies: undefined,
    }
  );
}
