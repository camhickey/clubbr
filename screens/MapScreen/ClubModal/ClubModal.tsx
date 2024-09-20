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
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { CommentSection } from './CommentSection';

export function ClubModal({ route }: any) {
  const { id } = route.params;
  const { clubs, username } = useProfile();

  const Tab = createMaterialTopTabNavigator();

  const [details, setDetails] = useState({
    age: null,
    description: '',
    images: [],
    name: '',
    price: null,
    tonight: '',
    vibes: [],
  });

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    getDoc(doc(db, 'clubs', id)).then((userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data()!;
        setDetails({
          price: data.price,
          description: data.description,
          tonight: data.tonight,
          images: data.images,
          name: data.name,
          vibes: data.vibes,
          age: data.age,
        });
        console.log('club doc read from clubModal');
      }
    });
  }, []);

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
      <View style={styles.scrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {details.vibes.map((vibe: string) => (
            <View style={styles.vibe} key={vibe}>
              <Text>{vibe.charAt(0).toUpperCase() + vibe.slice(1)}</Text>
            </View>
          ))}
        </ScrollView>
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
    color: '#85bb65',
  },
  age: {
    fontWeight: 'bold',
    color: Colors.RED,
  },
  scrollContainer: {
    padding: 5,
  },
  vibe: {
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  tabContainer: {
    padding: 5,
  },
});
