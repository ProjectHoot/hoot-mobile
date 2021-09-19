import { useState, useEffect, useContext } from "react";
import LotideContext from "../store/LotideContext";
import * as LotideService from "../services/LotideService";
import { useRefreshableData } from "./useRefreshableData";

export function usePosts(
  sort?: SortOption,
  inYourFollows?: boolean,
  community?: CommunityId,
): [Post[], boolean, () => void, () => void] {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState<string | null | undefined>(
    undefined,
  );
  const [reloadId, setReloadId] = useState(0);
  const ctx = useContext(LotideContext).ctx;

  const [isLoading, refresh] = useRefreshableData(
    stopLoading => {
      if (!ctx.login) return;
      if (loadingPage !== undefined) return;
      setLoadingPage(page);
      LotideService.getPosts(ctx, page, sort, inYourFollows, community)
        .then(data => {
          setPosts(p => [...p, ...data.items]);
          setNextPage(data.next_page);
          setLoadingPage(undefined);
        })
        .then(() => stopLoading())
        .catch(e => {
          console.error("hey im getpost", e);
          setPosts(p => [
            ...p,
            {
              id: -1,
              title: "Lotide error",
              content_html: `<p>Error: ${e}</p>`,
              created: "",
              replies_count_total: 0,
              score: 0,
              sticky: true,
              author: {
                id: -1,
                username: "Failure",
                local: false,
                host: "hoot-mobile",
              },
              community: {
                id: -1,
                name: "something-went-wrong",
                local: false,
                host: "hoot-mobile",
              },
            },
          ]);
        });
    },
    [reloadId, page],
  );

  useEffect(() => {
    setPosts([]);
    setPage(null);
    setNextPage(null);
    refresh();
  }, [ctx, sort]);

  function loadNextPage() {
    if (nextPage !== null) {
      setPage(nextPage);
    }
  }

  function refreshData() {
    setPosts([]);
    setPage(null);
    setNextPage(null);
    setReloadId(id => id + 1);
    refresh();
  }

  return [posts, isLoading, refreshData, loadNextPage];
}

export function useReplies(
  ctx: LotideContext,
  postId: PostId,
  deps: any[],
): Paged<Reply> {
  const [replies, setReplies] = useState({
    items: [] as Reply[],
  } as Paged<Reply>);
  useEffect(() => {
    LotideService.getPostReplies(ctx, postId).then(data => {
      setReplies(data);
    });
  }, deps);
  return replies;
}
