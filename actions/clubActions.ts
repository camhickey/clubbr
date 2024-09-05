import { db } from '@db';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

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
