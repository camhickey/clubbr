import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

export function ProfileListener() {
  const {
    username,
    setClubs,
    setDisplayName,
    setEmail,
    setFriendRequestsPending,
    setFriendRequestsReceived,
    setFriends,
    setInvites,
    setParty,
    setPhotoURL,
    setOwnedClubs,
  } = useProfile();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', username), (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setClubs(data.clubs);
        setDisplayName(data.displayName);
        setEmail(data.email);
        setFriendRequestsPending(data.friendRequestsPending);
        setFriendRequestsReceived(data.friendRequestsReceived);
        setFriends(data.friends);
        setInvites(data.invites);
        setParty(data.party);
        setPhotoURL(data.photoURL);
        setOwnedClubs(data.ownedClubs);
      }
    });
    return () => unsubscribe();
  }, []);
  return null;
}
