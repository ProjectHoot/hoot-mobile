/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: { post: Post; highlightedReplies?: ReplyId[] };
  Post: { post: Post; highlightedReplies?: ReplyId[] };
  NotFound: undefined;
  Web: undefined;
  Reply: { id: number; title?: string; html: string; type: "post" | "reply" };
  Settings: undefined;
  Register: undefined;
  Community: { community: Community };
  NewCommunity: undefined;
  ForgotPassword: { node: string };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  FeedScreen: { sort: SortOption };
  SearchScreen: undefined;
  NewPostScreen: undefined;
  NotificationScreen: undefined;
  ProfileScreen: undefined;
  RegisterScreen: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
