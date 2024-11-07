import { db } from '@db';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, arrayRemove, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export async function followClub(localUser: string, id: string) {
  await updateDoc(doc(db, 'users', localUser), {
    clubs: arrayUnion(id),
  });
}

export async function unfollowClub(localUser: string, id: string) {
  await updateDoc(doc(db, 'users', localUser), {
    clubs: arrayRemove(id),
  });
}

export async function sendComment(localUser: string, clubId: string, text: string) {
  const docRef = doc(db, 'clubs', clubId);
  const colRef = collection(docRef, 'comments');
  addDoc(colRef, {
    text,
    timestamp: new Date(),
    user: localUser,
    likes: [],
  });
}

//Owner functions
export async function updateClubName(id: string, name: string) {
  await updateDoc(doc(db, 'clubs', id), {
    name,
  });
}

export async function updateClubAge(id: string, age: number) {
  await updateDoc(doc(db, 'clubs', id), {
    age,
  });
}

export async function updateClubPrice(id: string, price: number) {
  await updateDoc(doc(db, 'clubs', id), {
    price,
  });
}

export async function updateClubPfp(id: string) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
  });
  if (!result) return false;
  if (!result.canceled) {
    const storage = getStorage();
    const storageRef = ref(storage, `clubs/${id}/pfp.jpg`);
    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();
    await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, 'clubs', id), {
      pfp: downloadURL,
    });
    return true;
  }
}

export async function updateClubTonight(id: string, tonight: string) {
  const colRef = collection(doc(db, 'clubs', id), 'info');
  const docRef = doc(colRef, 'page');
  await updateDoc(docRef, {
    tonight,
  });
}

export async function updateClubDescription(id: string, description: string) {
  const colRef = collection(doc(db, 'clubs', id), 'info');
  const docRef = doc(colRef, 'page');
  await updateDoc(docRef, {
    description,
  });
}

export async function updateClubBanner(id: string) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
  });
  if (!result) return false;
  if (!result.canceled) {
    const storage = getStorage();
    const storageRef = ref(storage, `clubs/${id}/banner.jpeg`);
    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();
    await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    const colRef = collection(doc(db, 'clubs', id), 'info');
    const docRef = doc(colRef, 'page');
    await updateDoc(docRef, {
      banner: downloadURL,
    });
    return true;
  }
}
