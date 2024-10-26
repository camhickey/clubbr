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
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { CommentSection } from './CommentSection';

export function ClubModal({ route }: any) {
  const { id } = route.params;
  const { clubs, username } = useProfile();
  const navigation = useNavigation();

  const Tab = createMaterialTopTabNavigator();

  //Making this one object causes the state to get messed up due to the async nature of the getDocs
  const [age, setAge] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [tonight, setTonight] = useState<string>('');

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    getDoc(doc(db, 'clubs', id)).then((clubDoc) => {
      if (!clubDoc.exists()) return;
      const data = clubDoc.data();
      setAge(data.age);
      setName(data.name);
      setPrice(data.price);
    });
    const collectionRef = collection(db, 'clubs', id, 'info');
    getDoc(doc(collectionRef, 'page')).then((clubInfoDoc) => {
      if (!clubInfoDoc.exists()) return;
      const data = clubInfoDoc.data();
      setDescription(data.description);
      setTonight(data.tonight);
      setImages(data.images);
    });
  }, []);

  useEffect(() => {
    if (clubs.includes(id)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [clubs]);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);

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
            <Text style={styles.price}>{price === 0 ? 'FREE' : '$' + price}</Text>
          </View>
          <View style={styles.info}>
            <Text>Age: </Text>
            <Text style={styles.age}>{age}+</Text>
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
                <Text>{id}</Text>
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
                <Text>{tonight}</Text>
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
