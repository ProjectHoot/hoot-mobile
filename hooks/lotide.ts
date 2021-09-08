import { useState, useEffect } from 'react';

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
    username: string
}

export interface Community {
    host: string;
    id: number;
    local: boolean;
    name: string;
    remote_url?: string;
}

export function usePosts(): Post[] {
    const [posts, setPosts] = useState([] as any[]);
    useEffect(() => {
        console.log("fetching");
        fetch(
            "https://hoot.goldandblack.xyz/api/unstable/posts",
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '
                }
            }
        )
            .then(data => data.json())
            .then(data => {
                // console.log(data);
                setPosts(data);
            });
    }, []);
    return posts;
}
