import { db } from '@db';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, arrayRemove, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export async function followClub(localUser: string, clubId: string) {
  await updateDoc(doc(db, 'users', localUser), {
    clubs: arrayUnion(clubId),
  });
}

export async function unfollowClub(localUser: string, clubId: string) {
  await updateDoc(doc(db, 'users', localUser), {
    clubs: arrayRemove(clubId),
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

export async function likeComment(localUser: string, clubId: string, commentId: string) {
  const clubDoc = doc(db, 'clubs', clubId);
  const commentCol = collection(clubDoc, 'comments');
  const commentDoc = doc(commentCol, commentId);
  await updateDoc(commentDoc, {
    likes: arrayUnion(localUser),
  });
}

export async function unlikeComment(localUser: string, clubId: string, commentId: string) {
  const clubDoc = doc(db, 'clubs', clubId);
  const commentCol = collection(clubDoc, 'comments');
  const commentDoc = doc(commentCol, commentId);
  await updateDoc(commentDoc, {
    likes: arrayRemove(localUser),
  });
}

//Owner functions
export async function updateClubName(clubId: string, name: string) {
  await updateDoc(doc(db, 'clubs', clubId), {
    name,
  });
}

export async function updateClubAge(clubId: string, age: number) {
  await updateDoc(doc(db, 'clubs', clubId), {
    age,
  });
}

export async function updateClubPrice(clubId: string, price: number) {
  await updateDoc(doc(db, 'clubs', clubId), {
    price,
  });
}

export async function updateClubPfp(clubId: string) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
  });
  if (!result) return false;
  if (!result.canceled) {
    const storage = getStorage();
    const storageRef = ref(storage, `clubs/${clubId}/pfp.jpg`);
    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();
    await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, 'clubs', clubId), {
      pfp: downloadURL,
    });
    return true;
  }
}

export async function updateClubTonight(clubId: string, tonight: string) {
  const colRef = collection(doc(db, 'clubs', clubId), 'info');
  const docRef = doc(colRef, 'page');
  await updateDoc(docRef, {
    tonight,
  });
}

export async function updateClubDescription(clubId: string, description: string) {
  const colRef = collection(doc(db, 'clubs', clubId), 'info');
  const docRef = doc(colRef, 'page');
  await updateDoc(docRef, {
    description,
  });
}

export async function updateClubBanner(clubId: string) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
  });
  if (!result) return false;
  if (!result.canceled) {
    const storage = getStorage();
    const storageRef = ref(storage, `clubs/${clubId}/banner.jpeg`);
    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();
    await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    const colRef = collection(doc(db, 'clubs', clubId), 'info');
    const docRef = doc(colRef, 'page');
    await updateDoc(docRef, {
      banner: downloadURL,
    });
    return true;
  }
}

export async function updateClubImages(clubId: string) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
    allowsMultipleSelection: true,
  });
  if (!result) return false;
  if (!result.canceled) {
    const storage = getStorage();
    const colRef = collection(doc(db, 'clubs', clubId), 'info');
    const docRef = doc(colRef, 'page');
    const images = [];
    for (const image of result.assets) {
      const storageRef = ref(storage, `clubs/${clubId}/${image.uri.split('/').pop()}`);
      const response = await fetch(image.uri);
      const blob = await response.blob();
      await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      images.push(downloadURL);
    }
    await updateDoc(docRef, {
      images,
    });
    return true;
  }
}
