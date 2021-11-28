type CommunityId = number;
type PostId = number;
type CommentId = number;
type UserId = number;

type SortOption = "hot" | "new" | "top";

interface LotideContext {
  apiUrl?: string;
  apiVersion?: number;
  login?: Login;
}

type VoteContext = {
  vote: boolean;
  score: number;
  addVote: () => void;
  removeVote: () => void;
};

type ContentType = "post" | "comment";

interface Login {
  token: string;
  user: User;
}

interface InstanceInfo {
  description?:
    | string
    | {
        content_html?: string;
        content_markdown?: string;
        content_text?: string;
      };
  apiVersion: number;
  software: {
    name: string;
    version: string;
  };
}

interface UserNotification {
  unseen: boolean;
  type: "post_reply" | "comment_reply";
  comment: {
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
  commentId: CommentId;
  origin: {
    type: "post" | "comment";
    id: number;
  };
  postId: PostId;
}

interface FullNotificationOrigin {
  type: "post" | "comment";
  id: number;
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
  your_vote?: boolean;
  replies?: Paged<CommentId>;
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

interface Comment {
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
  /**
   * If undefined, then the comment has replies that aren't being loaded due to depth restrictions
   * The api will need to be hit again to get them
   * */
  replies?: Paged<CommentId>;
  your_vote?: boolean;
  score: number;
}

interface HrefData {
  imageUrl?: string;
  linkUrl?: string;
  isVideo?: boolean;
}

type Refreshable<T> = [T, boolean, () => void];
