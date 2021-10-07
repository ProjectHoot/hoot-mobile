import { lotideRequest } from "./util";

export async function getReply(
  ctx: LotideContext,
  replyId: ReplyId,
): Promise<Reply[]> {
  return lotideRequest(ctx, "GET", `comments/${replyId}`, undefined, true)
    .then(data => data.json())
    .then(transformReply);
}

export async function getPostReplies(
  ctx: LotideContext,
  postId: PostId,
  page?: string,
): Promise<[Paged<ReplyId> | undefined, Reply[]]> {
  return lotideRequest(
    ctx,
    "GET",
    `posts/${postId}/replies?limit=10&include_your=true` +
      (page ? `&page=${page}` : ""),
  )
    .then(data => data.json())
    .then((replies: Paged<RawReply>) => transformReplyMulti(replies));
}

export async function getReplyReplies(
  ctx: LotideContext,
  replyId: ReplyId,
  page?: string,
): Promise<[Paged<ReplyId> | undefined, Reply[]]> {
  return lotideRequest(
    ctx,
    "GET",
    `comments/${replyId}/replies?limit=10&include_your=true&sort=hot` +
      (page ? `&page=${page}` : ""),
  ).then(data => data.json());
}

export async function replyToPost(
  ctx: LotideContext,
  postId: PostId,
  content: string,
): Promise<{ id: ReplyId }> {
  return lotideRequest(ctx, "POST", `posts/${postId}/replies`, {
    content_markdown: content,
  }).then(data => data.json());
}

export async function replyToReply(
  ctx: LotideContext,
  replyId: ReplyId,
  content: string,
): Promise<{ id: ReplyId }> {
  return lotideRequest(ctx, "POST", `comments/${replyId}/replies`, {
    content_markdown: content,
  }).then(data => data.json());
}

export async function applyReplyVote(ctx: LotideContext, replyId: ReplyId) {
  return lotideRequest(ctx, "PUT", `comments/${replyId}/your_vote`);
}

export async function removeReplyVote(ctx: LotideContext, replyId: ReplyId) {
  return lotideRequest(ctx, "DELETE", `comments/${replyId}/your_vote`);
}

type RawReply = Omit<Reply, "replies"> & { replies: Paged<RawReply> | null };

export function transformReply(reply: Readonly<RawReply>): Reply[] {
  const replies = reply.replies;

  const [childIds, childData] = transformReplyMulti(replies || undefined);

  const newReply: Reply = {
    ...reply,
    replies: childIds,
  };

  return [newReply, ...childData];
}

export function transformReplyMulti(
  replies?: Readonly<Paged<RawReply>>,
): [Paged<ReplyId> | undefined, Reply[]] {
  if (!replies) return [undefined, []];
  return [
    {
      items: replies.items.map(reply => reply.id),
      next_page: replies.next_page,
    },
    replies.items.flatMap(transformReply),
  ];
}
