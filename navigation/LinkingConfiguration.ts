/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const loggedInLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Safety: {
            screens: {
              SafetyScreen: 'safety',
            },
          },
          Party: {
            screens: {
              PartyScreen: 'party',
            },
          },
          Map: {
            screens: {
              MapScreen: 'map',
            },
          },
          Inbox: {
            screens: {
              InboxScreen: 'inbox',
            },
          },
          Social: {
            screens: {
              SocialScreen: 'social',
            },
          },
        },
      },
      StartupScreen: 'startupScreen',
      InviteModal: 'inviteModal',
      ClubModal: 'clubModal',
      UserModal: 'userModal',
      SafetyModal: 'safetyModal',
      AddFriendModal: 'addFriendModal',
      PartySettingsModal: 'partySettingsModal',
    },
  },
};

const loggedOutLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Intro: 'intro',
      Login: 'login',
      Register: 'register',
      ResetPassword: 'resetPassword',
    },
  },
};

export { loggedInLinking, loggedOutLinking };
