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
  Modal: { postId: PostId; highlightedComments?: CommentId[] };
  Post: { postId: PostId; highlightedComments?: CommentId[] };
  NotFound: undefined;
  Web: undefined;
  Comment: {
    id: number;
    title?: string;
    html: string;
    type: "post" | "comment";
  };
  Settings: undefined;
  Register: undefined;
  Community: { community: Community };
  NewCommunity: undefined;
  EditCommunity: { community: Community };
  ForgotPassword: { node: string };

  FeedScreen: { sort: SortOption };
  SearchScreen: undefined;
  NewPostScreen: { community?: Community };
  NotificationScreen: undefined;
  ProfileScreen: undefined;
  RegisterScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<RootStackParamList, Screen>,
    BottomTabScreenProps<RootTabParamList>
  >;

export type RootTabParamList = {
  FeedScreen: { sort: SortOption };
  SearchScreen: undefined;
  NewPostScreen: { community?: Community };
  NotificationScreen: undefined;
  ProfileScreen: undefined;
  RegisterScreen: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
