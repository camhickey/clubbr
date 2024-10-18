import { sendRequest } from '@actions/friendActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db*';
import { useProfile } from '@hooks/useProfile';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

export type AddFriendModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function AddFriendModal({ isVisible, onClose }: AddFriendModalProps) {
  const { username, friends } = useProfile();
  const [friendRequestValue, setFriendRequestValue] = useState('');
  useEffect(() => {
    setFriendRequestValue('');
  }, [isVisible]);

  return (
    <CustomAlert visible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.header}>Add Friend</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a username..."
          placeholderTextColor={Colors.SUBTEXT}
          onChangeText={setFriendRequestValue}
          value={friendRequestValue}
          autoCapitalize="none"
        />
        <View style={styles.buttonGroup}>
          <Button
            onPress={async () => {
              Keyboard.dismiss();
              if (friendRequestValue === username) {
                Toast.show({
                  type: 'error',
                  text1: 'Friend request not sent',
                  text2: "You can't add yourself as a friend",
                });
                return;
              }
              if (friends.includes(friendRequestValue)) {
                Toast.show({
                  type: 'error',
                  text1: 'Friend request not sent',
                  text2: `@${friendRequestValue} is already your friend`,
                });
                return;
              }
              const userDoc = await getDoc(doc(db, 'users', friendRequestValue));
              if (!userDoc.exists()) {
                Toast.show({
                  type: 'error',
                  text1: 'Friend request not sent',
                  text2: 'User does not exist',
                });
                return;
              }
              await sendRequest(username, friendRequestValue);
              Toast.show({
                type: 'success',
                text1: 'Friend request sent!',
                text2: `Friend request sent to @${friendRequestValue} successfully!`,
              });
            }}
            disabled={!friendRequestValue}>
            ADD FRIEND
          </Button>
          <Button onPress={onClose}>CLOSE</Button>
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
    alignSelf: 'center',
  },
  input: {
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
});
