import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reduxStore";
import { useLotideCtx } from "./useLotideCtx";
import * as LotideService from "../services/LotideService";
import { editComment, setCommentMulti } from "../slices/commentSlice";
import { editPost } from "../slices/postSlice";

/**
 * Gets child comment IDs
 */
export default function useComments(
  type: ContentType,
  id: number,
): { comments?: Paged<CommentId>; loadNextPage: () => void } {
  const dispatch = useDispatch();
  const comments: Paged<CommentId> | undefined = useSelector(
    (state: RootState) =>
      type == "post"
        ? state.posts.posts[id]?.replies
        : state.comments.comments[id]?.replies,
  );
  const ctx = useLotideCtx();

  useEffect(() => {
    if (!comments && type == "post") {
      loadNextPage();
    }
  }, [!!comments]);

  function loadNextPage() {
    if (!ctx) return;
    if (comments && comments.next_page === null) return;
    switch (type) {
      case "post":
        LotideService.getPostComments(
          ctx,
          id,
          comments?.next_page || undefined,
        ).then(newComments => {
          dispatch(setCommentMulti(newComments[1]));
          dispatch(
            editPost({
              id,
              post: {
                replies: {
                  items: [
                    ...(comments?.items || []),
                    ...(newComments[0]?.items || []),
                  ],
                  next_page: newComments[0]?.next_page || null,
                },
              },
            }),
          );
        });
        break;
      case "comment":
        LotideService.getCommentComments(
          ctx,
          id,
          comments?.next_page || undefined,
        ).then(newComments => {
          dispatch(setCommentMulti(newComments[1]));
          dispatch(
            editComment({
              id,
              comment: {
                replies: {
                  items: [
                    ...(comments?.items || []),
                    ...(newComments[0]?.items || []),
                  ],
                  next_page: newComments[0]?.next_page || null,
                },
              },
            }),
          );
        });
        break;
    }
  }

  return {
    comments,
    loadNextPage,
  };
}
