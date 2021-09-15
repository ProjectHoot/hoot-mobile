import { useState, useEffect, useContext } from "react";
import LotideContext from "../store/LotideContext";
import * as LotideService from "../services/LotideService";
import { useRefreshableData } from "./useRefreshableData";

export function useFeedPosts(sort?: SortOption): Refreshable<Post[]> {
  const [posts, setPosts] = useState([] as any[]);
  const ctx = useContext(LotideContext).ctx;

  const [isLoading, refresh] = useRefreshableData(
    stopLoading => {
      LotideService.getFeedPosts(ctx, sort)
        .then(setPosts)
        .then(() => stopLoading());
    },
    [ctx, sort],
  );

  return [posts, isLoading, refresh];
}

export function useReplies(ctx: LotideContext, postId: number): Replies {
  const [replies, setReplies] = useState({
    items: [] as Reply[],
  } as Replies);
  useEffect(() => {
    LotideService.getPostReplies(ctx, postId).then(data => {
      console.log("use replies", JSON.stringify(data, null, 2));
      setReplies(data);
    });
  }, []);
  return replies;
}
