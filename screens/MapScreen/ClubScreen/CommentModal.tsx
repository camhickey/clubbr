import { sendComment } from '@actions/clubActions';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

export type CommentModalProps = {
  clubId: string;
  isVisible: boolean;
  onClose: () => void;
};

export function CommentModal({ clubId, isVisible, onClose }: CommentModalProps) {
  const { username } = useProfile();
  const [comment, setComment] = useState('');
  const COMMENT_CHAR_LIMIT = 200;

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.titleContainer}>
          <Text>Leave a comment</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" color={Colors.WHITE} size={22} />
          </Pressable>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.commentLength}>
            Characters: {comment.length}/{COMMENT_CHAR_LIMIT}
          </Text>
          <View style={styles.commentControls}>
            <TextInput
              placeholder="Type your comment..."
              value={comment}
              onChangeText={setComment}
              style={styles.commentBox}
              maxLength={COMMENT_CHAR_LIMIT}
              blurOnSubmit
              multiline
            />
            <Pressable
              onPress={() =>
                sendComment(username, clubId, comment)
                  .then(() => {
                    Toast.show({
                      type: 'success',
                      text1: 'Comment',
                      text2: 'Your comment has been sent!',
                    });
                    onClose();
                  })
                  .catch((error) => {
                    Toast.show({
                      type: 'error',
                      text1: 'Error',
                      text2: error,
                    });
                  })
              }
              style={styles.sendButton}>
              <Ionicons
                name="send"
                size={24}
                color={comment.length === 0 ? Colors.INACTIVE : Colors.WHITE}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    height: '75%',
    width: '100%',
    borderColor: Colors.WHITE,
    borderBottomWidth: 0,
    borderWidth: 1,
    position: 'absolute',
    paddingHorizontal: 20,
    bottom: 0,
  },
  titleContainer: {
    height: '15%',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    width: '100%',
  },
  commentLength: {
    color: Colors.INACTIVE,
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  commentControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  commentBox: {
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
    alignSelf: 'center',
    width: '100%',
  },
  sendButton: {
    padding: 5,
  },
});
