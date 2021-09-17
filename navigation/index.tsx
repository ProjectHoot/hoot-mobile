/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import React, { useState } from "react";
import Icon from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActionSheetIOS, ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import FeedScreen from "../screens/FeedScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NewPostScreen from "../screens/NewPostScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CommunityScreen from "../screens/CommunityScreen";
import ReplyScreen from "../screens/ReplyScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Web" component={ModalScreen} />
      <Stack.Screen name="Post" component={ModalScreen} />
      <Stack.Screen name="Reply" component={ReplyScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator({ navigation }: any) {
  const [sort, setSort] = useState<SortOption>("hot");
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="FeedScreen"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint as unknown as string,
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="FeedScreen"
        component={FeedScreen}
        initialParams={{ sort }}
        options={({ navigation }: RootTabScreenProps<"FeedScreen">) => ({
          title: "Hoot",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="newspaper-outline" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: ["Cancel", "Hot", "New"],
                    title: "Sort by:",
                    cancelButtonIndex: 0,
                  },
                  buttonIndex => {
                    const newSort = [sort, "hot", "new"][
                      buttonIndex
                    ] as SortOption;
                    setSort(newSort);
                    navigation.navigate("FeedScreen", { sort: newSort });
                  },
                );
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon
                name={
                  { hot: "flame-outline", new: "time-outline" }[sort] as any
                }
                size={25}
                color={Colors[colorScheme].tint}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="search-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="NewPostScreen"
        component={NewPostScreen}
        options={{
          title: "New Post",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="add-outline" color={color} size={40} />
          ),
        }}
      />
      <BottomTab.Screen
        name="NotificationsScreen"
        component={TabTwoScreen}
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="notifications-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-circle-outline" color={color} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.navigate("Settings");
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon
                name="cog-outline"
                size={25}
                color={Colors[colorScheme].secondaryText}
                style={{ marginLeft: 15 }}
              />
            </Pressable>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Icon>["name"];
  color: string;
  size?: number;
}) {
  return <Icon size={30} style={{ marginBottom: -3 }} {...props} />;
}
