import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { DEFAULT_PFP } from '@constants/profile';
import { db } from '@db';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { ReactElement, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

interface Action {
  icon: ReactElement;
  onPress: () => void;
}

interface ClubCardProps {
  id: string;
  actions?: Action[];
}

export function ClubCard({ id, actions }: ClubCardProps) {
  const navigation = useNavigation();
  const [club, setClub] = useState({
    name: 'Loading...',
    photoURL: DEFAULT_PFP,
  });

  useEffect(() => {
    getDoc(doc(db, 'clubs', id)).then((clubDoc) => {
      if (!clubDoc.exists()) {
        console.error('Club does not exist');
        console.error(id);
        return;
      }
      const data = clubDoc.data();
      setClub({
        name: data.name,
        photoURL: '',
      });
    });
  }, []);

  return (
    <Container style={styles.container}>
      <Pressable
        onPress={() => {
          navigation.navigate('ClubModal', { id });
        }}
        style={styles.container}>
        <Image source={{ uri: club.photoURL }} style={styles.profilePic} />
        <Text style={styles.displayName}>{club.name}</Text>
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
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
