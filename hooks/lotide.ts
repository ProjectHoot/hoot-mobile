import { useState, useEffect, useContext } from "react";
import LoginContext, { Login } from "../store/LoginContext";

export interface Post {
  author: Author;
  community: Community;
  content_html: string;
  content_text?: string;
  created: string;
  href: string;
  id: number;
  replies_count_total: number;
  score: number;
  sticky: boolean;
  title: string;
}

export interface Author {
  host: string;
  id: number;
  local: boolean;
  remote_url?: string;
  username: string;
  avatar?: {
    url: string;
  };
}

export interface Community {
  host: string;
  id: number;
  local: boolean;
  name: string;
  remote_url?: string;
}

export interface Replies {
  items: Reply[];
  next_page: string;
}

export interface Reply {
  id: number;
  content_text: string;
  content_html: string;
  attachments: [
    {
      url: string;
    }
  ];
  author: Author;
  created: string;
  deleted: boolean;
  local: boolean;
  replies: Replies;
  your_vote: {};
  score: number;
}

export function usePosts(refreshCount: number): Post[] {
  const [posts, setPosts] = useState([] as any[]);
  const login = useContext(LoginContext);
  if (login.login == undefined) return [];
  /*
  Object {
    "description": "Live mirror of /r/libertarianmeme posts from Reddit.",
    "description_html": null,
    "description_text": "Live mirror of /r/libertarianmeme posts from Reddit.",
    "host": "hoot.goldandblack.xyz",
    "id": 27,
    "local": true,
    "name": "libertarianmemeReddit",
    "remote_url": null,
  },
  */
  useEffect(() => {
    fetch(
      "https://hoot.goldandblack.xyz/api/unstable/users/~me/following:posts",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${login.login!.token}`,
        },
      }
    )
      .then((data) => data.json())
      .then((data) => {
        setPosts(data);
      });
  }, [refreshCount]);
  return posts;
}

export function useReplies(postId: number): Replies {
  const [replies, setReplies] = useState({
    items: [] as Reply[],
  } as Replies);
  useEffect(() => {
    fetch(`https://hoot.goldandblack.xyz/api/unstable/posts/${postId}/replies`)
      .then((data) => data.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));
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
    }
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
    }
  );
}

export async function attemptLogin(username: string, password: string) {
  return fetch(`https://hoot.goldandblack.xyz/api/unstable/logins`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((e) => console.error(e));
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
    }
  );
}
