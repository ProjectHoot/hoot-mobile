import React, { useContext, useEffect, useState } from "react";
import LotideContext from "./LotideContext";
import * as LotideService from "../services/LotideService";

export const defaultContext: VoteContext = {
  vote: false,
  score: 0,
  addVote: () => {},
  removeVote: () => {},
};

export const VoteContext = React.createContext<VoteContext>(defaultContext);

export type VoteContextProviderProps = {
  content: Post | Reply;
  type: ContentType;
};

export const VoteContextProvider: React.FC<VoteContextProviderProps> =
  props => {
    const isUpvotedByAPI =
      props.content.your_vote !== null && props.content.your_vote !== undefined;
    const [isUpvoted, setIsUpvoted] = useState(isUpvotedByAPI);
    const { ctx } = useContext(LotideContext);

    useEffect(() => setIsUpvoted(isUpvotedByAPI), [props.content.your_vote]);

    function addVote() {
      if (props.type == "post") {
        console.log("add vote");
        LotideService.applyVote(ctx, props.content.id).then(() =>
          setIsUpvoted(true),
        );
      } else {
        LotideService.applyReplyVote(ctx, props.content.id).then(() =>
          setIsUpvoted(true),
        );
      }
    }

    function removeVote() {
      if (props.type == "post") {
        LotideService.removeVote(ctx, props.content.id).then(() =>
          setIsUpvoted(false),
        );
      } else {
        LotideService.removeReplyVote(ctx, props.content.id).then(() =>
          setIsUpvoted(false),
        );
      }
    }

    const shouldAddOne = isUpvoted && !isUpvotedByAPI;
    const shouldSubtractOne = !isUpvoted && isUpvotedByAPI;

    return (
      <VoteContext.Provider
        value={{
          vote: isUpvoted,
          score: props.content.score + +shouldAddOne - +shouldSubtractOne,
          addVote,
          removeVote,
        }}
      >
        {props.children}
      </VoteContext.Provider>
    );
  };
