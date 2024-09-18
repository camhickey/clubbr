import { changeDisplayName, changeProfilePicture } from '@actions/userActions';
import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { Toast } from '@components/Toast';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { Alert, Image, Keyboard, Pressable, StyleSheet, TextInput } from 'react-native';

import { Clubs } from './Tabs/Clubs';
import { Friends } from './Tabs/Friends';

export function SocialScreen() {
  const { displayName, photoURL, username } = useProfile();
  const Tab = createMaterialTopTabNavigator();

  const [changeDisplayNameModalVisible, setChangeDisplayNameModalVisible] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [changeDisplayNameToastVisible, setChangeDisplayNameToastVisible] = useState(false);

  const [changeProfilePictureToastVisible, setChangeProfilePictureToastVisible] = useState(false);

  return (
    <Container>
      <View style={styles.userCard}>
        <Pressable
          onPress={() =>
            changeProfilePicture(username)
              .then((result) => {
                if (result) setChangeProfilePictureToastVisible(true);
              })
              .catch(() => Alert.alert('Error', 'Failed to change profile picture.'))
          }>
          <Image style={styles.profilePic} source={{ uri: photoURL }} />
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
      {changeDisplayNameModalVisible && (
        <CustomAlert visible={changeDisplayNameModalVisible}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.header}>Change Display Name</Text>
            {/*Enforce regex*/}
            <TextInput
              style={modalStyles.input}
              placeholder="Enter your new display name..."
              placeholderTextColor={Colors.SUBTEXT}
              onChangeText={setNewDisplayName}
              value={newDisplayName}
              autoCapitalize="none"
              multiline
              blurOnSubmit
              maxLength={15}
            />
            <View style={modalStyles.buttonGroup}>
              <Button
                onPress={() => {
                  setChangeDisplayNameModalVisible(false);
                  setNewDisplayName('');
                }}>
                CANCEL
              </Button>
              <Button
                disabled={!newDisplayName}
                onPress={() => {
                  Keyboard.dismiss();
                  changeDisplayName(username, newDisplayName)
                    .then(() => {
                      setChangeDisplayNameModalVisible(false);
                      setChangeDisplayNameToastVisible(true);
                      setNewDisplayName('');
                    })
                    .catch(() => Alert.alert('Error', 'Failed to change display name.'));
                }}>
                SAVE
              </Button>
            </View>
          </View>
        </CustomAlert>
      )}
      {changeDisplayNameToastVisible && (
        <Toast
          setToast={setChangeDisplayNameToastVisible}
          variant="success"
          header="Display Name"
          message="Your display name has been updated!"
        />
      )}
      {changeProfilePictureToastVisible && (
        <Toast
          setToast={setChangeProfilePictureToastVisible}
          variant="success"
          header="Profile Picture"
          message="Your profile picture has been updated!"
        />
      )}
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
    width: 200,
  },
  username: {
    fontSize: 16,
    color: Colors.SUBTEXT,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: Colors.WHITE,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
