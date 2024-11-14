import { followClub, unfollowClub } from '@actions/clubActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useProfile } from '@hooks/useProfile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';

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
  const { clubId } = route.params;
  const { ownedClubs, username, clubs } = useProfile();
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
  });

  useEffect(() => {
    getDoc(doc(db, 'clubs', clubId))
      .then((clubDoc) => {
        if (!clubDoc.exists()) return;
        const data = clubDoc.data();
        setClubDetails((prev) => ({ ...prev, ...data }));
      })
      .then(() => {
        const collectionRef = collection(db, 'clubs', clubId, 'info');
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
      headerRight: () => (
        ownedClubs.includes(clubId) && (
        <Feather
          onPress={() =>
            navigation.navigate('EditClubScreen', {
              clubId,
              clubDetails,
            })
          }
          name="edit"
          size={24}
          color={Colors.WHITE}
        />
      )
      ),
    });
  }, [clubDetails.name]);

  return (
    <ModalContainer>
      <Image source={{ uri: clubDetails.banner }} style={styles.banner} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.WHITE,
          tabBarInactiveTintColor: Colors.INACTIVE,
          tabBarIndicatorStyle: { backgroundColor: Colors.WHITE },
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: Colors.BLACK },
          tabBarAllowFontScaling: true,
        }}>
        <Tab.Screen
          name="Description"
          children={() => (
            <View>
              <View style={styles.infoContainer}>
                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Cover: </Text>
                  <Text style={styles.infoValue}>
                    {clubDetails.price === 0 ? 'FREE' : '$' + clubDetails.price}
                  </Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Age: </Text>
                  <Text style={styles.infoValue}>
                    {clubDetails.age === 0 ? 'NONE' : clubDetails.age + '+'}
                  </Text>
                </View>
              </View>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text>{clubDetails.description}</Text>
              </ScrollView>
            </View>
          )}
          options={{ tabBarLabel: 'Description' }}
        />
        <Tab.Screen
          name="Tonight"
          children={() => (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <Text>{clubDetails.tonight}</Text>
            </ScrollView>
          )}
          options={{ tabBarLabel: 'Tonight' }}
        />
        <Tab.Screen
          name="Images"
          children={() => (
            <ScrollView
              style={{ backgroundColor: Colors.BLACK }}
              showsVerticalScrollIndicator={false}>
              <View style={styles.imageContainer}>
                {clubDetails.images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.images} />
                ))}
              </View>
            </ScrollView>
          )}
          options={{ tabBarLabel: 'Images' }}
        />
      </Tab.Navigator>
      <View style={styles.controlsContainer}>
        <Button
          titleStyle={{ fontSize: 12 }}
          onPress={() =>
            clubs.includes(clubId) ? unfollowClub(username, clubId) : followClub(username, clubId)
          }>
          {clubs.includes(clubId) ? 'UNFOLLOW' : 'FOLLOW'}
        </Button>
        <Pressable
          style={styles.control}
          onPress={() => navigation.navigate('CommentScreen', { clubId })}>
          <FontAwesome5 name="comment" size={24} color="white" />
        </Pressable>
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'stretch',
  },
  scrollView: {
    backgroundColor: Colors.BLACK,
    padding: 5,
    height: '100%',
  },
  tabContainer: {
    padding: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.SUBTEXT,
  },
  infoValue: {
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  images: {
    width: '50%',
    height: 200,
    resizeMode: 'stretch',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
  },
});
