import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import useTheme from "../hooks/useTheme";
import Hoverable from "./Hoverable";

export type HoverHighlightProps = {
  style?: ViewStyle;
  hoverStyle?: ViewStyle;
};

export const HoverHighlight: React.FC<HoverHighlightProps> = props => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  const hoverStyle = props.hoverStyle || {
    backgroundColor: theme.secondaryBackground,
  };

  return (
    <Hoverable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <View style={[props.style, isHovered && hoverStyle]}>
        {props.children}
      </View>
    </Hoverable>
  );
};

export default HoverHighlight;
