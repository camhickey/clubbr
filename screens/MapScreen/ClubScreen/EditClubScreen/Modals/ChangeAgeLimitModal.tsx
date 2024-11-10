import { updateClubAge } from '@actions/clubActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

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
          style={styles.input}
          value={ageLimit.toString()}
          onChangeText={(text) => setAgeLimit(+text)}
          keyboardType="number-pad"
          maxLength={2}
          placeholderTextColor={Colors.SUBTEXT}
        />
        <View style={modalStyles.footer}>
          <Button onPress={() => updateClubAge(id, ageLimit).then(onClose)}>SAVE</Button>
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

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderRadius: 10,
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
});
