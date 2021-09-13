import { useState, useEffect, useContext } from "react";
import LotideContext from "../store/LotideContext";
import * as LotideService from "../services/LotideService";
import { useRefreshableData } from "./useRefreshableData";

export function useFeedPosts(): Refreshable<Post[]> {
  const [posts, setPosts] = useState([] as any[]);
  const ctx = useContext(LotideContext).ctx;

  const [isLoading, refresh] = useRefreshableData(
    stopLoading => {
      LotideService.getFeedPosts(ctx)
        .then(setPosts)
        .then(() => stopLoading());
    },
    [ctx],
  );

  return [posts, isLoading, refresh];
}

export function useReplies(postId: number): Replies {
  const [replies, setReplies] = useState({
    items: [] as Reply[],
  } as Replies);
  useEffect(() => {
    fetch(`https://hoot.goldandblack.xyz/api/unstable/posts/${postId}/replies`)
      .then(data => data.json())
      .then(data => {
        console.log("use replies", JSON.stringify(data, null, 2));
        setReplies(data);
      });
  }, []);
  return replies;
}
