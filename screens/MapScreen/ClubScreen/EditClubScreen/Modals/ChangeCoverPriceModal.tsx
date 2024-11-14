import { updateClubPrice } from '@actions/clubActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

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
        <Text style={modalStyles.title}>Cover price</Text>
        <Text style={modalStyles.description}>
          Change the cover price of your club. If there is no cover, enter "0".
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currency}>$</Text>
          <TextInput
            style={styles.input}
            value={coverPrice.toString()}
            onChangeText={(text) => setCoverPrice(+text)}
            keyboardType="number-pad"
            maxLength={3}
            placeholderTextColor={Colors.SUBTEXT}
          />
        </View>
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

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currency: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  input: {
    padding: 10,
    borderRadius: 10,
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
});
