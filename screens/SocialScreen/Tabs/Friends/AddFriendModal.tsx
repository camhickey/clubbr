import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { StyleSheet, TextInput } from 'react-native';

export type AddFriendModalProps = {
  onClose: () => void;
  onSubmit: () => void;
  friendRequestValue: string;
  setFriendRequestValue: (username: string) => void;
  visible: boolean;
};

export function AddFriendModal({
  onClose,
  onSubmit,
  visible,
  friendRequestValue,
  setFriendRequestValue,
}: AddFriendModalProps) {
  return (
    <CustomAlert visible={visible}>
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
          <Button onPress={onSubmit} disabled={!friendRequestValue}>
            ADD FRIEND
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
