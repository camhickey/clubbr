import { submitSafetyReport } from '@actions/safetyActions';
import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { Toast } from '@components/Toast';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db*';
import { FontAwesome } from '@expo/vector-icons';
import { useParty } from '@hooks/useParty';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { MARKERS } from '../../data/locations';
import { ActionButton } from './ActionButton/ActionButton';
import { PartyListener } from './Listeners/PartyListener';
import { ProfileListener } from './Listeners/ProfileListener';
import { MapStyle } from './MapStyle';

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

  const [safetyModalVisible, setSafetyModalVisible] = useState(false);
  const [safetyToastVisible, setSafetyToastVisible] = useState(false);

  const SAFETY_REPORT_MAX_LENGTH = 200;
  const [safetyReport, setSafetyReport] = useState<SafetyMarker>({
    description: '',
    location: { latitude: 0, longitude: 0 },
    timestamp: Date.now(),
  });

  const navigation = useNavigation();

  const { partyMembers } = useParty();
  const { username, party } = useProfile();

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
        toolbarEnabled={false}
        //iOS is weirdly unresponsive with user location marker
        //showsUserLocation={Platform.OS !== 'ios'}
        followsUserLocation
        tintColor={Colors.BLACK}
        clusterColor={Colors.WHITE}
        clusterTextColor={Colors.BLACK}
        onLongPress={(e) => {
          setSafetyReport({
            description: '',
            location: e.nativeEvent.coordinate,
            timestamp: Date.now(),
          });
          setSafetyModalVisible(true);
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
          ]}
        />
      </View>
      {safetyModalVisible && (
        <CustomAlert visible={safetyModalVisible}>
          <View style={safetyStyles.container}>
            <Text style={safetyStyles.header}>Make a Safety Report</Text>
            <Text style={safetyStyles.blurb}>
              Please describe the safety concern you are reporting.
            </Text>
            <TextInput
              style={safetyStyles.input}
              placeholder="Type your description here..."
              placeholderTextColor={Colors.SUBTEXT}
              multiline
              blurOnSubmit
              textAlignVertical="top"
              maxLength={SAFETY_REPORT_MAX_LENGTH}
              value={safetyReport.description}
              onChangeText={(text) => setSafetyReport({ ...safetyReport, description: text })}
            />
            <Text style={safetyStyles.descriptionLength}>
              Characters: {safetyReport.description.length}/{SAFETY_REPORT_MAX_LENGTH}
            </Text>
            <View style={safetyStyles.controls}>
              <Button
                onPress={() => {
                  setSafetyModalVisible(false);
                  setSafetyReport({
                    description: '',
                    location: { latitude: 0, longitude: 0 },
                    timestamp: Date.now(),
                  });
                }}>
                CANCEL
              </Button>
              <Button
                disabled={safetyReport.description.length === 0}
                onPress={() => {
                  submitSafetyReport(
                    username,
                    safetyReport.description,
                    safetyReport.location.latitude,
                    safetyReport.location.longitude,
                  )
                    .then(() => {
                      //add date to schema in firebase
                      setSafetyModalVisible(false);
                      setSafetyReport({
                        description: '',
                        location: { latitude: 0, longitude: 0 },
                        timestamp: Date.now(),
                      });
                      setSafetyToastVisible(true);
                    })
                    .catch((error) => {
                      Alert.alert('Error submitting safety report', error.message);
                    });
                }}>
                SUBMIT
              </Button>
            </View>
          </View>
        </CustomAlert>
      )}
      {safetyToastVisible && (
        <Toast
          setToast={setSafetyToastVisible}
          variant="success"
          header="Safety Report"
          message="Safety report submitted successfully!"
        />
      )}
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

const safetyStyles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  blurb: {
    color: Colors.SUBTEXT,
    alignSelf: 'center',
  },
  descriptionLength: {
    color: Colors.SUBTEXT,
    alignSelf: 'flex-end',
    fontSize: 12,
  },
  input: {
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
  },
  controls: {
    padding: 10,
    gap: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
