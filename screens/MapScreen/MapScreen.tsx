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

import { ActionButton } from './ActionButton';
import { PartyListener } from './Listeners/PartyListener';
import { ProfileListener } from './Listeners/ProfileListener';
import { MapStyle } from './MapStyle';

const GAINESVILLE = {
  latitude: 29.6436,
  longitude: -82.3549,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export type SafetyReport = {
  description: string;
  location: { latitude: number; longitude: number };
  timestamp: number;
};

export type ClubMarker = {
  id: string;
  name: string;
  location: { latitude: number; longitude: number };
};

export function MapScreen() {
  const [clubView, setClubView] = useState(true);
  const [safetyView, setSafetyView] = useState(false);
  const [partyView, setPartyView] = useState(false);

  const { partyMembers } = useParty();
  const { username, party } = useProfile();
  const navigation = useNavigation();

  const [clubMarkers, setClubMarkers] = useState<ClubMarker[]>([]);

  const [makeSafetyReportModalVisible, setMakeSafetyReportModalVisible] = useState(false);
  const [makeSafetyReportToastVisible, setMakeSafetyReportToastVisible] = useState(false);
  const SAFETY_REPORT_MAX_LENGTH = 200;
  const [safetyMarkers, setSafetyMarkers] = useState<SafetyReport[]>([]);
  const [makeSafetyReport, setMakeSafetyReport] = useState<SafetyReport>({
    description: '',
    location: { latitude: 0, longitude: 0 },
    timestamp: Date.now(),
  });
  const [showSafetyReportModalVisible, setShowSafetyReportModalVisible] = useState(false);
  const [showSafetyReport, setShowSafetyReport] = useState<SafetyReport>({
    description: '',
    location: { latitude: 0, longitude: 0 },
    timestamp: Date.now(),
  });

  useEffect(() => {
    const q = query(collection(db, 'safety'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as SafetyReport);
      setSafetyMarkers(data);
    });
    return () => unsubscribe();
  }, []);

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
          setMakeSafetyReport({
            description: '',
            location: e.nativeEvent.coordinate,
            timestamp: Date.now(),
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
                setShowSafetyReport(marker);
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
                console.log(clubMarkers[0]);
              },
              active: partyView,
            },
          ]}
        />
      </View>
      {showSafetyReportModalVisible && (
        <CustomAlert visible={showSafetyReportModalVisible}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.header}>Safety Report</Text>
            <Text style={modalStyles.blurb}>{showSafetyReport.description}</Text>
            <Text style={modalStyles.blurb}>
              Reported:{' '}
              {
                // Firebase timestamp is being weird and not converting to date properly
                // @ts-ignore
                new Date(showSafetyReport.timestamp.seconds * 1000).toLocaleString('en-US', {
                  timeZone: 'UTC',
                  hour12: true,
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }
            </Text>
            <Button
              onPress={() => {
                setShowSafetyReportModalVisible(false);
              }}>
              CLOSE
            </Button>
          </View>
        </CustomAlert>
      )}
      {makeSafetyReportModalVisible && (
        <CustomAlert visible={makeSafetyReportModalVisible}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.header}>Make a Safety Report</Text>
            <Text style={modalStyles.blurb}>
              Please describe the safety concern you are reporting.
            </Text>
            <TextInput
              style={modalStyles.input}
              placeholder="Type your description here..."
              placeholderTextColor={Colors.SUBTEXT}
              multiline
              blurOnSubmit
              textAlignVertical="top"
              maxLength={SAFETY_REPORT_MAX_LENGTH}
              value={makeSafetyReport.description}
              onChangeText={(text) =>
                setMakeSafetyReport({ ...makeSafetyReport, description: text })
              }
            />
            <Text style={modalStyles.descriptionLength}>
              Characters: {makeSafetyReport.description.length}/{SAFETY_REPORT_MAX_LENGTH}
            </Text>
            <View style={modalStyles.controls}>
              <Button
                onPress={() => {
                  setMakeSafetyReportModalVisible(false);
                  setMakeSafetyReport({
                    description: '',
                    location: { latitude: 0, longitude: 0 },
                    timestamp: Date.now(),
                  });
                }}>
                CANCEL
              </Button>
              <Button
                disabled={makeSafetyReport.description.length === 0}
                onPress={() => {
                  submitSafetyReport(
                    username,
                    makeSafetyReport.description,
                    makeSafetyReport.location.latitude,
                    makeSafetyReport.location.longitude,
                  )
                    .then(() => {
                      setMakeSafetyReportModalVisible(false);
                      setMakeSafetyReport({
                        description: '',
                        location: { latitude: 0, longitude: 0 },
                        timestamp: Date.now(),
                      });
                      setMakeSafetyReportToastVisible(true);
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
      {makeSafetyReportToastVisible && (
        <Toast
          setToast={setMakeSafetyReportToastVisible}
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

const modalStyles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  blurb: {
    color: Colors.SUBTEXT,
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
