import { changeProfilePicture } from '@actions/userActions';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import { ChangeDisplayNameModal } from './ChangeDisplayNameModal';
import { Clubs } from './Tabs/Clubs';
import { Friends } from './Tabs/Friends';

export function SocialScreen() {
  const { displayName, photoURL, username } = useProfile();
  const Tab = createMaterialTopTabNavigator();

  const [changeDisplayNameModalVisible, setChangeDisplayNameModalVisible] = useState(false);

  return (
    <Container>
      <View style={styles.userCard}>
        <Pressable
          onPress={() =>
            changeProfilePicture(username)
              .then((result) => {
                result &&
                  Toast.show({
                    type: 'success',
                    text1: 'Profile Picture',
                    text2: 'Your profile picture has been updated!',
                  });
              })
              .catch((error) => Toast.show({ type: 'error', text1: 'Error', text2: error }))
          }>
          <Image style={styles.pfp} source={{ uri: photoURL }} />
        </Pressable>
        <View>
          <Pressable onPress={() => setChangeDisplayNameModalVisible(true)}>
            <Text style={styles.displayName} onPress={() => setChangeDisplayNameModalVisible(true)}>
              {displayName}
            </Text>
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
      <ChangeDisplayNameModal
        isVisible={changeDisplayNameModalVisible}
        onClose={() => setChangeDisplayNameModalVisible(false)}
      />
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
  pfp: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 200,
  },
  username: {
    fontSize: 16,
    color: Colors.SUBTEXT,
  },
});
