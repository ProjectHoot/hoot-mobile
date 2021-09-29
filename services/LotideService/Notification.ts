import { lotideRequest } from "./util";

export async function getNotifications(
  ctx: LotideContext,
): Promise<UserNotification[]> {
  return lotideRequest(ctx, "GET", "users/~me/notifications").then(data =>
    data.json(),
  );
}
