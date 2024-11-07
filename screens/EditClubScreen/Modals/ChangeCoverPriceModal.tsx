import { updateClubPrice } from '@actions/clubActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

import { modalStyles } from './styles';

export type ChangeCoverPriceModalProps = {
  visible: boolean;
  id: string;
  initialValue: number;
  onClose: () => void;
};

export function ChangeCoverPriceModal({
  visible,
  id,
  initialValue,
  onClose,
}: ChangeCoverPriceModalProps) {
  const [coverPrice, setCoverPrice] = useState(initialValue);
  return (
    <CustomAlert visible={visible}>
      <View style={modalStyles.contentContainer}>
        <Text style={modalStyles.title}>Age limit</Text>
        <Text style={modalStyles.description}>
          Change the cover price of your club. If there is no cover, enter "0".
        </Text>
        <TextInput
          style={modalStyles.input}
          value={coverPrice.toString()}
          onChangeText={(text) => setCoverPrice(+text)}
          keyboardType="number-pad"
        />
        <View style={modalStyles.footer}>
          <Button onPress={() => updateClubPrice(id, coverPrice)}>SAVE</Button>
          <Button
            onPress={() => {
              onClose();
              setCoverPrice(initialValue);
            }}>
            CANCEL
          </Button>
        </View>
      </View>
    </CustomAlert>
  );
}
