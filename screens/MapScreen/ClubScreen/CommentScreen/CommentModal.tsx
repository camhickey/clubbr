import { sendComment } from '@actions/clubActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { useState } from 'react';
import { Keyboard, StyleSheet, TextInput } from 'react-native';

export type CommentModalProps = {
  clubId: string;
  isVisible: boolean;
  onClose: () => void;
};

export function CommentModal({ clubId, isVisible, onClose }: CommentModalProps) {
  const [comment, setComment] = useState('');
  const { username } = useProfile();
  const MAX_COMMENT_LENGTH = 200;
  return (
    <CustomAlert visible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.title}>Leave a comment</Text>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="Leave a comment..."
          placeholderTextColor={Colors.SUBTEXT}
          multiline
          blurOnSubmit
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <Text style={styles.blurb}>
          Characters: {comment.length}/{MAX_COMMENT_LENGTH}
        </Text>
        <View style={styles.buttonGroup}>
          <Button onPress={onClose}>CANCEL</Button>
          <Button
            onPress={() => sendComment(username, clubId, comment).then(onClose)}
            disabled={comment.length === 0}>
            SUBMIT
          </Button>
        </View>
      </View>
    </CustomAlert>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  blurb: {
    color: Colors.SUBTEXT,
  },
  input: {
    backgroundColor: Colors.INPUT,
    padding: 10,
    borderRadius: 10,
    width: 250,
    height: 100,
    color: Colors.WHITE,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
