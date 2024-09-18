import { db } from '@db';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

export async function sendRequest(localUser: string, friend: string) {
  await updateDoc(doc(db, 'users', localUser), {
    friendRequestsPending: arrayUnion(friend),
  });
  await updateDoc(doc(db, 'users', friend), {
    friendRequestsReceived: arrayUnion(localUser),
  });
}

export async function rejectRequest(localUser: string, friend: string) {
  await updateDoc(doc(db, 'users', localUser), {
    friendRequestsReceived: arrayRemove(friend),
  });
  await updateDoc(doc(db, 'users', friend), {
    friendRequestsPending: arrayRemove(localUser),
  });
}

export async function cancelRequest(localUser: string, friend: string) {
  await updateDoc(doc(db, 'users', localUser), {
    friendRequestsPending: arrayRemove(friend),
  });
  await updateDoc(doc(db, 'users', friend), {
    friendRequestsReceived: arrayRemove(localUser),
  });
}

export async function acceptRequest(localUser: string, friend: string) {
  await updateDoc(doc(db, 'users', localUser), {
    friendRequestsReceived: arrayRemove(friend),
    friends: arrayUnion(friend),
  });
  await updateDoc(doc(db, 'users', friend), {
    friendRequestsPending: arrayRemove(localUser),
    friends: arrayUnion(localUser),
  });
}

export async function removeFriend(localUser: string, friend: string) {
  await updateDoc(doc(db, 'users', localUser), {
    friends: arrayRemove(friend),
  });
  await updateDoc(doc(db, 'users', friend), {
    friends: arrayRemove(localUser),
  });
}
