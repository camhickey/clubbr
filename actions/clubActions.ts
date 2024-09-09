import { db } from '@db';
import { addDoc, arrayRemove, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';

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
