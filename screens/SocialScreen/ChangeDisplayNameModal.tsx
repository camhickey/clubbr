import { changeDisplayName } from '@actions/userActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { useState } from 'react';
import { Keyboard, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

export type ChangeDisplayNameModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function ChangeDisplayNameModal({ isVisible, onClose }: ChangeDisplayNameModalProps) {
  const [newDisplayName, setNewDisplayName] = useState('');

  const { username } = useProfile();
  return (
    <CustomAlert visible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.header}>Change Display Name</Text>
        {/*Enforce regex*/}
        <TextInput
          style={styles.input}
          placeholder="Enter your new display name..."
          placeholderTextColor={Colors.SUBTEXT}
          onChangeText={setNewDisplayName}
          value={newDisplayName}
          autoCapitalize="none"
          multiline
          blurOnSubmit
          maxLength={15}
        />
        <View style={styles.buttonGroup}>
          <Button
            disabled={!newDisplayName}
            onPress={() => {
              Keyboard.dismiss();
              changeDisplayName(username, newDisplayName)
                .then(() => {
                  Toast.show({
                    type: 'success',
                    text1: 'Display Name',
                    text2: 'Your display name has been updated!',
                  });
                })
                .catch((error) =>
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error,
                  }),
                );
            }}>
            SAVE
          </Button>
          <Button onPress={onClose}>CANCEL</Button>
        </View>
      </View>
    </CustomAlert>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: Colors.WHITE,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
