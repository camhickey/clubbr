import { DEFAULT_PFP } from '@constants/profile';
import { createContext, useContext, useState } from 'react';

interface ProfileContextType {
  clubs: string[];
  setClubs: (clubs: string[]) => void;
  displayName: string;
  setDisplayName: (displayName: string) => void;
  email: string;
  setEmail: (email: string) => void;
  friendRequestsPending: string[];
  setFriendRequestsPending: (friendRequestsPending: string[]) => void;
  friendRequestsReceived: string[];
  setFriendRequestsReceived: (friendRequestsReceived: string[]) => void;
  friends: string[];
  setFriends: (friends: string[]) => void;
  invites: string[];
  setInvites: (invite: string[]) => void;
  party: string | null;
  setParty: (party: string) => void;
  photoURL: string;
  setPhotoURL: (photoURL: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  username: string;
  setUsername: (username: string) => void;
}

const initialState: ProfileContextType = {
  clubs: [],
  setClubs: () => {},
  displayName: '',
  setDisplayName: () => {},
  email: '',
  setEmail: () => {},
  friendRequestsPending: [],
  setFriendRequestsPending: () => {},
  friendRequestsReceived: [],
  setFriendRequestsReceived: () => {},
  friends: [],
  setFriends: () => {},
  invites: [],
  setInvites: () => {},
  party: '',
  setParty: () => {},
  photoURL: '',
  setPhotoURL: () => {},
  userId: '',
  setUserId: () => {},
  username: '',
  setUsername: () => {},
};

const ProfileContext = createContext<ProfileContextType>(initialState);

export function ProfileProvider({ children }: any) {
  const [clubs, setClubs] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [friendRequestsPending, setFriendRequestsPending] = useState<string[]>([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [invites, setInvites] = useState<string[]>([]);
  const [party, setParty] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string>(DEFAULT_PFP);
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  return (
    <ProfileContext.Provider
      value={{
        clubs,
        setClubs,
        displayName,
        setDisplayName,
        email,
        setEmail,
        friendRequestsPending,
        setFriendRequestsPending,
        friendRequestsReceived,
        setFriendRequestsReceived,
        friends,
        setFriends,
        invites,
        setInvites,
        party,
        setParty,
        photoURL,
        setPhotoURL,
        userId,
        setUserId,
        username,
        setUsername,
      }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
