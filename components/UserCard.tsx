import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { DEFAULT_PFP } from '@constants/profile';
import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { ReactElement, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

interface Action {
  icon: ReactElement;
  onPress: () => void;
}

interface UserCardProps {
  user: string;
  actions?: Action[];
  blurb?: string;
}

export function UserCard({ user, actions, blurb }: UserCardProps) {
  const navigation = useNavigation();
  const { username } = useProfile();
  const [searchedUser, setSearchedUser] = useState({
    displayName: 'Loading...',
    photoURL: DEFAULT_PFP,
    username: 'Loading...',
  });

  useEffect(() => {
    getDoc(doc(db, 'users', user)).then((userDoc) => {
      if (!userDoc.exists()) return;
      const data = userDoc.data()!;
      setSearchedUser({
        displayName: data.displayName,
        photoURL: data.photoURL,
        username: data.username,
      });
    });
  }, []);

  return (
    <Container style={styles.container}>
      <Pressable
        onPress={() => {
          user === username
            ? navigation.navigate('Root', { screen: 'Social' })
            : navigation.navigate('UserModal', { user, title: user });
        }}
        style={styles.container}>
        <Image source={{ uri: searchedUser.photoURL }} style={styles.profilePic} />
        <View style={styles.identification}>
          <Text style={styles.displayName}>{searchedUser.displayName}</Text>
          <Text style={styles.subText}>
            {searchedUser.username} {blurb}
          </Text>
        </View>
      </Pressable>
      <View style={styles.actions}>
        {actions?.map((action, key) => {
          return (
            <Pressable onPress={action.onPress} key={key}>
              {action.icon}
            </Pressable>
          );
        })}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  identification: {
    flexDirection: 'column',
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 12,
    color: Colors.SUBTEXT,
    //maxWidth: 200,
  },
});
