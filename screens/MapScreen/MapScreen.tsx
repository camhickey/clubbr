import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useParty } from '@hooks/useParty';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Toast from 'react-native-toast-message';

import { ActionButton } from './ActionButton';
import { PartyListener } from './Listeners/PartyListener';
import { ProfileListener } from './Listeners/ProfileListener';
import { MapStyle } from './MapStyle';
import { MakeSafetyReportModal } from './SafetyModals/MakeSafetyReportModal';
import { ShowSafetyReportModal } from './SafetyModals/ShowSafetyReportModal';

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
  //add age and stuff to allow filtering
};

export function MapScreen() {
  const [clubView, setClubView] = useState(true);
  const [safetyView, setSafetyView] = useState(false);
  const [partyView, setPartyView] = useState(false);

  const { partyMembers } = useParty();
  const { party } = useProfile();
  const navigation = useNavigation();

  const [clubMarkers, setClubMarkers] = useState<ClubMarker[]>([]);
  const [safetyMarkers, setSafetyMarkers] = useState<SafetyMarker[]>([]);

  const [makeSafetyReportModalVisible, setMakeSafetyReportModalVisible] = useState(false);
  const [safetyReportLocation, setSafetyReportLocation] = useState({ latitude: 0, longitude: 0 });

  const [showSafetyReportModalVisible, setShowSafetyReportModalVisible] = useState(false);
  const [safetyReportId, setSafetyReportId] = useState('');

  //Get safety markers
  /*useEffect(() => {
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
  }, []);

  //Get club markers
  useEffect(() => {
    const q = query(collection(db, 'clubs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        setClubMarkers((prev) => [
          ...prev,
          {
            id: doc.id,
            name: doc.data().name,
            location: doc.data().location,
          },
        ]);
      });
    });
    return () => unsubscribe();
  }, []);*/

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
                navigation.navigate('ClubModal', {
                  name: marker.name,
                  id: marker.id,
                });
              }}>
              <View style={styles.marker}>
                <Text style={styles.markerText}>{marker.name}</Text>
                <FontAwesome
                  style={styles.markerText}
                  name="map-marker"
                  size={24}
                  color={Colors.WHITE}
                />
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
      </MapView>
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
                      type: 'error',
                      text1: 'You are not in a party',
                      text2: 'Go to the party tab to create a party.',
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
  markerText: {
    textShadowColor: Colors.BLACK,
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: '2%',
    right: '2%',
  },
});
