/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from "react";
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
  lightColor?: ColorValue;
  darkColor?: ColorValue;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: DefaultTextInput["props"]) {
  const { style, ...otherProps } = props;
  const theme = useTheme();
  const themeStyle = {
    backgroundColor: theme.secondaryBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    color: theme.text,
  };
  return <DefaultTextInput style={[themeStyle, style]} {...otherProps} />;
}
