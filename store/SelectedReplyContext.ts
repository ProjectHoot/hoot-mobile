import React from "react";

export const defaultSelectedReplyContext: SelectedReplyContext = [
  undefined,
  () => {},
];

export const SelectedReplyContext = React.createContext<SelectedReplyContext>(
  defaultSelectedReplyContext,
);
