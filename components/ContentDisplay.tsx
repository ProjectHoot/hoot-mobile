import React, { ReactNode, useMemo } from "react";
import { Text } from "./Themed";
import HTMLView, { HTMLViewNode } from "react-native-htmlview";
import useTheme from "../hooks/useTheme";
import { Alert } from "react-native";

export interface ContentDisplayProps {
  contentHtml?: string;
  contentText?: string;
  contentMarkdown?: string;
}

export default function ContentDisplay(props: ContentDisplayProps) {
  const theme = useTheme();
  const html = useMemo(
    () =>
      props.contentHtml ||
      parseMarkdown(props.contentMarkdown) ||
      `<p>${props.contentText}</p>`,
    [props.contentHtml, props.contentMarkdown, props.contentText],
  );
  return useMemo(
    () => (
      <HTMLView
        value={html.replace(/\n/g, "")}
        renderNode={renderNode}
        stylesheet={{
          a: { color: theme.secondaryTint },
        }}
        textComponentProps={{ style: { color: theme.text } }}
        addLineBreaks={false}
        onLinkLongPress={url => Alert.alert("Link", url)}
      />
    ),
    [html],
  );
}

function renderNode(
  node: HTMLViewNode,
  index: number,
  siblings: HTMLViewNode,
  parent: HTMLViewNode,
  defaultRenderer: (node: HTMLViewNode, parent: HTMLViewNode) => ReactNode,
) {
  if (["iframe", "img", "hr", "script"].includes(node.name || "")) {
    return null;
  }
  if (node.name === "li") {
    return (
      <Text key={index}>
        {"\u2022 "}
        {defaultRenderer((node as any).children, parent)}
        {"\n"}
      </Text>
    );
  }
  return undefined;
}

function parseMarkdown(markdown?: string): string | undefined {
  if (markdown === "" || markdown === undefined) return undefined;
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
    .replace(/\*(.*)\*/gim, "<i>$1</i>")
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, "<br />")
    .trim();
}
