import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reduxStore";
import { useLotideCtx } from "./useLotideCtx";
import * as LotideService from "../services/LotideService";
import { editReply, setReplyMulti } from "../slices/replySlice";
import { editPost } from "../slices/postSlice";

/**
 * Gets child reply IDs
 */
export default function useReplies(
  type: ContentType,
  id: number,
): { replies?: Paged<ReplyId>; loadNextPage: () => void } {
  const dispatch = useDispatch();
  const replies: Paged<ReplyId> | undefined = useSelector((state: RootState) =>
    type == "post"
      ? state.posts.posts[id]?.replies
      : state.replies.replies[id]?.replies,
  );
  const ctx = useLotideCtx();

  useEffect(() => {
    if (!replies) {
      loadNextPage();
    }
  }, [!!replies]);

  function loadNextPage() {
    if (!ctx) return;
    if (replies && !replies.next_page) return;
    switch (type) {
      case "post":
        LotideService.getPostReplies(
          ctx,
          id,
          replies?.next_page || undefined,
        ).then(replies => {
          dispatch(setReplyMulti({ replies: replies[1] }));
          dispatch(
            editPost({
              id,
              post: {
                replies: replies[0],
              },
            }),
          );
        });
        break;
      case "reply":
        LotideService.getReplyReplies(
          ctx,
          id,
          replies?.next_page || undefined,
        ).then(replies => {
          dispatch(setReplyMulti({ replies: replies[1] }));
          dispatch(
            editReply({
              id,
              reply: {
                replies: replies[0],
              },
            }),
          );
        });
        break;
    }
  }

  return {
    replies,
    loadNextPage,
  };
}
