type CommunityId = number;
type PostId = number;
type ReplyId = number;
type UserId = number;

type SortOption = "hot" | "new";

interface LotideContext {
  apiUrl?: string;
  login?: Login;
}

type SelectedReplyContext = [ReplyId | undefined, (reply?: ReplyId) => void];

interface Login {
  token: string;
  user: User;
}

interface InstanceInfo {
  description?: string;
  software: {
    name: string;
    version: string;
  };
}

interface UserNotification {
  unseen: boolean;
  type: "post_reply" | "comment_reply";
  reply: {
    id: number;
    remote_url: string;
    content_text?: string;
    content_html?: string;
  };
  post: {
    id: number;
    title: string;
    remote_url: string;
  };
  comment?: number;
}

interface FullNotification {
  unseen: boolean;
  reply: {
    id: ReplyId;
    content_text?: string;
    content_html?: string;
    author: Profile;
  };
  origin: {
    type: "post" | "comment";
    id: number;
    content_text?: string;
    content_html?: string;
    author: Profile;
  };
  post: Post;
}

interface User {
  has_unread_notifications: boolean;
  id: UserId;
  is_site_admin: false;
  username: string;
}

interface Paged<T> {
  items: T[];
  next_page: string | null;
}

interface Post {
  author: Profile;
  community: Community;
  content_html: string;
  content_text?: string;
  created: string;
  href?: string;
  id: PostId;
  replies_count_total: number;
  score: number;
  sticky: boolean;
  title: string;
  your_vote?: null | {};
}

interface NewPost {
  community: CommunityId;
  title: string;
  href?: string;
  content_markdown?: string;
  content_text?: string;
}

interface Profile {
  id: number;
  username: string;
  local: boolean;
  host: string;
  remote_url?: string;
  avatar?: {
    url: string;
  };
  description?: string;
  your_note?: string;
}

interface Community {
  id: number;
  name: string;
  local: boolean;
  host: string;
  remote_url?: string;
  description?: string;
  description_html?: string;
  description_text?: string;
  you_are_moderator?: boolean;
  your_follow?: {
    accepted: boolean;
  };
}

interface Reply {
  id: number;
  content_text: string;
  content_html: string;
  attachments: [
    {
      url: string;
    },
  ];
  author: Author;
  created: string;
  deleted: boolean;
  local: boolean;
  replies: Paged<Reply> | null;
  your_vote: {};
  score: number;
}

type Refreshable<T> = [T, boolean, () => void];
