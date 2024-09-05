import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InboxScreen } from '@screens/InboxScreen/InboxScreen';
import { IntroScreen } from '@screens/IntroScreen/IntroScreen';
import { LoginScreen } from '@screens/LoginScreen/LoginScreen';
import { ClubModal } from '@screens/MapScreen/ClubModal/ClubModal';
import { MapScreen } from '@screens/MapScreen/MapScreen';
import { InviteModal } from '@screens/PartyScreen/Modals/InviteModal';
import { PartySettingsModal } from '@screens/PartyScreen/Modals/PartySettingsModal';
import { PartyScreen } from '@screens/PartyScreen/PartyScreen';
import { RegisterScreen } from '@screens/RegisterScreen/RegisterScreen';
import { ResetPasswordScreen } from '@screens/ResetPasswordScreeen/ResetPasswordScreen';
import { SafetyModal } from '@screens/SafetyScreen/Modals/SafetyModal';
import { SafetyScreen } from '@screens/SafetyScreen/SafetyScreen';
import { AddFriendModal } from '@screens/SocialScreen/Modals/AddFriendModal';
import { SocialScreen } from '@screens/SocialScreen/SocialScreen';
import { StartupScreen } from '@screens/StartupScreen/StartupScreen';
import { UserModalScreen } from '@screens/UserModal/UserModal';
import { getAuth } from 'firebase/auth';
import * as React from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AddFriendModal as TestModal } from './AddFriendModal';
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
      <Stack.Screen name="Intro" component={IntroScreen} />
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
              onPress={() => navigation.navigate('Intro')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <AntDesign name="left" size={24} color={Colors.WHITE} />
            </Pressable>
          ),
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="ResetPassword"
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
              <FontAwesome name="angle-double-down" size={25} color="white" />
            </Pressable>
          ),
        }}>
        <Stack.Screen
          name="ClubModal"
          component={ClubModal}
          options={({ route }) => ({ title: route.params.name, id: route.params.id })}
        />
        <Stack.Screen
          name="UserModal"
          component={UserModalScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen
          name="InviteModal"
          component={InviteModal}
          options={{ title: 'Invite to Party' }}
        />
        <Stack.Screen
          name="SafetyModal"
          component={SafetyModal}
          options={{ title: 'Report an Incident' }}
        />
        <Stack.Screen
          name="AddFriendModal"
          component={AddFriendModal}
          options={{ title: 'Add Friends' }}
        />
        <Stack.Screen
          name="PartySettingsModal"
          component={PartySettingsModal}
          options={{ title: 'Party Settings' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
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
        name="Safety"
        component={SafetyScreen}
        options={({ navigation }: RootTabScreenProps<'Safety'>) => ({
          title: 'Safety',
          headerTitleStyle: {
            color: Colors.WHITE,
            fontSize: 20,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="heart" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => alert('Settings')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome name="gear" size={25} color={Colors.WHITE} style={{ marginRight: 15 }} />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Party"
        component={PartyScreen}
        options={({ navigation, route }: RootTabScreenProps<'Party'>) => ({
          title: route.params?.title ?? 'Create a Party',
          headerTitleStyle: {
            color: Colors.WHITE,
            fontSize: 20,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="group" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('PartySettingsModal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome name="gear" size={25} color={Colors.WHITE} style={{ marginRight: 15 }} />
            </Pressable>
          ),
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
              onPress={() => auth.signOut()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="remove"
                size={25}
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
                onPress={() => navigation.navigate('AddFriendModal')}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}>
                <Ionicons
                  name="person-add"
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
