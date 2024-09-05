import { renameParty } from '@actions/partyActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { useProfile } from '@hooks/useProfile';
import React from 'react';
import { Alert } from 'react-native';

export function PartySettingsModal() {
  const { username } = useProfile();
  return (
    <ModalContainer>
      <Button
        onPress={() =>
          Alert.prompt('Rename Party', 'Enter a new name for your party', (text) =>
            renameParty(username, text),
          )
        }>
        RENAME PARTY
      </Button>
    </ModalContainer>
  );
}
