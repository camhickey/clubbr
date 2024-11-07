import { updateClubName } from '@actions/clubActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

import { modalStyles } from './styles';

export type ChangeClubNameModalProps = {
  visible: boolean;
  id: string;
  initialValue: string;
  onClose: () => void;
};

export function ChangeClubNameModal({
  visible,
  id,
  initialValue,
  onClose,
}: ChangeClubNameModalProps) {
  const [clubName, setClubName] = useState(initialValue);
  return (
    <CustomAlert visible={visible}>
      <View style={modalStyles.contentContainer}>
        <Text style={modalStyles.title}>Club name</Text>
        <Text style={modalStyles.description}>
          Change the name of your club and how it appears on the map and club screen.
        </Text>
        <TextInput
          style={modalStyles.input}
          value={clubName}
          onChangeText={(text) => setClubName(text)}
        />
        <View style={modalStyles.footer}>
          <Button onPress={() => updateClubName(id, clubName)}>SAVE</Button>
          <Button
            onPress={() => {
              onClose();
              setClubName(initialValue);
            }}>
            CANCEL
          </Button>
        </View>
      </View>
    </CustomAlert>
  );
}
