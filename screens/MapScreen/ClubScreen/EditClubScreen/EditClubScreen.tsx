import { updateClubBanner, updateClubImages, updateClubPfp } from '@actions/clubActions';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db*';
import { ClubDetails } from '@screens/MapScreen/ClubScreen/ClubScreen';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ChangeAgeLimitModal } from './Modals/ChangeAgeLimitModal';
import { ChangeClubNameModal } from './Modals/ChangeClubNameModal';
import { ChangeCoverPriceModal } from './Modals/ChangeCoverPriceModal';
import { ChangeDescriptionModal } from './Modals/ChangeDescriptionModal';
import { ChangeTonightModal } from './Modals/ChangeTonightModal';

export function EditClubScreen({ route }: any) {
  const { clubId, clubDetails } = route.params;
  const [newClubDetails, setNewClubDetails] = useState<ClubDetails>(clubDetails);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [tonightModalVisible, setTonightModalVisible] = useState(false);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'clubs', clubId);
    onSnapshot(docRef, (doc) => {
      if (!doc.exists()) return;
      setNewClubDetails((prev) => ({ ...prev, ...doc.data() }));
    });

    const colRef = collection(doc(db, 'clubs', clubId), 'info');
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
          <Pressable onPress={() => updateClubPfp(clubId)}>
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
          <Pressable onPress={() => updateClubBanner(clubId)}>
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Banner image</Text>
              <Image source={{ uri: newClubDetails.banner }} style={styles.banner} />
            </View>
          </Pressable>
          <Pressable onPress={() => updateClubImages(clubId)}>
            <View style={styles.listSection}>
              <Text style={styles.sectionTitle}>Images</Text>
              <View style={styles.imagesSection}>
                <Text style={styles.sectionValue}>Select up to 10 images</Text>
                {newClubDetails.images.map((image, index) => (
                  <Pressable onPress={() => updateClubImages(clubId)}>
                    <Image key={index} source={{ uri: image }} style={styles.images} />
                  </Pressable>
                ))}
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <ChangeClubNameModal
        visible={nameModalVisible}
        id={clubId}
        initialValue={newClubDetails.name}
        onClose={() => setNameModalVisible(false)}
      />
      <ChangeAgeLimitModal
        visible={ageModalVisible}
        id={clubId}
        initialValue={newClubDetails.age}
        onClose={() => setAgeModalVisible(false)}
      />
      <ChangeCoverPriceModal
        visible={priceModalVisible}
        id={clubId}
        initialValue={newClubDetails.price}
        onClose={() => setPriceModalVisible(false)}
      />
      <ChangeTonightModal
        visible={tonightModalVisible}
        id={clubId}
        initialValue={newClubDetails.tonight}
        onClose={() => setTonightModalVisible(false)}
      />
      <ChangeDescriptionModal
        visible={descriptionModalVisible}
        id={clubId}
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
  },
  imagesSection: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: 200,
    gap: 10,
  },
  images: {
    width: 95,
    height: 100,
    borderColor: Colors.WHITE,
    borderWidth: 2,
  },
});
