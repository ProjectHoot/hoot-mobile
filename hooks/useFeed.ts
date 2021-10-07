import { useEffect, useState } from "react";
import { useLotideCtx } from "./useLotideCtx";
import * as LotideService from "../services/LotideService";
import { useDispatch } from "react-redux";
import { setPostMulti } from "../slices/postSlice";

export type UseFeedParams = {
  sort?: SortOption;
  inYourFollows?: boolean;
  communityId?: CommunityId;
};

export default function useFeed(
  params: UseFeedParams,
): [PostId[], () => void, () => void] {
  const dispatch = useDispatch();
  const ctx = useLotideCtx();
  const [postIds, setPostIds] = useState<PostId[]>([]);
  const [page, setPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [resetId, setResetId] = useState(0);

  useEffect(() => {
    if (!ctx) return;
    LotideService.getPosts(
      ctx,
      page,
      params.sort,
      params.inYourFollows,
      params.communityId,
    ).then(posts => {
      dispatch(setPostMulti({ posts: posts.items }));
      setPostIds(ids => [...ids, ...posts.items.map(p => p.id)]);
      setNextPage(posts.next_page);
    });
  }, [page, resetId]);

  function loadNextPage() {
    setPage(nextPage);
    setNextPage(null);
  }

  function reset() {
    setPostIds([]);
    setPage(null);
    setNextPage(null);
    setResetId(x => x + 1);
  }

  return [postIds, loadNextPage, reset];
}
