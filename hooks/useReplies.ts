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
    if (!replies && type == "post") {
      loadNextPage();
    }
  }, [!!replies]);

  function loadNextPage() {
    if (!ctx) return;
    if (replies && replies.next_page === null) return;
    switch (type) {
      case "post":
        LotideService.getPostReplies(
          ctx,
          id,
          replies?.next_page || undefined,
        ).then(newReplies => {
          dispatch(setReplyMulti({ replies: newReplies[1] }));
          dispatch(
            editPost({
              id,
              post: {
                replies: {
                  items: [
                    ...(replies?.items || []),
                    ...(newReplies[0]?.items || []),
                  ],
                  next_page: newReplies[0]?.next_page || null,
                },
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
        ).then(newReplies => {
          dispatch(setReplyMulti({ replies: newReplies[1] }));
          dispatch(
            editReply({
              id,
              reply: {
                replies: {
                  items: [
                    ...(replies?.items || []),
                    ...(newReplies[0]?.items || []),
                  ],
                  next_page: newReplies[0]?.next_page || null,
                },
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
