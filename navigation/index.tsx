import Colors from '@constants/Colors';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useProfile } from '@hooks/useProfile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditClubScreen } from '@screens/EditClubScreen/EditClubScreen';
import { InboxScreen } from '@screens/InboxScreen/InboxScreen';
import { IntroScreen } from '@screens/IntroScreen/IntroScreen';
import { LoginScreen } from '@screens/LoginScreen/LoginScreen';
import { ClubScreen } from '@screens/MapScreen/ClubScreen/ClubScreen';
import { MapHelpScreen } from '@screens/MapScreen/MapHelpScreen/MapHelpScreen';
import { MapScreen } from '@screens/MapScreen/MapScreen';
import { InviteScreen } from '@screens/PartyScreen/InviteScreen/InviteScreen';
import { PartyScreen } from '@screens/PartyScreen/PartyScreen';
import { RegisterScreen } from '@screens/RegisterScreen/RegisterScreen';
import { ResetPasswordScreen } from '@screens/ResetPasswordScreeen/ResetPasswordScreen';
import { SocialScreen } from '@screens/SocialScreen/SocialScreen';
import { UserSettingsScreen } from '@screens/SocialScreen/UserSettingsScreen/UserSettingsScreen';
import { StartupScreen } from '@screens/StartupScreen/StartupScreen';
import { UserScreen } from '@screens/UserScreen/UserScreen';
import { getAuth } from 'firebase/auth';
import * as React from 'react';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { loggedInLinking, loggedOutLinking } from './LinkingConfiguration';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';

const auth = getAuth();

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  auth.onAuthStateChanged((user) => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <NavigationContainer linking={isLoggedIn ? loggedInLinking : loggedOutLinking}>
      {isLoggedIn ? <LoggedInNavigator /> : <LoggedOutNavigator />}
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoggedOutNavigator() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IntroScreen" component={IntroScreen} />
      <Stack.Group
        screenOptions={{
          presentation: 'card',
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.BLACK,
          },
          headerTitleStyle: {
            color: Colors.WHITE,
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate('IntroScreen')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <AntDesign name="left" size={24} color={Colors.WHITE} />
            </Pressable>
          ),
        }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: 'Make an account' }}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
          options={{ title: 'Reset Password' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function LoggedInNavigator() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartupScreen" component={StartupScreen} />
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.BLACK,
          },
          headerTitleStyle: {
            color: Colors.WHITE,
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 10,
              })}>
              <FontAwesome name="angle-double-down" size={25} color={Colors.WHITE} />
            </Pressable>
          ),
        }}>
        <Stack.Screen
          name="UserScreen"
          component={UserScreen}
          options={({ route }) => ({
            title: 'Loading...',
            user: route.params.user,
          })}
        />
        <Stack.Screen
          name="InviteScreen"
          component={InviteScreen}
          options={{ title: 'Invite to Party' }}
        />
        <Stack.Screen
          name="MapHelpScreen"
          component={MapHelpScreen}
          options={{ title: 'How to use the map' }}
        />
        <Stack.Screen
          name="UserSettingsScreen"
          component={UserSettingsScreen}
          options={{ title: 'User Settings' }}
        />
        <Stack.Screen
          name="ClubScreen"
          component={ClubScreen}
          options={({ route }) => ({
            title: 'Loading...',
            id: route.params.id,
          })}
        />
        <Stack.Screen
          name="EditClubScreen"
          component={EditClubScreen}
          options={({ route }) => ({
            title: 'Edit Club',
            id: route.params.id,
            clubDetails: route.params.clubDetails,
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const { friendRequestsReceived, invites } = useProfile();
  return (
    <BottomTab.Navigator
      initialRouteName="Map"
      screenOptions={{
        tabBarActiveTintColor: Colors.WHITE,
        tabBarInactiveTintColor: Colors.INACTIVE,
        tabBarStyle: {
          backgroundColor: Colors.BLACK,
        },
        headerStyle: {
          backgroundColor: Colors.BLACK,
        },
      }}>
      <BottomTab.Screen
        name="Party"
        component={PartyScreen}
        options={({ navigation }: RootTabScreenProps<'Party'>) => ({
          title: 'Party',
          headerTitleStyle: {
            color: Colors.WHITE,
            fontSize: 20,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, size }) => <TabBarIcon name="group" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Map"
        component={MapScreen}
        options={({ navigation }: RootTabScreenProps<'Map'>) => ({
          title: 'Map',
          headerTitleStyle: {
            color: Colors.WHITE,
            fontSize: 20,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="map" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('MapHelpScreen')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <Entypo
                name="help-with-circle"
                size={24}
                color={Colors.WHITE}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Social"
        component={SocialScreen}
        options={({ navigation }: RootTabScreenProps<'Social'>) => ({
          title: 'Social',
          headerTitleStyle: {
            color: Colors.WHITE,
            fontSize: 20,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="user" color={color} />,
          headerRight: () => (
            <>
              <Pressable
                onPress={() => navigation.navigate('UserSettingsScreen')}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}>
                <Ionicons
                  name="settings-sharp"
                  size={25}
                  color={Colors.WHITE}
                  style={{ marginRight: 15 }}
                />
              </Pressable>
            </>
          ),
        })}
      />
      <BottomTab.Screen
        name="Inbox"
        component={InboxScreen}
        options={({ navigation, route }: RootTabScreenProps<'Inbox'>) => ({
          headerTitleStyle: {
            color: Colors.WHITE,
            fontSize: 20,
            fontWeight: 'bold',
          },
          tabBarBadge: friendRequestsReceived.length + invites.length || undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.RED,
            color: Colors.WHITE,
            fontSize: 12,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="inbox" color={color} />,
        })}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
}
