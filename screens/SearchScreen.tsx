import React, { useContext } from "react";
import LotideContext from "../store/LotideContext";
import { RootTabScreenProps } from "../types";
import SuggestLogin from "../components/SuggestLogin";
import CommunityFinder from "../components/CommunityFinder";

export default function SearchScreen({
  navigation,
}: RootTabScreenProps<"SearchScreen">) {
  const ctx = useContext(LotideContext).ctx;

  if (!ctx.login) return <SuggestLogin />;

  return (
    <CommunityFinder
      onSelect={community => navigation.navigate("Community", { community })}
    />
  );
}
