import { updateClubTonight } from '@actions/clubActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput } from 'react-native';

import { modalStyles } from './styles';

export type ChangeTonightModalProps = {
  visible: boolean;
  id: string;
  initialValue: string;
  onClose: () => void;
};

export function ChangeTonightModal({
  visible,
  id,
  initialValue,
  onClose,
}: ChangeTonightModalProps) {
  const [tonight, setTonight] = useState(initialValue);
  return (
    <CustomAlert visible={visible}>
      <View style={modalStyles.contentContainer}>
        <Text style={modalStyles.title}>"Tonight"</Text>
        <Text style={modalStyles.description}>
          Change the cover price of your club. If there is no cover, enter "0".
        </Text>
        <TextInput
          style={styles.input}
          value={tonight.toString()}
          onChangeText={(text) => setTonight(text)}
          multiline
          placeholderTextColor={Colors.SUBTEXT}
          placeholder="Enter tonight's event"
          blurOnSubmit
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <View style={modalStyles.footer}>
          <Button onPress={() => updateClubTonight(id, tonight).then(onClose)}>SAVE</Button>
          <Button
            onPress={() => {
              onClose();
              setTonight(initialValue);
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
    color: Colors.WHITE,
    backgroundColor: Colors.INPUT,
    height: 100,
  },
});
