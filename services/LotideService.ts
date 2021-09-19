export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

// ** API FUNCTIONS **

export async function login(
  apiUrl: string,
  username: string,
  password: string,
): Promise<Login> {
  return lotideRequest(
    { apiUrl },
    "POST",
    "logins",
    { username, password },
    true,
  ).then(data => data.json());
}

export async function register(
  apiUrl: string,
  username: string,
  password: string,
  email?: string,
): Promise<Login> {
  return lotideRequest(
    { apiUrl },
    "POST",
    "users",
    {
      username,
      password,
      email_address: email,
      login: true,
    },
    true,
  ).then(data => data.json());
}

export async function logout(ctx: LotideContext) {
  return lotideRequest(ctx, "DELETE", "logins/~current");
}

export async function getNotifications(
  ctx: LotideContext,
): Promise<UserNotification[]> {
  return lotideRequest(ctx, "GET", "users/~me/notifications").then(data =>
    data.json(),
  );
}

export async function getPost(
  ctx: LotideContext,
  postId: PostId,
): Promise<Post> {
  return lotideRequest(ctx, "GET", `posts/${postId}`, undefined, true).then(
    data => data.json(),
  );
}

export async function getPosts(
  ctx: LotideContext,
  page: string | null,
  sort: SortOption = "hot",
  inYourFollows?: boolean,
  communityId?: CommunityId,
): Promise<Paged<Post>> {
  const url = [
    page === null ? `posts?sort=${sort}` : `posts?page=${page}&sort=${sort}`,
    `include_your=true`,
    inYourFollows !== undefined && `in_your_follows=${inYourFollows}`,
    communityId && `community=${communityId}`,
  ]
    .filter(x => x)
    .join("&");
  return lotideRequest(ctx, "GET", url).then(data => data.json());
}

export async function submitPost(
  ctx: LotideContext,
  post: NewPost,
): Promise<{ id: PostId }> {
  return lotideRequest(ctx, "POST", "posts", post).then(data => data.json());
}

export async function getReply(
  ctx: LotideContext,
  replyId: ReplyId,
): Promise<Reply> {
  return lotideRequest(ctx, "GET", `comments/${replyId}`, undefined, true).then(
    data => data.json(),
  );
}

export async function getPostReplies(
  ctx: LotideContext,
  postId: PostId,
  page?: string,
): Promise<Paged<Reply>> {
  return lotideRequest(
    ctx,
    "GET",
    `posts/${postId}/replies?limit=10` + (page ? `&page=${page}` : ""),
    undefined,
    true,
  ).then(data => data.json());
}

export async function getReplyReplies(
  ctx: LotideContext,
  replyId: ReplyId,
  page?: string,
): Promise<Paged<Reply>> {
  return lotideRequest(
    ctx,
    "GET",
    `comments/${replyId}/replies?limit=10` + (page ? `&page=${page}` : ""),
    undefined,
    true,
  ).then(data => data.json());
}

export async function replyToPost(
  ctx: LotideContext,
  postId: PostId,
  content: string,
): Promise<{ id: number }> {
  return lotideRequest(ctx, "POST", `posts/${postId}/replies`, {
    content_markdown: content,
  }).then(data => data.json());
}

export async function replyToReply(
  ctx: LotideContext,
  replyId: number,
  content: string,
): Promise<{ id: number }> {
  return lotideRequest(ctx, "POST", `comments/${replyId}/replies`, {
    content_markdown: content,
  }).then(data => data.json());
}

export async function getCommunities(
  ctx: LotideContext,
  onlyFollowing: boolean = false,
): Promise<Paged<Community>> {
  return lotideRequest(
    ctx,
    "GET",
    `communities?include_your=true${
      onlyFollowing ? "&your_follow.accepted=true" : ""
    }`,
  )
    .then(data => data.json())
    .then(data => {
      return data;
    });
}

export async function getCommunity(
  ctx: LotideContext,
  communityId: CommunityId,
): Promise<Community> {
  return lotideRequest(
    ctx,
    "GET",
    `communities/${communityId}?include_your=true`,
  ).then(data => data.json());
}

export async function getUserData(ctx: LotideContext, userId: number) {
  return lotideRequest(ctx, "GET", `users/${userId}`, undefined, true).then(
    data => data.json(),
  );
}

export async function followCommunity(
  ctx: LotideContext,
  communityId: number,
): Promise<{ accepted: boolean }> {
  return lotideRequest(ctx, "POST", `communities/${communityId}/follow`, {
    try_wait_for_accept: true,
  }).then(data => data.json());
}

export async function unfollowCommunity(
  ctx: LotideContext,
  communityId: number,
) {
  return lotideRequest(ctx, "POST", `communities/${communityId}/unfollow`);
}

export async function applyVote(ctx: LotideContext, postId: number) {
  return lotideRequest(ctx, "PUT", `posts/${postId}/your_vote`);
}

export async function removeVote(ctx: LotideContext, postId: number) {
  return lotideRequest(ctx, "DELETE", `posts/${postId}/your_vote`);
}

// ** UTIL **

export async function lotideRequest(
  ctx: LotideContext,
  method: RequestMethod,
  path: string,
  body?: any,
  noLogin: boolean = false,
): Promise<any | undefined> {
  if (!noLogin && ctx.login == undefined) {
    throw path;
  }
  return fetch(`${ctx.apiUrl}/${path}`, {
    method,
    headers: buildHeaders(ctx),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
    .then(async res => {
      if (res.ok) {
        return res;
      } else {
        throw await res.text();
      }
    })
    .catch(e => {
      console.error(
        `Lotide Service Error: ${method} ${ctx.apiUrl}/${path}\n${e}`,
        ctx,
      );
      throw e;
    });
}

export function buildHeaders(ctx: LotideContext): HeadersInit | undefined {
  return ctx.login !== undefined
    ? {
        Authorization: `Bearer ${ctx.login.token}`,
        "Content-Type": "application/json",
      }
    : undefined;
}
