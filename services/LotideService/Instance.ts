import { lotideRequest } from "./util";

export async function getInstanceInfo(
  ctx: LotideContext,
): Promise<InstanceInfo> {
  return lotideRequest(ctx, "GET", "instance", undefined, true).then(data =>
    data.json(),
  );
}
