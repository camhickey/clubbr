import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import * as Location from 'expo-location';
import {
  GeoPoint,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Alert } from 'react-native';

export async function createParty(localUser: string, partyName: string) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return Alert.alert("You need to grant location permission to use clubbr's location features");
  }
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  await setDoc(doc(db, 'parties', localUser), {
    partyLeader: localUser,
    partyMembers: {
      [localUser]: new GeoPoint(location.coords.latitude, location.coords.longitude),
    },
    partyName,
  });
  await updateDoc(doc(db, 'users', localUser), {
    party: localUser,
  });
}

export async function acceptInvite(localUser: string, party: string) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return Alert.alert("You need to grant location permission to use clubbr's location features");
  }
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  //move error checking out of these functions
  getDoc(doc(db, 'parties', party)).then(async (partyDoc) => {
    if (!partyDoc.exists()) {
      return Alert.alert('This party is on longer active.');
    }
    const { party } = useProfile();
    if (party) {
      return Alert.alert('You must leave your current party before joining a new one.');
    }
  });
  await updateDoc(doc(db, 'users', localUser), {
    party,
    invites: arrayRemove(party),
  });
  await updateDoc(doc(db, 'parties', party), {
    [`partyMembers.${localUser}`]: new GeoPoint(
      location.coords.latitude,
      location.coords.longitude,
    ),
  });
}

export async function rejectInvite(localUser: string, party: string) {
  await updateDoc(doc(db, 'users', localUser), {
    invites: arrayRemove(party),
  });
}

export async function updatePosition(
  localUser: string,
  latitude: number,
  longitude: number,
  party: string,
) {
  await updateDoc(doc(db, 'parties', party), {
    [`partyMembers.${localUser}`]: new GeoPoint(latitude, longitude),
  });
}

export async function leaveParty(localUser: string, party: string) {
  await updateDoc(doc(db, 'users', localUser), {
    party: deleteField(),
  }).then(async () => {
    await updateDoc(doc(db, 'parties', party), {
      [`partyMembers.${localUser}`]: deleteField(),
    });
  });
}

export async function disbandParty(localUser: string) {
  await getDoc(doc(db, 'parties', localUser))
    .then(async (partyDoc) => {
      const data = partyDoc.data();
      const partyMembers = Object.keys(data?.partyMembers);
      partyMembers.forEach(async (member) => {
        await updateDoc(doc(db, 'users', member), {
          party: '',
        });
      });
    })
    .then(async () => {
      await deleteDoc(doc(db, 'parties', localUser));
    });
}

export async function inviteUsers(localUser: string, users: string[]) {
  users.map((user) =>
    updateDoc(doc(db, 'users', user), {
      invites: arrayUnion(localUser),
    }),
  );
}

export async function kickUser(user: string, party: string) {
  await updateDoc(doc(db, 'parties', party), {
    [`partyMembers.${user}`]: deleteField(),
  }).then(async () => {
    await updateDoc(doc(db, 'users', user), {
      party: deleteField(),
    });
  });
}

export async function renameParty(localUser: string, name: string) {
  await updateDoc(doc(db, 'parties', localUser), {
    partyName: name,
  });
}

export async function getParty(user: string) {
  const partyDoc = await getDoc(doc(db, 'users', user));
  const data = partyDoc.data();
  return data?.party;
}
