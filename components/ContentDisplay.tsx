import React, { ReactNode, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Platform, Pressable, StyleSheet } from "react-native";
import HTMLView, { HTMLViewNode } from "react-native-htmlview";
import Icon from "@expo/vector-icons/Ionicons";
import useTheme from "../hooks/useTheme";
import { Alert } from "react-native";
import { ColorsObject } from "../constants/Colors";

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
  return (
    <HTMLView
      RootComponent={props => <Text {...props} />}
      value={html.replace(/\n/g, "")}
      renderNode={renderNode(theme)}
      stylesheet={{
        a: { color: theme.secondaryTint },
        cite: { fontStyle: "italic" },
        del: {
          textDecorationLine: "line-through",
          textDecorationStyle: "solid",
        },
        dfn: { fontStyle: "italic" },
        ins: { textDecorationLine: "underline" },
        samp: { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
        small: { fontSize: 10 },
      }}
      textComponentProps={{ style: { color: theme.text } }}
      onLinkLongPress={url => Alert.alert("Link", url)}
    />
  );
}

const renderNode =
  (theme: ColorsObject) =>
  (
    node: HTMLViewNode,
    index: number,
    siblings: HTMLViewNode,
    parent: HTMLViewNode,
    defaultRenderer: (node: HTMLViewNode, parent: HTMLViewNode) => ReactNode,
  ) => {
    if (["iframe", "script"].includes(node.name || "")) {
      return null;
    }

    function children() {
      return defaultRenderer((node as any).children, parent);
    }

    switch (node.name) {
      case "abbr":
        return (
          <Pressable
            key={index}
            onPress={() => Alert.alert("Abbr.", node.attribs.title)}
          >
            <Text
              style={{
                textDecorationLine: "underline",
                textDecorationStyle: "dotted",
              }}
            >
              {children()}
            </Text>
          </Pressable>
        );
      case "blockquote":
        return (
          <Text key={index}>
            <View style={{ padding: 10 }}>
              <View
                style={{
                  borderLeftWidth: 2,
                  borderColor: theme.secondaryText,
                  paddingLeft: 10,
                  paddingVertical: 5,
                }}
              >
                {children()}
              </View>
            </View>
            {"\n"}
          </Text>
        );
      case "details":
        return (
          <Details key={index}>{children() as React.ReactChild[]}</Details>
        );
      case "dl":
      case "dt":
      case "dd":
        return (
          <Text key={index}>
            {children()}
            {"\n"}
          </Text>
        );
      case "figure":
        return <View key={index}>{children()}</View>;
      case "hr":
        return (
          <View
            key={index}
            style={{
              width: 200,
              alignSelf: "stretch",
              borderBottomWidth: StyleSheet.hairlineWidth || 1,
              borderColor: theme.secondaryText,
            }}
          />
        );
      case "kbd":
        return (
          <Text
            key={index}
            style={{ backgroundColor: theme.tertiaryBackground }}
          >
            {" "}
            {children()}{" "}
          </Text>
        );
      case "img":
        return <Text key={index}>[Image not displayed]</Text>;
      case "li":
        return (
          <Text key={index}>
            {"\u2022 "}
            {children()}
            {"\n"}
          </Text>
        );
      case "sub":
        return (
          <Text key={index} style={{ fontSize: 10 }}>
            {children()}
          </Text>
        );
      case "summary":
        return <Text key={index}>{children()}</Text>;
      case "sup":
        return (
          <View key={index}>
            <Text style={{ fontSize: 10 }}>{children()}</Text>
          </View>
        );
      default:
        return undefined;
    }
  };

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

function Details({ children }: { children: React.ReactChild[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const [summary, ...realChildren] = children.filter(
    (x: any) => x.props.children.toString().trim() !== "",
  );

  return (
    <View>
      <Pressable hitSlop={5} onPress={() => setIsOpen(x => !x)}>
        <Text style={{ color: theme.secondaryTint }}>
          {isOpen ? (
            <Icon name="chevron-down-outline" />
          ) : (
            <Icon name="chevron-forward-outline" />
          )}
          {summary}
        </Text>
      </Pressable>
      {isOpen && realChildren}
    </View>
  );
}
