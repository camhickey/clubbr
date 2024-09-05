import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import * as Location from 'expo-location';
import {
  doc,
  updateDoc,
  setDoc,
  GeoPoint,
  deleteField,
  deleteDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
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
  const currentPartyDoc = await getDoc(doc(db, 'users', localUser));
  const data = currentPartyDoc.data();
  const oldParty = data?.party;
  if (oldParty) {
    await updateDoc(doc(db, 'parties', oldParty), {
      [`partyMembers.${localUser}`]: deleteField(),
    });
  }
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
  Alert.alert('Leaving party', 'Are you sure you want to leave the party?', [
    {
      text: 'Cancel',
      onPress: () => {},
      style: 'cancel',
    },
    {
      text: 'Yes',
      onPress: async () => {
        await updateDoc(doc(db, 'parties', party), {
          [`partyMembers.${localUser}`]: deleteField(),
        });
        party === localUser && deleteDoc(doc(db, 'parties', party));
        await updateDoc(doc(db, 'users', localUser), {
          party: deleteField(),
        });
      },
    },
  ]);
}

export async function inviteUser(localUser: string, user: string) {
  await updateDoc(doc(db, 'users', user), {
    invites: arrayUnion(localUser),
  });
}

export async function kickUser(party: string, user: string) {
  Alert.alert('Kicking user', 'Are you sure you want to kick this user?', [
    {
      text: 'Cancel',
      onPress: () => {},
      style: 'cancel',
    },
    {
      text: 'Yes',
      onPress: async () => {
        await updateDoc(doc(db, 'parties', party), {
          [`partyMembers.${user}`]: deleteField(),
        });
        await updateDoc(doc(db, 'users', user), {
          party: deleteField(),
        });
      },
    },
  ]);
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
