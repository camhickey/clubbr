import { acceptRequest, cancelRequest, removeFriend, sendRequest } from '@actions/friendActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
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
  const [relationship, setRelationship] = useState<
    'friends' | 'request sent' | 'request received' | 'not friends'
  >('not friends');

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
        console.log('user doc read from userModal');
      }
    });
  }, []);

  useEffect(() => {
    if (friends.includes(user)) {
      setRelationship('friends');
    } else if (friendRequestsPending.includes(user)) {
      setRelationship('request sent');
    } else if (friendRequestsReceived.includes(user)) {
      setRelationship('request received');
    } else {
      setRelationship('not friends');
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
      {relationship === 'friends' && (
        <Button
          onPress={() =>
            Alert.alert('Are you sure you want to remove this friend?', '', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Remove Friend',
                onPress: () => removeFriend(username, user),
              },
            ])
          }>
          REMOVE FRIEND
        </Button>
      )}
      {relationship === 'request sent' && (
        <Button onPress={() => cancelRequest(username, user)}>CANCEL REQUEST</Button>
      )}
      {relationship === 'request received' && (
        <Button onPress={() => acceptRequest(username, user)}>ACCEPT REQUEST</Button>
      )}
      {relationship === 'not friends' && (
        <Button
          onPress={() =>
            sendRequest(username, user).then(() => Alert.alert('Friend request sent!'))
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
