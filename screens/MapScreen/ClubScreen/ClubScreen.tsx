import { Container } from '@components/Container';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db';
import Feather from '@expo/vector-icons/Feather';
import { useProfile } from '@hooks/useProfile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';

import { CommentSection } from './CommentSection';

export type ClubDetails = {
  age: number;
  name: string;
  pfp: string;
  price: number;
  description: string;
  banner: string;
  images: string[];
  tonight: string;
};

export function ClubScreen({ route }: any) {
  const { id } = route.params;
  const { ownedClubs } = useProfile();
  const navigation = useNavigation();

  const Tab = createMaterialTopTabNavigator();

  const [clubDetails, setClubDetails] = useState<ClubDetails>({
    age: 0,
    name: '',
    pfp: '',
    price: 0,
    description: '',
    banner: '',
    images: [],
    tonight: '',
  })

  useEffect(() => {
    getDoc(doc(db, 'clubs', id))
      .then((clubDoc) => {
        if (!clubDoc.exists()) return;
        const data = clubDoc.data();
        setClubDetails((prev) => ({ ...prev, ...data }));
      })
      .then(() => {
        const collectionRef = collection(db, 'clubs', id, 'info');
        getDoc(doc(collectionRef, 'page')).then((clubInfoDoc) => {
          if (!clubInfoDoc.exists()) return;
          const data = clubInfoDoc.data();
          setClubDetails((prev) => ({ ...prev, ...data }));
        });
      });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: clubDetails.name,
      headerRight: () =>
        ownedClubs.includes(id) && (
          <Feather
            onPress={() =>
              navigation.navigate('EditClubScreen', {
                id,
                clubDetails,
              })
            }
            name="edit"
            size={24}
            color={Colors.WHITE}
          />
        ),
    });
  }, [clubDetails.name]);

  return (
    <ModalContainer>
      <Image source={{ uri: clubDetails.banner }} style={styles.banner} />
      <View style={styles.header}>
        <Text style={styles.price}>{clubDetails.price === 0 ? 'NO COVER' : '$' + clubDetails.price}</Text>
        <Text style={styles.age}>{clubDetails.age}+</Text>
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
          name="Description"
          children={() => (
            <Container style={styles.tabContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text>{clubDetails.description}</Text>
              </ScrollView>
            </Container>
          )}
          options={{ tabBarLabel: 'Description' }}
        />
        <Tab.Screen
          name="Tonight"
          children={() => (
            <Container style={styles.tabContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text>{clubDetails.tonight}</Text>
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
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'stretch',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaDataContainer: {
    flexDirection: 'row',
  },
  price: {
    fontWeight: 'light',
    color: Colors.SUBTEXT,
  },
  age: {
    color: Colors.SUBTEXT,
    fontWeight: 'condensed',
  },
  tabContainer: {
    padding: 5,
  },
});
