import { submitSafetyReport } from '@actions/safetyActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';

export function SafetyReportModal({ route }: any) {
  const { latitude, longitude } = route.params;
  const { username } = useProfile();
  const navigation = useNavigation();

  const [description, setDescription] = useState('');
  const DESCRIPTION_CHAR_LIMIT = 200;

  return (
    <ModalContainer>
      <Text style={styles.descriptionLength}>
        Characters: {description.length}/{DESCRIPTION_CHAR_LIMIT}
      </Text>
      <TextInput
        style={styles.commentBox}
        maxLength={DESCRIPTION_CHAR_LIMIT}
        placeholder="Describe the incident"
        placeholderTextColor={Colors.SUBTEXT}
        multiline
        blurOnSubmit
        value={description}
        onChangeText={setDescription}
      />
      <Button
        buttonStyle={styles.submitButton}
        onPress={() =>
          submitSafetyReport(username, description, latitude, longitude)
            .then(() => {
              Alert.alert('Safety report submitted!');
              navigation.goBack();
            })
            .catch((error) => {
              Alert.alert('Error submitting safety report', error.message);
            })
        }
        disabled={description.length === 0}>
        SUBMIT
      </Button>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  descriptionLength: {
    color: Colors.SUBTEXT,
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  commentBox: {
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
    alignSelf: 'center',
    width: '100%',
  },
  submitButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
});
