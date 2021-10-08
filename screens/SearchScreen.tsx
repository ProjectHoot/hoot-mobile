import React, { useEffect, useState } from "react";
import { RootTabScreenProps } from "../types";
import SuggestLogin from "../components/SuggestLogin";
import CommunityFinder from "../components/CommunityFinder";
import { useLotideCtx } from "../hooks/useLotideCtx";

export default function SearchScreen({
  navigation,
}: RootTabScreenProps<"SearchScreen">) {
  const [focusId, setFocusId] = useState(0);
  const ctx = useLotideCtx();

  useEffect(
    () => navigation.addListener("focus", () => setFocusId(x => x + 1)),
    [],
  );

  if (!ctx?.login) return <SuggestLogin />;

  return (
    <CommunityFinder
      onSelect={community => navigation.navigate("Community", { community })}
      focusId={focusId}
    />
  );
}
