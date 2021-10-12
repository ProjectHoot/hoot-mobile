import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, ImageBackground } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Text } from "./Themed";
import * as Haptics from "../services/HapticService";
import { openURL } from "expo-linking";
import useTheme from "../hooks/useTheme";
import useHrefData from "../hooks/useHrefData";

export default function HrefDisplay({ href }: { href: string }) {
  const [imgAspect, setImgAspect] = useState(1);
  const hrefData = useHrefData(href);
  const theme = useTheme();

  function openLink() {
    if (hrefData.linkUrl) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      openURL(hrefData.linkUrl);
    }
  }

  return (
    <>
      {!!hrefData.imageUrl && (
        <ImageBackground
          style={[
            styles.image,
            {
              aspectRatio: imgAspect,
              backgroundColor: theme.secondaryBackground,
            },
          ]}
          imageStyle={{
            resizeMode: "contain",
          }}
          source={{
            uri: hrefData.imageUrl,
          }}
          onLoad={event => {
            Platform.OS !== "web" &&
              setImgAspect(
                Math.max(
                  event.nativeEvent.source.width /
                    event.nativeEvent.source.height,
                  0.5,
                ),
              );
          }}
        >
          {hrefData.isVideo && (
            <Pressable onPress={openLink}>
              <Icon
                name="play-outline"
                size={70}
                color={"#fffa"}
                style={styles.playIcon}
              />
            </Pressable>
          )}
        </ImageBackground>
      )}
      {!!hrefData.linkUrl && (
        <Pressable
          style={[
            styles.link,
            !!hrefData.imageUrl && styles.wideLink,
            { backgroundColor: theme.secondaryBackground },
          ]}
          onPress={openLink}
        >
          <Text>{href}</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 15,
    ...(Platform.OS == "web" ? { cursor: "pointer" } : {}),
  },
  wideLink: {
    marginHorizontal: 0,
    borderRadius: 0,
  },
  image: {
    height: Platform.OS == "web" ? 400 : undefined,
    resizeMode: "contain",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon:
    Platform.OS == "web"
      ? {}
      : {
          shadowColor: "black",
          shadowOpacity: 1,
          shadowRadius: 5,
          shadowOffset: {
            width: 0, // These can't both be 0
            height: 3, // i.e. the shadow has to be offset in some way
          },
        },
});
