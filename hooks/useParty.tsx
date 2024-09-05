import { createContext, useContext, useState } from 'react';

export type Member = Record<string, { latitude: number; longitude: number }>;

interface PartyContextType {
  partyName: string;
  setPartyName: (name: string) => void;
  partyMembers: Member[];
  setPartyMembers: (members: Member[]) => void;
  partyLeader: string;
  setPartyLeader: (leader: string) => void;
}

const initialState: PartyContextType = {
  partyName: '',
  setPartyName: () => {},
  partyMembers: [],
  setPartyMembers: () => {},
  partyLeader: '',
  setPartyLeader: () => {},
};

const PartyContext = createContext<PartyContextType>(initialState);

export function PartyProvider({ children }: any) {
  const [partyName, setPartyName] = useState<string>('');
  const [partyMembers, setPartyMembers] = useState<Member[]>([]);
  const [partyLeader, setPartyLeader] = useState<string>('');

  return (
    <PartyContext.Provider
      value={{
        partyName,
        setPartyName,
        partyMembers,
        setPartyMembers,
        partyLeader,
        setPartyLeader,
      }}>
      {children}
    </PartyContext.Provider>
  );
}

export const useParty = () => {
  const context = useContext(PartyContext);

  if (context === undefined) {
    throw new Error('useParty must be used within a PartyProvider');
  }
  return context;
};
