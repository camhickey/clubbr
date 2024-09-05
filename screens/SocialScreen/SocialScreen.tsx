import { changeProfilePicture, changeDisplayName } from '@actions/userActions';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet, Image, Pressable, Alert } from 'react-native';

import { Clubs } from './Tabs/Clubs';
import { Friends } from './Tabs/Friends';

export function SocialScreen() {
  const { displayName, photoURL, username } = useProfile();
  const Tab = createMaterialTopTabNavigator();

  return (
    <Container>
      <View style={styles.userCard}>
        <Pressable onPress={() => changeProfilePicture(username)}>
          <Image style={styles.profilePic} source={{ uri: photoURL }} />
        </Pressable>
        <View>
          <Pressable
            onPress={() =>
              Alert.prompt('Change Display Name', 'Enter your new display name', (text) =>
                changeDisplayName(username, text),
              )
            }>
            <Text style={styles.displayName}>{displayName}</Text>
          </Pressable>
          <Text style={styles.username}>{username}</Text>
        </View>
      </View>
      <Tab.Navigator
        initialRouteName="Friends"
        screenOptions={{
          tabBarActiveTintColor: Colors.WHITE,
          tabBarInactiveTintColor: Colors.INACTIVE,
          tabBarIndicatorStyle: { backgroundColor: Colors.WHITE },
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: Colors.BLACK },
        }}>
        <Tab.Screen name="Invites" component={Friends} options={{ tabBarLabel: 'Friends' }} />
        <Tab.Screen name="Clubs" component={Clubs} options={{ tabBarLabel: 'Clubs' }} />
      </Tab.Navigator>
    </Container>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: Colors.SUBTEXT,
  },
});
