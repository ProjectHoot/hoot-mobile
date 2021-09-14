export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

// ** API FUNCTIONS **

export async function login(
  ctx: LotideContext,
  username: string,
  password: string,
): Promise<Login> {
  return lotideRequest(
    ctx,
    "POST",
    "logins",
    { username, password },
    true,
  ).then(data => data.json());
}

export async function logout(ctx: LotideContext) {
  if (ctx.login) {
    return lotideRequest(ctx, "DELETE", "logins/~current");
  }
}

export async function getFeedPosts(
  ctx: LotideContext,
  sort: SortOption = "hot",
): Promise<Post[]> {
  if (ctx.login !== undefined) {
    return lotideRequest(ctx, "GET", `users/~me/following:posts?sort=${sort}`)
      .then(data => data.json())
      .catch(() => []);
  } else {
    return getGlobablPosts(ctx);
  }
}

export async function getGlobablPosts(ctx: LotideContext): Promise<Post[]> {
  return lotideRequest(ctx, "GET", "posts", undefined, true)
    .then(data => data.json())
    .catch(() => []);
}

export async function submitPost(
  ctx: LotideContext,
  post: NewPost,
): Promise<{ id: PostId }> {
  return lotideRequest(ctx, "POST", "posts", post).then(data => data.json());
}

export async function getPostReplies(
  ctx: LotideContext,
  postId: number,
): Promise<Replies> {
  return lotideRequest(ctx, "GET", `posts/${postId}/replies`).then(data =>
    data.json(),
  );
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

export async function getCommunities(ctx: LotideContext) {
  return lotideRequest(ctx, "GET", "communities", undefined, true).then(data =>
    data.json(),
  );
}

export async function getUserData(ctx: LotideContext, userId: number) {
  return lotideRequest(ctx, "GET", `users/${userId}`, undefined, true).then(
    data => data.json(),
  );
}

export async function followCommunity(ctx: LotideContext, communityId: number) {
  return lotideRequest(ctx, "POST", `communities/${communityId}/follow`, {
    try_wait_for_accept: true,
  });
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
    throw "Not logged in";
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
      console.error(`Lotide Service Error: ${path}\n${e}`);
      throw e;
    });
}

export function buildHeaders(ctx: LotideContext): HeadersInit {
  return ctx.login !== undefined
    ? {
        Authorization: `Bearer ${ctx.login.token}`,
      }
    : {};
}
