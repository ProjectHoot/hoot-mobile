import { lotideRequest } from "./util";

export async function getCommunities(
  ctx: LotideContext,
  onlyFollowing: boolean = false,
  page?: string,
): Promise<Paged<Community>> {
  return lotideRequest(
    ctx,
    "GET",
    `communities?include_your=true&limit=100${
      onlyFollowing ? "&your_follow.accepted=true" : ""
    }${page ? `&page=${page}` : ""}`,
  )
    .then(data => data.json())
    .then(data => {
      return data;
    });
}

export async function getCommunity(
  ctx: LotideContext,
  communityId: CommunityId,
): Promise<Community> {
  return lotideRequest(
    ctx,
    "GET",
    `communities/${communityId}?include_your=true`,
  ).then(data => data.json());
}

export async function getUserData(ctx: LotideContext, userId: number) {
  return lotideRequest(ctx, "GET", `users/${userId}`, undefined, true).then(
    data => data.json(),
  );
}

export async function followCommunity(
  ctx: LotideContext,
  communityId: number,
): Promise<{ accepted: boolean }> {
  return lotideRequest(ctx, "POST", `communities/${communityId}/follow`, {
    try_wait_for_accept: true,
  }).then(data => data.json());
}

export async function unfollowCommunity(
  ctx: LotideContext,
  communityId: number,
) {
  return lotideRequest(ctx, "POST", `communities/${communityId}/unfollow`);
}

export async function newCommunity(
  ctx: LotideContext,
  name: string,
): Promise<{ community: { id: CommunityId } }> {
  return lotideRequest(ctx, "POST", "communities", { name }).then(data =>
    data.json(),
  );
}

export async function editCommunity(
  ctx: LotideContext,
  id: CommunityId,
  description: string,
) {
  return lotideRequest(ctx, "PATCH", `communities/${id}`, { description });
}
