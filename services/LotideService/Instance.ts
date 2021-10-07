import { lotideRequest } from "./util";

export async function getInstanceInfo(
  ctx: LotideContext,
): Promise<InstanceInfo> {
  return lotideRequest(ctx, "GET", "instance", undefined, true)
    .then(data => data.json())
    .then(data => {
      const apiVersion = parseInt(data.software.version.split(".")[1]);
      return {
        ...data,
        apiVersion,
      };
    });
}
