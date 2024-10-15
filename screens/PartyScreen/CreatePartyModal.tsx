import { createParty } from '@actions/partyActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { useState } from 'react';
import { Keyboard, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

export type CreatePartyModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function CreatePartyModal({ isVisible, onClose }: CreatePartyModalProps) {
  const [partyName, setPartyName] = useState('');
  const { username } = useProfile();

  return (
    <CustomAlert visible={isVisible}>
      <View style={modalStyles.container}>
        <Text style={modalStyles.header}>Create Party</Text>
        <TextInput
          style={modalStyles.input}
          placeholder="Enter a name for your party..."
          placeholderTextColor={Colors.SUBTEXT}
          onChangeText={setPartyName}
          value={partyName}
          autoCapitalize="none"
        />
        <View style={modalStyles.buttonGroup}>
          <Button
            onPress={() => {
              Keyboard.dismiss();
              createParty(username, partyName)
                .then(onClose)
                .catch((error) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Failed to create party',
                    text2: error.message,
                  });
                });
            }}
            disabled={!partyName}>
            CREATE
          </Button>
          <Button onPress={onClose}>CANCEL</Button>
        </View>
      </View>
    </CustomAlert>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
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
    justifyContent: 'space-around',
  },
});
