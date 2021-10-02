import { useDispatch, useSelector } from "react-redux";
import { setVote } from "../slices/voteSlice";
import { AppDispatch, RootState } from "../store/reduxStore";
import * as LotideService from "../services/LotideService";
import { useContext, useEffect } from "react";
import LotideContext from "../store/LotideContext";

export default function useVote(type: ContentType, content: Post | Reply) {
  const isUpvotedByAPI =
    content.your_vote !== null && content.your_vote !== undefined;
  const upvoteSelected: boolean | undefined = useSelector(
    (state: RootState) => state.vote[type][content.id],
  );
  const dispatch = useDispatch<AppDispatch>();
  const { ctx } = useContext(LotideContext);

  useEffect(() => {
    // TODO: This is a terrible way of doing this.
    if (upvoteSelected === undefined) {
      dispatchVote(isUpvotedByAPI);
    }
  }, [isUpvotedByAPI]);

  const isUpvoted = !!upvoteSelected;

  function dispatchVote(vote: boolean) {
    dispatch(setVote({ type, id: content.id, vote }));
  }

  function addVote() {
    if (type == "post") {
      LotideService.applyVote(ctx, content.id).then(() => dispatchVote(true));
    } else {
      LotideService.applyReplyVote(ctx, content.id).then(() =>
        dispatchVote(true),
      );
    }
  }

  function removeVote() {
    if (type == "post") {
      LotideService.removeVote(ctx, content.id).then(() => dispatchVote(false));
    } else {
      LotideService.removeReplyVote(ctx, content.id).then(() =>
        dispatchVote(false),
      );
    }
  }

  const shouldAddOne = isUpvoted && !isUpvotedByAPI;
  const shouldSubtractOne = !isUpvoted && isUpvotedByAPI;

  return {
    isUpvoted,
    score: content.score + +shouldAddOne - +shouldSubtractOne,
    addVote,
    removeVote,
  };
}
