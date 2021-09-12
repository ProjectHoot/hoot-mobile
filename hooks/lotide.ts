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

export async function applyVote(postId: number, login: Login) {
  return fetch(
    `https://hoot.goldandblack.xyz/api/unstable/posts/${postId}/your_vote`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    },
  );
}

export async function removeVote(postId: number) {
  return fetch(
    `https://hoot.goldandblack.xyz/api/unstable/posts/${postId}/your_vote`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer ",
      },
    },
  );
}

export async function attemptLogin(username: string, password: string) {
  return fetch(`https://hoot.goldandblack.xyz/api/unstable/logins`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
    .then(data => data.json())
    .then(data => {
      console.log("attempt login", JSON.stringify(data, null, 2));
      return data;
    })
    .catch(e => console.error(e));
}

export async function followCommunity(communityId: number, login: Login) {
  return fetch(
    `https://hoot.goldandblack.xyz/api/unstable/communities/${communityId}/follow`,
    {
      method: "POST",
      body: JSON.stringify({
        try_wait_for_accept: true,
      }),
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    },
  );
}
