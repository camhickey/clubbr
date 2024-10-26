import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet } from 'react-native';

export function StartupScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();
  const {
    setClubs,
    setDisplayName,
    setEmail,
    setFriendRequestsPending,
    setFriendRequestsReceived,
    setFriends,
    setInvites,
    setParty,
    setPhotoURL,
    setUserId,
    setUsername,
  } = useProfile();

  useEffect(() => {
    const getUserDetails = async () => {
      if (user) {
        const usernameDoc = await getDoc(doc(db, 'usernames', user.uid));
        const username = usernameDoc.data()![user.uid];
        if (username) {
          const userDoc = await getDoc(doc(db, 'users', username));
          const data = userDoc.data();
          if (data) {
            setClubs(data.clubs);
            setDisplayName(data.displayName);
            setEmail(data.email);
            setFriendRequestsPending(data.friendRequestsPending);
            setFriendRequestsReceived(data.friendRequestsReceived);
            setFriends(data.friends);
            setInvites(data.invites);
            setParty(data.party);
            setPhotoURL(data.photoURL);
            setUserId(user.uid);
            setUsername(data.username);
          }
        }
      }
    };

    getUserDetails().then(() => {
      /*Need to remove this screen from the navigation stack.
        Otherwise, the user can swipe back button and return to this screen.*/
      navigation.navigate('Root');
    });
  }, [user]);

  return (
    <Container style={styles.container}>
      <Image source={require('../../assets/images/clubbr.png')} style={styles.logo} />
      <Text>Loading profile details...</Text>
      <ActivityIndicator size="large" />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});
