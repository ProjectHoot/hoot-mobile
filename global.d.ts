type CommunityId = number;
type PostId = number;
type UserId = number;

type SortOption = "hot" | "new";

interface LotideContext {
  apiUrl: string;
  login?: Login;
}

interface Login {
  token: string;
  user: User;
}

interface User {
  has_unread_notifications: boolean;
  id: UserId;
  is_site_admin: false;
  username: string;
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
}

interface Replies {
  items: Reply[];
  next_page: string;
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
  replies: Replies;
  your_vote: {};
  score: number;
}

type Refreshable<T> = [T, boolean, () => void];
