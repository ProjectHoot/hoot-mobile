/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import React, { useState } from "react";
import Icon from "@expo/vector-icons/Ionicons";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
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
import CommunityScreen from "../screens/CommunityScreen";
import ReplyScreen from "../screens/ReplyScreen";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import NotificationScreen from "../screens/NotificationScreen";
import NewCommunityScreen from "../screens/NewCommunity";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import EditCommunityScreen from "../screens/EditCommunityScreen";
import { useLotideCtx } from "../hooks/useLotideCtx";

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
      <Stack.Screen name="NewCommunity" component={NewCommunityScreen} />
      <Stack.Screen name="EditCommunity" component={EditCommunityScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot Password" }}
      />
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
const BottomTab = createDrawerNavigator<RootTabParamList>();

function BottomTabNavigator({ navigation }: any) {
  const [sort, setSort] = useState<SortOption>("hot");
  const ctx = useLotideCtx();
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="FeedScreen"
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme].tint as unknown as string,
        headerTintColor: Colors[colorScheme].text as unknown as string,
        headerPressColor: Colors[colorScheme].text as unknown as string,
        drawerType: "permanent",
        drawerHideStatusBarOnOpen: true,
      }}
    >
      <BottomTab.Screen
        name="FeedScreen"
        component={FeedScreen}
        initialParams={{ sort }}
        options={({ navigation }: RootTabScreenProps<"FeedScreen">) => ({
          title: "Hoot",
          drawerIcon: ({ color }) => (
            <TabBarIcon name="newspaper-outline" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                const sortSwitch: { [key: string]: SortOption } = {
                  top: "hot",
                  hot: "new",
                  new: (ctx?.apiVersion || 0) < 10 ? "hot" : "top",
                };
                const newSort: SortOption = sortSwitch[sort];
                setSort(newSort);
                navigation.navigate("FeedScreen", { sort: newSort });
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon
                name={
                  {
                    hot: "flame-outline",
                    new: "time-outline",
                    top: "arrow-up-outline",
                  }[sort] as any
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
          title: "Communities",
          drawerIcon: ({ color }) => (
            <TabBarIcon name="search-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="NewPostScreen"
        component={NewPostScreen}
        initialParams={{ community: undefined }}
        options={{
          title: "New Post",
          drawerIcon: ({ color }) => (
            <TabBarIcon name="add-outline" color={color} size={40} />
          ),
        }}
      />
      <BottomTab.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          title: "Notifications",
          drawerIcon: ({ color }) => (
            <TabBarIcon name="notifications-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Profile",
          drawerIcon: ({ color }) => (
            <TabBarIcon name="person-circle-outline" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                navigation.navigate("Settings");
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon
                name="settings-outline"
                size={25}
                color={Colors[colorScheme].secondaryText}
                style={{ marginRight: 15 }}
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
