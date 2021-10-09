import { useMemo } from "react";

/**
 * This hook will return multiple times as its answer becomes more accurate
 *
 * Much of the data needs to be fetched from third parties
 */
export default function useHrefData(href: string): HrefData {
  const hrefData = useMemo<HrefData>(() => {
    // Plain image
    if (isImageUrl(href)) {
      return { imageUrl: href };
    }

    // YouTube
    const ytRegx =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const ytMatch = href.match(ytRegx);
    if (ytMatch) {
      return {
        imageUrl: `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`,
        linkUrl: href,
        isVideo: true,
      };
    }

    // Just a link
    return { linkUrl: href };
  }, [href]);

  return hrefData;
}

function isImageUrl(url?: string): boolean {
  if (!url) return false;
  return (
    [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp"].includes(ext(url)) ||
    !!url.match(/https:\/\/.*\/api\/stable\/posts\/.*\/href/)
  );
}

function ext(url: string): string {
  return (url = url.substr(1 + url.lastIndexOf("/")).split("?")[0])
    .split("#")[0]
    .substr(url.lastIndexOf("."));
}
