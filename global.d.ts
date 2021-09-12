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
  id: number;
  is_site_admin: false;
  username: string;
}

interface Post {
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
  your_vote?: null | {};
}

interface Author {
  host: string;
  id: number;
  local: boolean;
  remote_url?: string;
  username: string;
  avatar?: {
    url: string;
  };
}

interface Community {
  host: string;
  id: number;
  local: boolean;
  name: string;
  remote_url?: string;
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
