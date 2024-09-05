import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useParty } from '@hooks/useParty';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

import { ActionButton } from './ActionButton/ActionButton';
import { PartyListener } from './Listeners/PartyListener';
import { ProfileListener } from './Listeners/ProfileListener';
import { MapFilter } from './MapFilter/MapFilter';
import { MapStyle } from './MapStyle';
import { MARKERS } from '../../data/locations';

const GAINESVILLE = {
  latitude: 29.6436,
  longitude: -82.3549,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export function MapScreen() {
  const [mapState, setMapState] = useState({
    markerView: true,
    safetyView: false,
    partyView: false,
    filterView: true,
    location: GAINESVILLE,
  });

  const navigation = useNavigation();

  const { partyMembers } = useParty();
  const { party } = useProfile();

  useEffect(() => {
    !party && setMapState({ ...mapState, partyView: false });
  }, [party]);

  return (
    <Container>
      <ProfileListener />
      <PartyListener />
      <MapView
        initialRegion={mapState.location}
        provider={PROVIDER_DEFAULT}
        style={styles.mainMap}
        customMapStyle={MapStyle}
        showsPointsOfInterest={Platform.OS !== 'ios'}
        tracksViewChanges={false}
        //iOS is weirdly unresponsive with user location marker
        //showsUserLocation={Platform.OS !== 'ios'}
        followsUserLocation
        tintColor="#121113"
        clusterColor="#F4EDED"
        clusterTextColor="#121113"
        onLongPress={(e) => {
          navigation.navigate('SafetyModal', {
            reportedLatitude: e.nativeEvent.coordinate.latitude,
            reportedLongitude: e.nativeEvent.coordinate.longitude,
            actualLatitude: e.nativeEvent.coordinate.latitude,
            actualLongitude: e.nativeEvent.coordinate.longitude,
          });
        }}>
        {/*START: Marker rendering*/}
        {mapState.markerView &&
          MARKERS.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              pinColor="white"
              tracksViewChanges={false}
              onPress={() => {
                navigation.navigate('ClubModal', {
                  name: marker.name,
                  id: marker.id,
                });
              }}>
              <View style={styles.marker}>
                <Text>{marker.name}</Text>
                <FontAwesome name="map-marker" size={24} color={Colors.WHITE} />
              </View>
            </Marker>
          ))}
        {/*END: Marker rendering*/}
        {/*START: Safety rendering*/}

        {/*END: Safety rendering*/}
        {/*START: Party rendering*/}
        {mapState.partyView &&
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
                  <FontAwesome name="circle" size={24} color={Colors.ERROR} />
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
                  color={mapState.markerView ? Colors.WHITE : Colors.INACTIVE}
                />
              ),
              active: mapState.markerView,
              onPress: () => setMapState((prev) => ({ ...mapState, markerView: !prev.markerView })),
            },
            {
              title: 'Safety',
              icon: (
                <FontAwesome
                  name="heart"
                  size={24}
                  color={mapState.safetyView ? Colors.WHITE : Colors.INACTIVE}
                />
              ),
              onPress: () => setMapState((prev) => ({ ...mapState, safetyView: !prev.safetyView })),
              active: mapState.safetyView,
            },
            {
              title: 'Party',
              icon: (
                <FontAwesome
                  name="group"
                  size={24}
                  color={mapState.partyView ? Colors.WHITE : Colors.INACTIVE}
                />
              ),
              onPress: () => {
                if (!party) return Alert.alert('You are not in a party');
                else setMapState((prev) => ({ ...mapState, partyView: !prev.partyView }));
              },
              active: mapState.partyView,
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
