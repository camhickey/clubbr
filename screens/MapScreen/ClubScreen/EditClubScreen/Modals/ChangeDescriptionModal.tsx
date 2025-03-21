import { updateClubDescription } from '@actions/clubActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput } from 'react-native';

import { modalStyles } from './styles';

export type ChangeDescriptionModalProps = {
  visible: boolean;
  id: string;
  initialValue: string;
  onClose: () => void;
};

export function ChangeDescriptionModal({
  visible,
  id,
  initialValue,
  onClose,
}: ChangeDescriptionModalProps) {
  const [description, setDescription] = useState(initialValue);
  return (
    <CustomAlert visible={visible}>
      <View style={modalStyles.contentContainer}>
        <Text style={modalStyles.title}>"Description"</Text>
        <Text style={modalStyles.description}>
          Change the cover price of your club. If there is no cover, enter "0".
        </Text>
        <TextInput
          style={styles.input}
          value={description.toString()}
          onChangeText={(text) => setDescription(text)}
          multiline
          placeholderTextColor={Colors.SUBTEXT}
          placeholder="Describe your club"
          blurOnSubmit
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <View style={modalStyles.footer}>
          <Button onPress={() => updateClubDescription(id, description).then(onClose)}>SAVE</Button>
          <Button
            onPress={() => {
              onClose();
              setDescription(initialValue);
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
