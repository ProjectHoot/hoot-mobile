/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import React, { forwardRef } from "react";
import {
  ColorValue,
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import useTheme from "../hooks/useTheme";

export function useThemeColor(
  props: { light?: ColorValue; dark?: ColorValue },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
): ColorValue {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  secondary?: boolean;
  tint?: boolean;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, secondary, tint, ...otherProps } = props;
  const theme = useTheme();
  const color =
    !secondary && !tint
      ? theme.text
      : secondary && !tint
      ? theme.secondaryText
      : tint && !secondary
      ? theme.tint
      : theme.secondaryTint;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useTheme().background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const TextInput = forwardRef<
  DefaultTextInput,
  DefaultTextInput["props"]
>((props: DefaultTextInput["props"], ref) => {
  const { style, placeholderTextColor, ...otherProps } = props;
  const theme = useTheme();

  const themeStyle = {
    backgroundColor: theme.secondaryBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    color: theme.text,
  };
  return (
    <DefaultTextInput
      ref={ref}
      style={[themeStyle, style]}
      placeholderTextColor={placeholderTextColor || theme.placeholderText}
      {...otherProps}
    />
  );
});
