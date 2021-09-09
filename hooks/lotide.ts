import { useState, useEffect } from "react";

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

export interface Comments {
  items: Comment[];
  next_page: string;
}

export interface Comment {
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
  replies: Comments;
  your_vote: {};
  score: number;
}

export function usePosts(refreshCount: number): Post[] {
  const [posts, setPosts] = useState([] as any[]);
  useEffect(() => {
    fetch("https://hoot.goldandblack.xyz/api/unstable/posts", {
      method: "GET",
      headers: {
        Authorization: "Bearer ",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        // console.log(data);
        setPosts(data);
      });
  }, [refreshCount]);
  return posts;
}

export function useComments(postId: number): Comments {
  const [comments, setComments] = useState({
    items: [] as Comment[],
  } as Comments);
  useEffect(() => {
    fetch(`https://hoot.goldandblack.xyz/api/unstable/posts/${postId}/replies`)
      .then((data) => data.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));
        setComments(data);
      });
  }, []);
  return comments;
}
