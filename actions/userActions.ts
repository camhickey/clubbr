import { db } from '@db';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert } from 'react-native';

export async function changeDisplayName(localUser: string, newName: string) {
  await updateDoc(doc(db, 'users', localUser), {
    displayName: newName,
  });
}

export async function changeProfilePicture(localUser: string) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
  });
  if (!result) return;
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;
  if (!result.canceled) {
    const storage = getStorage();
    const storageRef = ref(storage, `users/${user.uid}/pfp.jpg`);
    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();
    await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, 'users', localUser), {
      photoURL: downloadURL,
    });
  }
}
