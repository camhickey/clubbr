import { followClub, unfollowClub } from '@actions/clubActions';
import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { CommentSection } from './CommentSection';

type ClubDetails = {
  age: number;
  description: string;
  images: string[];
  name: string;
  price: number;
  tonight: string;
};

export function ClubModal({ route }: any) {
  const { id, age, price, title } = route.params;
  const { clubs, username } = useProfile();

  const Tab = createMaterialTopTabNavigator();

  const [details, setDetails] = useState<ClubDetails>({
    age,
    description: '',
    images: [],
    name: title,
    price,
    tonight: '',
  });

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const collectionRef = collection(db, 'clubs', id, 'info');
  useEffect(() => {
    getDoc(doc(collectionRef, 'page')).then((clubInfoDoc) => {
      if (!clubInfoDoc.exists()) return;
      const data = clubInfoDoc.data();
      setDetails({
        ...details,
        description: data.description,
        images: data.images,
        tonight: data.tonight,
      });
    });
  });

  useEffect(() => {
    if (clubs.includes(id)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [clubs]);

  return (
    <ModalContainer>
      <View style={styles.header}>
        {isFollowing ? (
          <Button titleStyle={{ fontSize: 10 }} onPress={() => unfollowClub(username, id)}>
            UNFOLLOW
          </Button>
        ) : (
          <Button titleStyle={{ fontSize: 10 }} onPress={() => followClub(username, id)}>
            FOLLOW
          </Button>
        )}
        <View style={styles.infoContainer}>
          <View style={styles.info}>
            <Text>Cover: </Text>
            <Text style={styles.price}>{details.price === 0 ? 'FREE' : '$' + details.price}</Text>
          </View>
          <View style={styles.info}>
            <Text>Age: </Text>
            <Text style={styles.age}>{details.age}+</Text>
          </View>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.WHITE,
          tabBarInactiveTintColor: Colors.INACTIVE,
          tabBarIndicatorStyle: { backgroundColor: Colors.WHITE },
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: Colors.BLACK },
        }}>
        <Tab.Screen
          name="Info"
          children={() => (
            <Container style={styles.tabContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text>{details.description}</Text>
              </ScrollView>
            </Container>
          )}
          options={{ tabBarLabel: 'Info' }}
        />
        <Tab.Screen
          name="Tonight"
          children={() => (
            <Container style={styles.tabContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text>{details.tonight}</Text>
              </ScrollView>
            </Container>
          )}
          options={{ tabBarLabel: 'Tonight' }}
        />
        <Tab.Screen
          name="Comments"
          children={() => (
            <Container style={styles.tabContainer}>
              <CommentSection clubId={id} />
            </Container>
          )}
          options={{ tabBarLabel: 'Comments' }}
        />
      </Tab.Navigator>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  price: {
    fontWeight: 'bold',
    color: Colors.GREEN,
  },
  age: {
    fontWeight: 'bold',
    color: Colors.RED,
  },
  tabContainer: {
    padding: 5,
  },
});
