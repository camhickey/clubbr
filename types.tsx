/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface RootStackParamList {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Intro: undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  ClubModal: { name: string; id: string };
  UserModal: { user: string; title: string };
  InviteModal: undefined;
  AddFriendModal: undefined;
  MapHelpModal: undefined;
  SafetyReportModal: {
    latitude: number;
    longitude: number;
  };
  StartupScreen: undefined;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export interface RootTabParamList {
  Safety: undefined;
  Party: { title: string };
  Map: undefined;
  Inbox: undefined;
  Social: undefined;
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
