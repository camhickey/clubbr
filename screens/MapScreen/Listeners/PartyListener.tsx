import { updatePosition } from '@actions/partyActions';
import { db } from '@db';
import { useParty } from '@hooks/useParty';
import { useProfile } from '@hooks/useProfile';
import * as Location from 'expo-location';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

export function PartyListener() {
  const { party, username } = useProfile();
  const { setPartyLeader, setPartyName, setPartyMembers } = useParty();

  useEffect(() => {
    if (party) {
      const unsubscribe = onSnapshot(doc(db, 'parties', party), (snapshot) => {
        const data = snapshot.data();
        setPartyLeader(data?.partyLeader);
        setPartyName(data?.partyName);
        setPartyMembers(data?.partyMembers);
      });
      return () => unsubscribe();
    }
  }, [party]);

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        if (party) {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          updatePosition(
            username,
            location.coords.latitude,
            location.coords.longitude,
            party,
          ).catch((err) => console.log(err));
        }
      })();
    }, 60000);
    return () => clearInterval(interval);
  }, [party]);

  return null;
}
