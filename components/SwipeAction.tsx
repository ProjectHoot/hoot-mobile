import React, { ReactNode, useEffect, useRef, useState } from "react";
import Icon from "@expo/vector-icons/Ionicons";
import {
  ColorValue,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import * as Haptics from "../services/HapticService";

export type Glyph = keyof typeof Icon.glyphMap;

export type SwipeActionProps = {
  iconLeftSide: [Glyph, Glyph];
  iconRightSide: [Glyph, Glyph];
  colorLeftSide: ColorValue;
  colorRightSide: ColorValue;
  backgroundColor?: ColorValue;
  onLeftSide: () => void;
  onRightSide: () => void;
  onReturnToCenter?: () => void;
  children: ReactNode;
  distanceToActivate?: number;
  style?: ViewStyle;
};

export default function SwipeAction(props: SwipeActionProps) {
  if (Platform.OS !== "ios")
    return <View style={props.style}>{props.children}</View>;
  const distanceToActivate = props.distanceToActivate || 60;
  const [isScrolling, setIsScrolling] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [isLeft, setIsLeft] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);
  const dimensions = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scroll < 0 && !isLeft) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsLeft(true);
    } else if (scroll >= 0 && isLeft) {
      setIsLeft(false);
      if (!isScrolling) {
        setIsCommitted(true);
        props.onLeftSide();
      }
    }
    if (scroll >= distanceToActivate * 2 && !isRight) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsRight(true);
    } else if (scroll < distanceToActivate * 2 && isRight) {
      setIsRight(false);
      if (!isScrolling) {
        setIsCommitted(true);
        props.onRightSide();
      }
    }
    if (scroll == distanceToActivate) {
      props.onReturnToCenter?.();
      setIsRight(false);
      setIsLeft(false);
      setIsCommitted(false);
    }
  }, [scroll]);

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const scroll = event?.nativeEvent?.contentOffset?.x;
    setScroll(scroll);
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      snapToOffsets={[
        distanceToActivate,
        distanceToActivate + dimensions.width,
      ]}
      snapToStart={false}
      snapToEnd={false}
      onScrollBeginDrag={() => setIsScrolling(true)}
      onScrollEndDrag={() => {
        scrollRef.current?.scrollTo({ x: distanceToActivate });
        setIsScrolling(false);
      }}
      contentOffset={{ x: distanceToActivate, y: 0 }}
      onScroll={onScroll}
      scrollEventThrottle={100}
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: props.backgroundColor, ...props.style }}
      overScrollMode="always"
    >
      <View
        style={{
          width: distanceToActivate,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          name={props.iconLeftSide[+isLeft || +isCommitted]}
          color={props.colorLeftSide}
          size={25}
        />
      </View>
      <View style={{ width: dimensions.width }}>{props.children}</View>
      <View
        style={{
          width: distanceToActivate,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          name={props.iconRightSide[+isRight || +isCommitted]}
          color={props.colorRightSide}
          size={25}
        />
      </View>
    </ScrollView>
  );
}
