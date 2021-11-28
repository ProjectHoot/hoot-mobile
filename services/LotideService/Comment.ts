import { lotideRequest } from "./util";

export async function getComment(
  ctx: LotideContext,
  commentId: CommentId,
): Promise<Comment[]> {
  return lotideRequest(ctx, "GET", `comments/${commentId}`, undefined, true)
    .then(data => data.json())
    .then(transformComment);
}

export async function getRawComment(
  ctx: LotideContext,
  commentId: CommentId,
): Promise<RawComment> {
  return lotideRequest(
    ctx,
    "GET",
    `comments/${commentId}`,
    undefined,
    true,
  ).then(data => data.json());
}

export async function getPostComments(
  ctx: LotideContext,
  postId: PostId,
  page?: string,
): Promise<[Paged<CommentId> | undefined, Comment[]]> {
  return lotideRequest(
    ctx,
    "GET",
    `posts/${postId}/replies?limit=10&include_your=true` +
      (page ? `&page=${page}` : ""),
  )
    .then(data => data.json())
    .then(transformCommentMulti);
}

export async function getCommentComments(
  ctx: LotideContext,
  commentId: CommentId,
  page?: string,
): Promise<[Paged<CommentId> | undefined, Comment[]]> {
  return lotideRequest(
    ctx,
    "GET",
    `comments/${commentId}/replies?limit=10&include_your=true&sort=hot` +
      (page ? `&page=${page}` : ""),
  )
    .then(data => data.json())
    .then(transformCommentMulti);
}

export async function commentOnPost(
  ctx: LotideContext,
  postId: PostId,
  content: string,
): Promise<{ id: CommentId }> {
  return lotideRequest(ctx, "POST", `posts/${postId}/replies`, {
    content_markdown: content,
  }).then(data => data.json());
}

export async function commentOnComment(
  ctx: LotideContext,
  commentId: CommentId,
  content: string,
): Promise<CommentId> {
  return lotideRequest(ctx, "POST", `comments/${commentId}/replies`, {
    content_markdown: content,
  })
    .then(data => data.json())
    .then(data => data.id);
}

export async function applyCommentVote(
  ctx: LotideContext,
  commentId: CommentId,
) {
  return lotideRequest(ctx, "PUT", `comments/${commentId}/your_vote`);
}

export async function removeCommentVote(
  ctx: LotideContext,
  commentId: CommentId,
) {
  return lotideRequest(ctx, "DELETE", `comments/${commentId}/your_vote`);
}

type RawComment = Omit<Omit<Comment, "replies">, "your_vote"> & {
  replies: Paged<RawComment> | null;
  your_vote?: {} | null;
};

export function transformComment(comment: Readonly<RawComment>): Comment[] {
  const comments = comment.replies;

  const [childIds, childData] = transformCommentMulti(comments || undefined);

  const newComment: Comment = {
    ...comment,
    replies: childIds,
    your_vote: comment.your_vote !== null && comment.your_vote !== undefined,
  };

  return [newComment, ...childData];
}

export function transformCommentMulti(
  comments?: Readonly<Paged<RawComment>>,
): [Paged<CommentId> | undefined, Comment[]] {
  if (!comments) return [undefined, []];
  return [
    {
      items: comments.items.map(reply => reply.id),
      next_page: comments.next_page,
    },
    comments.items.flatMap(transformComment),
  ];
}
