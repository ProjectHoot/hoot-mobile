import { lotideRequest } from "./util";

export async function getNotifications(
  ctx: LotideContext,
): Promise<FullNotification[]> {
  return lotideRequest(ctx, "GET", "users/~me/notifications")
    .then(data => data.json())
    .then((data: UserNotification[]) =>
      data.map(x => transformToFullNotification(x)),
    );
}

export function transformToFullNotification(
  notification: UserNotification,
): FullNotification {
  return {
    unseen: notification.unseen,
    replyId: notification.reply.id,
    origin: notification.comment
      ? { type: "reply", id: notification.comment! }
      : { type: "post", id: notification.post.id },
    postId: notification.post.id,
  };
}
