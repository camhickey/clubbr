import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db*';
import { FontAwesome } from '@expo/vector-icons';
import { useParty } from '@hooks/useParty';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Toast from 'react-native-toast-message';

import { ActionButton } from './ActionButton';
import { PartyListener } from './Listeners/PartyListener';
import { ProfileListener } from './Listeners/ProfileListener';
import { MakeSafetyReportModal } from './MakeSafetyReportModal';
import { MapStyle } from './MapStyle';
import { ShowSafetyReportModal } from './ShowSafetyReportModal';

const GAINESVILLE = {
  latitude: 29.6436,
  longitude: -82.3549,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export type SafetyMarker = {
  id: string;
  location: { latitude: number; longitude: number };
};

export type ClubMarker = {
  id: string;
  name: string;
  location: { latitude: number; longitude: number };
  age: number;
  price: number;
  pfp: string;
};

export function MapScreen() {
  const [clubView, setClubView] = useState(true);
  const [filterView, setFilterView] = useState(false);
  const [safetyView, setSafetyView] = useState(false);
  const [partyView, setPartyView] = useState(false);

  const { partyMembers } = useParty();
  const { party } = useProfile();
  const navigation = useNavigation();

  //make a hash map of all the clubs
  const [clubMarkers, setClubMarkers] = useState<ClubMarker[]>([]);
  const [filteredClubMarkers, setFilteredClubMarkers] = useState<ClubMarker[]>([]);
  const [safetyMarkers, setSafetyMarkers] = useState<SafetyMarker[]>([]);

  const [makeSafetyReportModalVisible, setMakeSafetyReportModalVisible] = useState(false);
  const [safetyReportLocation, setSafetyReportLocation] = useState({ latitude: 0, longitude: 0 });

  const [showSafetyReportModalVisible, setShowSafetyReportModalVisible] = useState(false);
  const [safetyReportId, setSafetyReportId] = useState('');

  //Get safety markers
  /*useEffect(() => {
    setSafetyMarkers([]);
    const q = query(collection(db, 'safety'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        setSafetyMarkers((prev) => [
          ...prev,
          {
            id: doc.id,
            location: doc.data().location,
          },
        ]);
      });
    });
    return () => unsubscribe();
  }, []);*/

  //Get club markers
  useEffect(() => {
    const q = query(collection(db, 'clubs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      //super hacky fix for rn
      setClubMarkers([]);
      snapshot.docs.map((doc) => {
        setClubMarkers((prev) => [
          ...prev,
          {
            id: doc.id,
            name: doc.data().name,
            location: doc.data().location,
            age: doc.data().age,
            price: doc.data().price,
            pfp: doc.data().pfp,
          },
        ]);
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    party === '' && setPartyView(false);
  }, [party]);

  return (
    <Container>
      <ProfileListener />
      <PartyListener />
      <MapView
        initialRegion={GAINESVILLE}
        provider={PROVIDER_DEFAULT}
        style={styles.mainMap}
        customMapStyle={Platform.OS !== 'ios' ? MapStyle : []}
        showsPointsOfInterest={Platform.OS !== 'ios'}
        tracksViewChanges={false}
        toolbarEnabled={false}
        //iOS is weirdly unresponsive with user location marker
        //showsUserLocation={Platform.OS !== 'ios'}
        followsUserLocation
        tintColor={Colors.BLACK}
        clusterColor={Colors.WHITE}
        clusterTextColor={Colors.BLACK}
        onLongPress={(e) => {
          setSafetyReportLocation({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
          setMakeSafetyReportModalVisible(true);
        }}>
        {clubView &&
          clubMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.location.latitude,
                longitude: marker.location.longitude,
              }}
              tracksViewChanges={false}
              onPress={() => {
                navigation.navigate('ClubScreen', { clubId: marker.id });
              }}>
              <View style={styles.marker}>
                <Image source={{ uri: marker.pfp }} style={styles.markerIcon} />
                <Text style={styles.markerText}>{marker.name}</Text>
              </View>
            </Marker>
          ))}
        {safetyView &&
          safetyMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.location.latitude,
                longitude: marker.location.longitude,
              }}
              onPress={() => {
                setSafetyReportId(marker.id);
                setShowSafetyReportModalVisible(true);
              }}
              tracksViewChanges={false}>
              <View style={styles.marker}>
                <FontAwesome name="exclamation-triangle" size={24} color={Colors.ORANGE} />
              </View>
            </Marker>
          ))}

        {partyView &&
          partyMembers &&
          Object.entries(partyMembers).map((member, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  //@ts-ignore
                  latitude: member[1].latitude,
                  //@ts-ignore
                  longitude: member[1].longitude,
                }}
                cluster={false}
                tracksViewChanges={false}
                onPress={() => {
                  navigation.navigate('UserScreen', {
                    user: member[0],
                  });
                }}>
                <View style={styles.marker}>
                  <Text>{member[0]}</Text>
                  <FontAwesome name="circle" size={24} color={Colors.RED} />
                </View>
              </Marker>
            );
          })}
      </MapView>
      {/*filterView*/}
      <View style={styles.buttonContainer}>
        <ActionButton
          options={[
            {
              title: 'Clubs',
              icon: (
                <FontAwesome
                  name="map-marker"
                  size={24}
                  color={clubView ? Colors.WHITE : Colors.INACTIVE}
                />
              ),
              active: clubView,
              onPress: () => setClubView(!clubView),
            },
            {
              title: 'Safety',
              icon: (
                <FontAwesome
                  name="exclamation-triangle"
                  size={24}
                  color={safetyView ? Colors.WHITE : Colors.INACTIVE}
                />
              ),
              onPress: () => setSafetyView(!safetyView),
              active: safetyView,
            },
            {
              title: 'Party',
              icon: (
                <FontAwesome
                  name="group"
                  size={24}
                  color={partyView ? Colors.WHITE : Colors.INACTIVE}
                />
              ),
              onPress: () => {
                party === ''
                  ? Toast.show({
                      type: 'info',
                      text1: 'You are not in a party',
                      text2: 'Create or join a party to see your party members on the map',
                    })
                  : setPartyView(!partyView);
              },
              active: partyView,
            },
          ]}
        />
      </View>
      {showSafetyReportModalVisible && (
        <ShowSafetyReportModal
          id={safetyReportId}
          isVisible={showSafetyReportModalVisible}
          onClose={() => setShowSafetyReportModalVisible(false)}
        />
      )}
      <MakeSafetyReportModal
        location={safetyReportLocation}
        isVisible={makeSafetyReportModalVisible}
        onClose={() => setMakeSafetyReportModalVisible(false)}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainMap: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  marker: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  markerIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  markerText: {
    textShadowColor: Colors.BLACK,
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  filterContainer: {
    position: 'absolute',
    top: '2%',
    left: '2%',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: '2%',
    right: '2%',
  },
});
