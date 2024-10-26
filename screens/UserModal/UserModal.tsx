import { acceptRequest, cancelRequest, removeFriend, sendRequest } from '@actions/friendActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { DEFAULT_PFP } from '@constants/profile';
import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

export function UserModal({ route }: any) {
  const { user } = route.params;
  const { friends, friendRequestsPending, friendRequestsReceived, username } = useProfile();
  const navigation = useNavigation();
  enum RELATIONSHIP {
    FRIENDS = 'friends',
    REQUEST_SENT = 'request sent',
    REQUEST_RECEIVED = 'request received',
    NOT_FRIENDS = 'not friends',
  }
  const [relationship, setRelationship] = useState<RELATIONSHIP>(RELATIONSHIP.NOT_FRIENDS);

  const [profile, setProfile] = useState({
    displayName: '',
    username: user,
    photoURL: DEFAULT_PFP,
  });

  useEffect(() => {
    getDoc(doc(db, 'users', user)).then((userDoc) => {
      if (!userDoc.exists()) return;
      const data = userDoc.data()!;
      setProfile({
        displayName: data.displayName,
        photoURL: data.photoURL,
        username: data.username,
      });
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: user });
  }, [user]);

  useEffect(() => {
    if (friends.includes(user)) {
      setRelationship(RELATIONSHIP.FRIENDS);
    } else if (friendRequestsPending.includes(user)) {
      setRelationship(RELATIONSHIP.REQUEST_SENT);
    } else if (friendRequestsReceived.includes(user)) {
      setRelationship(RELATIONSHIP.REQUEST_RECEIVED);
    } else {
      setRelationship(RELATIONSHIP.NOT_FRIENDS);
    }
  }, [friends, friendRequestsPending, friendRequestsReceived]);

  return (
    <ModalContainer>
      <View style={styles.profileDetails}>
        <View style={styles.userCard}>
          <Image style={styles.profilePic} source={{ uri: profile.photoURL }} />
          <View style={styles.identification}>
            <Text style={styles.displayName}>{profile.displayName}</Text>
            <Text style={styles.username}>{profile.username}</Text>
          </View>
        </View>
      </View>
      {relationship === RELATIONSHIP.FRIENDS && (
        <Button
          onPress={() =>
            Alert.alert('Remove Friend', `Are you sure you want to remove @${profile.username}?`, [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Remove Friend',
                onPress: () =>
                  removeFriend(username, user)
                    .then(() => {
                      Toast.show({
                        type: 'success',
                        text1: 'Friend Removed',
                        text2: `You have removed @${profile.username} as a friend`,
                      });
                    })
                    .catch((error) => Toast.show({ type: 'error', text1: 'Error', text2: error })),
              },
            ])
          }>
          REMOVE FRIEND
        </Button>
      )}
      {relationship === RELATIONSHIP.REQUEST_SENT && (
        <Button
          onPress={() =>
            cancelRequest(username, user)
              .then(() => {
                Toast.show({
                  type: 'success',
                  text1: 'Friend Request Cancelled',
                  text2: `You have cancelled your friend request to @${profile.username}`,
                });
              })
              .catch((error) => Toast.show({ type: 'error', text1: 'Error', text2: error }))
          }>
          CANCEL REQUEST
        </Button>
      )}
      {relationship === RELATIONSHIP.REQUEST_RECEIVED && (
        <Button
          onPress={() =>
            acceptRequest(username, user)
              .then(() => {
                Toast.show({
                  type: 'success',
                  text1: 'Friend Request Accepted',
                  text2: `You are now friends with @${profile.username}`,
                });
              })
              .catch((error) => Toast.show({ type: 'error', text1: 'Error', text2: error }))
          }>
          ACCEPT REQUEST
        </Button>
      )}
      {relationship === RELATIONSHIP.NOT_FRIENDS && (
        <Button
          onPress={() =>
            sendRequest(username, user)
              .then(() => {
                Toast.show({
                  type: 'success',
                  text1: 'Friend Request Sent',
                  text2: `You have sent a friend request to @${profile.username}`,
                });
              })
              .catch((error) => Toast.show({ type: 'error', text1: 'Error', text2: error }))
          }>
          SEND REQUEST
        </Button>
      )}
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  profileDetails: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    color: Colors.SUBTEXT,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.WHITE,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.WHITE,
  },
  identification: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
