import { acceptRequest, cancelRequest, removeFriend, sendRequest } from '@actions/friendActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import { Toast } from '@components/Toast';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { DEFAULT_PFP } from '@constants/profile';
import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet } from 'react-native';

export function UserModalScreen({ route }: any) {
  const { user } = route.params;
  const { friends, friendRequestsPending, friendRequestsReceived, username } = useProfile();
  enum RELATIONSHIP {
    FRIENDS = 'friends',
    REQUEST_SENT = 'request sent',
    REQUEST_RECEIVED = 'request received',
    NOT_FRIENDS = 'not friends',
  }
  const [relationship, setRelationship] = useState<RELATIONSHIP>(RELATIONSHIP.NOT_FRIENDS);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastHeader, setToastHeader] = useState('');

  const [profile, setProfile] = useState({
    displayName: '',
    username: user,
    photoURL: DEFAULT_PFP,
  });

  useEffect(() => {
    getDoc(doc(db, 'users', user)).then((userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data()!;
        setProfile({
          displayName: data.displayName,
          photoURL: data.photoURL,
          username: data.username,
        });
      }
    });
  }, []);

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
                      setToastHeader('Friend Removed');
                      setToastMessage(`You have removed @${profile.username} as a friend.`);
                      setToastVisible(true);
                    })
                    .catch((error) => Alert.alert('Failed to remove friend', error.message)),
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
                setToastHeader('Friend Request Cancelled');
                setToastMessage(`You have cancelled the friend request to @${profile.username}.`);
                setToastVisible(true);
              })
              .catch((error) => Alert.alert('Failed to cancel request', error.message))
          }>
          CANCEL REQUEST
        </Button>
      )}
      {relationship === RELATIONSHIP.REQUEST_RECEIVED && (
        <Button
          onPress={() =>
            acceptRequest(username, user)
              .then(() => {
                setToastHeader('Friend Request Accepted');
                setToastMessage(`You are now friends with @${profile.username}.`);
                setToastVisible(true);
              })
              .catch((error) => Alert.alert('Failed to accept request', error.message))
          }>
          ACCEPT REQUEST
        </Button>
      )}
      {relationship === RELATIONSHIP.NOT_FRIENDS && (
        <Button
          onPress={() =>
            sendRequest(username, user)
              .then(() => {
                setToastHeader('Friend Request Sent');
                setToastMessage(`You have sent a friend request to @${profile.username}.`);
                setToastVisible(true);
              })
              .catch((error) => Alert.alert('Failed to send request', error.message))
          }>
          SEND REQUEST
        </Button>
      )}
      {toastVisible && (
        <Toast
          setToast={() => setToastVisible(false)}
          header={toastHeader}
          message={toastMessage}
          variant="success"
        />
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
