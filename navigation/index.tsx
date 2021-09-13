/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import Icon from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { useContext } from "react";
import { Alert, ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import Feed from "../screens/Feed";
import TabTwoScreen from "../screens/TabTwoScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import * as LotideService from "../services/LotideService";
import LotideContext from "../store/LotideContext";
import Search from "../screens/Search";

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

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const lotideContext = useContext(LotideContext);

  return (
    <BottomTab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint as unknown as string,
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Feed"
        component={Feed}
        options={({ navigation }: RootTabScreenProps<"Feed">) => ({
          title: "Hoot",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="newspaper-outline" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                Alert.prompt(
                  "Login",
                  "Login to Hoot",
                  (value: any) =>
                    LotideService.login(
                      { apiUrl: "https://hoot.goldandblack.xyz/api/unstable" },
                      value.login,
                      value.password,
                    )
                      .then(data => {
                        console.log("index.tsx", JSON.stringify(data, null, 2));
                        lotideContext.setContext({
                          ...lotideContext.ctx,
                          login: data,
                        });
                      })
                      .catch(console.error),
                  "login-password",
                );
                navigation.navigate("Web");
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon
                name="flame-outline"
                size={25}
                color={Colors[colorScheme].tint}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Search"
        component={Search}
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="search-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="NewPost"
        component={TabTwoScreen}
        options={{
          title: "New Post",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="add-outline" color={color} size={40} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={TabTwoScreen}
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="notifications-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={TabTwoScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-circle-outline" color={color} />
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
