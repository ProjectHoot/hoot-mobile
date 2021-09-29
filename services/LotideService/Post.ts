import { lotideRequest } from "./util";

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

export async function applyVote(ctx: LotideContext, postId: number) {
  return lotideRequest(ctx, "PUT", `posts/${postId}/your_vote`);
}

export async function removeVote(ctx: LotideContext, postId: number) {
  return lotideRequest(ctx, "DELETE", `posts/${postId}/your_vote`);
}
