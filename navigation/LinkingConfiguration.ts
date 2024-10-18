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
          Party: {
            screens: {
              PartyScreen: 'PartyScreen',
            },
          },
          Map: {
            screens: {
              MapScreen: 'MapScreen',
            },
          },
          Inbox: {
            screens: {
              InboxScreen: 'InboxScreen',
            },
          },
          Social: {
            screens: {
              SocialScreen: 'SocialScreen',
            },
          },
        },
      },
      StartupScreen: 'StartupScreen',
      InviteModal: 'InviteModal',
      ClubModal: 'ClubModal',
      UserModal: 'UserModal',
      MapHelpModal: 'MapHelpModal',
    },
  },
};

const loggedOutLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Intro: 'IntroScreen',
      Login: 'LoginScreen',
      Register: 'RegisterScreen',
      ResetPassword: 'ResetPasswordScreen',
    },
  },
};

export { loggedInLinking, loggedOutLinking };
