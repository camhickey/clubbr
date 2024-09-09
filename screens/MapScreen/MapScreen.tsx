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
import { Alert, Platform, StyleSheet } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { ActionButton } from './ActionButton/ActionButton';
import { PartyListener } from './Listeners/PartyListener';
import { ProfileListener } from './Listeners/ProfileListener';
import { MapStyle } from './MapStyle';
import { MARKERS } from '../../data/locations';

const GAINESVILLE = {
  latitude: 29.6436,
  longitude: -82.3549,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export type SafetyMarker = {
  description: string;
  location: { latitude: number; longitude: number };
  timestamp: number;
};

export function MapScreen() {
  const [clubView, setClubView] = useState(true);
  const [safetyView, setSafetyView] = useState(false);
  const [partyView, setPartyView] = useState(false);
  const [filterView, setFilterView] = useState(true);

  const navigation = useNavigation();

  const { partyMembers } = useParty();
  const { party } = useProfile();

  const [safetyMarkers, setSafetyMarkers] = useState<SafetyMarker[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'safety'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as SafetyMarker);
      setSafetyMarkers(data);
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
        //iOS is weirdly unresponsive with user location marker
        //showsUserLocation={Platform.OS !== 'ios'}
        followsUserLocation
        tintColor={Colors.BLACK}
        clusterColor={Colors.WHITE}
        clusterTextColor={Colors.BLACK}
        onLongPress={(e) => {
          navigation.navigate('SafetyReportModal', {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
        }}>
        {/*START: Club rendering*/}
        {clubView &&
          MARKERS.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              tracksViewChanges={false}
              onPress={() => {
                navigation.navigate('ClubModal', {
                  name: marker.name,
                  id: marker.id,
                });
              }}>
              <View style={styles.marker}>
                <Text style={styles.clubMarkerText}>{marker.name}</Text>
                <FontAwesome
                  style={styles.clubMarkerText}
                  name="map-marker"
                  size={24}
                  color={Colors.WHITE}
                />
              </View>
            </Marker>
          ))}
        {/*END: Club rendering*/}

        {/*START: Safety rendering*/}
        {safetyView &&
          safetyMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.location.latitude,
                longitude: marker.location.longitude,
              }}
              pinColor={Colors.RED}
              tracksViewChanges={false}>
              <View style={styles.marker}>
                <FontAwesome name="exclamation-triangle" size={16} color={Colors.ORANGE} />
              </View>
            </Marker>
          ))}
        {/*END: Safety rendering*/}

        {/*START: Party rendering*/}
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
                  navigation.navigate('UserModal', {
                    user: member[0],
                    title: '@' + member[0],
                  });
                }}>
                <View style={styles.marker}>
                  <Text>{member[0]}</Text>
                  <FontAwesome name="circle" size={24} color={Colors.RED} />
                </View>
              </Marker>
            );
          })}
        {/*END: Party rendering*/}
      </MapView>
      {/*mapState.filterView && (
        <View style={styles.filterContainer}>
          <MapFilter
            options={[
              {
                text: '21+',
                onPress: () =>
                  setMapState((prev) => ({ ...mapState, markerView: !prev.markerView })),
                active: false,
              },
              {
                text: 'No cover',
                onPress: () =>
                  setMapState((prev) => ({ ...mapState, markerView: !prev.markerView })),
                active: true,
              },
              {
                text: 'Bar',
                onPress: () =>
                  setMapState((prev) => ({ ...mapState, markerView: !prev.markerView })),
                active: true,
              },
              {
                text: 'Club',
                onPress: () =>
                  setMapState((prev) => ({ ...mapState, markerView: !prev.markerView })),
                active: true,
              },
              {
                text: 'Live music',
                onPress: () =>
                  setMapState((prev) => ({ ...mapState, markerView: !prev.markerView })),
                active: true,
              },
            ]}
          />
        </View>
          )*/}
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
                if (party === '') return Alert.alert('You are not in a party');
                else setPartyView(!partyView);
              },
              active: partyView,
            },
            /*{
              title: 'Filter',
              icon: (
                <FontAwesome
                  name="filter"
                  size={24}
                  color={mapState.filterView ? Colors.WHITE : Colors.INACTIVE}
                />
              ),
              onPress: () => setMapState((prev) => ({ ...mapState, filterView: !prev.filterView })),
              active: mapState.filterView,
            },*/
          ]}
        />
      </View>
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
  clubMarkerText: {
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
