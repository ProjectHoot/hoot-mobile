import * as LotideService from "../services/LotideService";

export interface Origin {
  type: "post" | "comment";
  id: number;
  content_text?: string;
  content_html?: string;
  author: Profile;
}

export async function transformToFullNotification(
  ctx: LotideContext,
  notification: UserNotification,
): Promise<FullNotification> {
  const post = LotideService.getPost(ctx, notification.post.id);
  const origin = notification.comment
    ? originFromComment(ctx, notification.comment!)
    : originFromPost(await post);
  const reply = await LotideService.getReply(ctx, notification.reply.id);

  return {
    unseen: notification.unseen,
    reply: {
      id: reply.id,
      content_text: reply.content_text,
      content_html: reply.content_html,
      author: reply.author,
    },
    origin: await origin,
    post: await post,
  };
}

export async function originFromComment(
  ctx: LotideContext,
  commentId: ReplyId,
): Promise<Origin> {
  const comment = await LotideService.getReply(ctx, commentId);
  return {
    type: "comment",
    id: commentId,
    content_text: comment.content_text,
    content_html: comment.content_html,
    author: comment.author,
  };
}

export async function originFromPost(post: Post): Promise<Origin> {
  return {
    type: "post",
    id: post.id,
    content_text: post.title,
    author: post.author,
  };
}
