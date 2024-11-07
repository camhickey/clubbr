import { updateClubAge } from '@actions/clubActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

import { modalStyles } from './styles';

export type ChangeAgeLimitModalProps = {
  visible: boolean;
  id: string;
  initialValue: number;
  onClose: () => void;
};

export function ChangeAgeLimitModal({
  visible,
  id,
  initialValue,
  onClose,
}: ChangeAgeLimitModalProps) {
  const [ageLimit, setAgeLimit] = useState(initialValue);
  return (
    <CustomAlert visible={visible}>
      <View style={modalStyles.contentContainer}>
        <Text style={modalStyles.title}>Age limit</Text>
        <Text style={modalStyles.description}>
          Change the minimum age limit of your club. If there is no age limit, enter "0".
        </Text>
        <TextInput
          style={modalStyles.input}
          value={ageLimit.toString()}
          onChangeText={(text) => setAgeLimit(+text)}
          keyboardType="number-pad"
        />
        <View style={modalStyles.footer}>
          <Button onPress={() => updateClubAge(id, ageLimit)}>SAVE</Button>
          <Button
            onPress={() => {
              onClose();
              setAgeLimit(initialValue);
            }}>
            CANCEL
          </Button>
        </View>
      </View>
    </CustomAlert>
  );
}
