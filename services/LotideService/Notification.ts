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
    commentId: notification.comment.id,
    origin: notification.comment
      ? { type: "comment", id: notification.comment.id }
      : { type: "post", id: notification.post.id },
    postId: notification.post.id,
  };
}
