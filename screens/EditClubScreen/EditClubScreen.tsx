import { updateClubBanner, updateClubPfp } from '@actions/clubActions';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db*';
import { ClubDetails } from '@screens/MapScreen/ClubScreen/ClubScreen';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ChangeAgeLimitModal } from './Modals/ChangeAgeLimitModal';
import { ChangeClubNameModal } from './Modals/ChangeClubNameModal';
import { ChangeCoverPriceModal } from './Modals/ChangeCoverPriceModal';
import { ChangeDescriptionModal } from './Modals/ChangeDescriptionModal';
import { ChangeTonightModal } from './Modals/ChangeTonightModal';

export type EditClubScreenProps = {
  id: string;
  clubDetails: ClubDetails;
};

export function EditClubScreen({ route }: any) {
  const { id, clubDetails } = route.params;
  const [newClubDetails, setNewClubDetails] = useState<ClubDetails>(clubDetails);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [tonightModalVisible, setTonightModalVisible] = useState(false);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'clubs', id);
    onSnapshot(docRef, (doc) => {
      if (!doc.exists()) return;
      setNewClubDetails(doc.data() as ClubDetails);
    });

    const colRef = collection(doc(db, 'clubs', id), 'info');
    const docRef2 = doc(colRef, 'page');
    onSnapshot(docRef2, (doc) => {
      if (!doc.exists()) return;
      setNewClubDetails((prev) => ({ ...prev, ...doc.data() }));
    });
  }, []);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
        <View style={styles.listContainer}>
          <KeyboardAvoidingView behavior="height">
            <Pressable onPress={() => updateClubPfp(id)}>
              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Profile picture</Text>
                <Image source={{ uri: newClubDetails.pfp }} style={styles.pfp} />
              </View>
            </Pressable>
            <Pressable onPress={() => setNameModalVisible(true)}>
              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Club name</Text>
                <Text style={styles.sectionValue}>{newClubDetails.name}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setAgeModalVisible(true)}>
              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Age limit</Text>
                <Text style={styles.sectionValue}>{newClubDetails.age}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setPriceModalVisible(true)}>
              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Cover price</Text>
                <Text style={styles.sectionValue}>{newClubDetails.price}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setTonightModalVisible(true)}>
              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>"Tonight"</Text>
                <Text style={styles.sectionValue}>{newClubDetails.tonight}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setDescriptionModalVisible(true)}>
              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>"Description"</Text>
                <Text style={styles.sectionValue}>{newClubDetails.description}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => updateClubBanner(id)}>
              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Banner image</Text>
                <Image source={{ uri: newClubDetails.banner }} style={styles.banner} />
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      <ChangeClubNameModal
        visible={nameModalVisible}
        id={id}
        initialValue={newClubDetails.name}
        onClose={() => setNameModalVisible(false)}
      />
      <ChangeAgeLimitModal
        visible={ageModalVisible}
        id={id}
        initialValue={newClubDetails.age}
        onClose={() => setAgeModalVisible(false)}
      />
      <ChangeCoverPriceModal
        visible={priceModalVisible}
        id={id}
        initialValue={newClubDetails.price}
        onClose={() => setPriceModalVisible(false)}
      />
      <ChangeTonightModal
        visible={tonightModalVisible}
        id={id}
        initialValue={newClubDetails.tonight}
        onClose={() => setTonightModalVisible(false)}
      />
      <ChangeDescriptionModal
        visible={descriptionModalVisible}
        id={id}
        initialValue={newClubDetails.description}
        onClose={() => setDescriptionModalVisible(false)}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  pfpContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.SUBTEXT,
  },
  pfpSection: {
    alignItems: 'center',
    gap: 10,
  },
  pfp: {
    width: 75,
    height: 75,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  listContainer: {
    gap: 10,
    flex: 1,
    width: '100%',
  },
  listSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    width: 100,
  },
  sectionValue: {
    flex: 1,
    flexWrap: 'wrap',
    color: Colors.SUBTEXT,
  },
  banner: {
    width: 200,
    height: 200,
    borderColor: Colors.WHITE,
    borderWidth: 2,
    borderRadius: 10,
  },
});
