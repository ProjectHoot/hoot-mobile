import { useDispatch } from "react-redux";
import { setPostVote } from "../slices/postSlice";
import { AppDispatch } from "../store/reduxStore";
import * as LotideService from "../services/LotideService";
import { useLotideCtx } from "./useLotideCtx";
import { setCommentVote } from "../slices/commentSlice";

export default function useVote(type: ContentType, content: Post | Comment) {
  const isUpvoted = !!content.your_vote;
  const dispatch = useDispatch<AppDispatch>();
  const ctx = useLotideCtx();

  function dispatchVote(vote: boolean) {
    if (type == "post") {
      dispatch(setPostVote({ id: content.id, vote }));
    } else {
      dispatch(setCommentVote({ id: content.id, vote }));
    }
  }

  function addVote() {
    if (!ctx?.login) return;
    if (type == "post") {
      LotideService.applyVote(ctx, content.id).then(() => dispatchVote(true));
    } else {
      LotideService.applyCommentVote(ctx, content.id).then(() =>
        dispatchVote(true),
      );
    }
  }

  function removeVote() {
    if (!ctx?.login) return;
    if (type == "post") {
      LotideService.removeVote(ctx, content.id).then(() => dispatchVote(false));
    } else {
      LotideService.removeCommentVote(ctx, content.id).then(() =>
        dispatchVote(false),
      );
    }
  }

  return {
    isUpvoted,
    addVote,
    removeVote,
  };
}
