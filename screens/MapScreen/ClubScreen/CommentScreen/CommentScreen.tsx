import { likeComment, unlikeComment } from '@actions/clubActions';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { db } from '@db*';
import { FontAwesome } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export type Comment = {
  id: string;
  likes: string[];
  text: string;
  timestamp: Date;
  user: string;
};

export function CommentScreen({ route }: any) {
  const { clubId } = route.params;
  const { username } = useProfile();
  const navigation = useNavigation();
  const [comments, setComments] = useState<Comment[]>([]);
  async function fetchComments() {
    const querySnapshot = await getDocs(collection(db, 'clubs', clubId, 'comments'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      setComments((prev) => [
        ...prev,
        {
          id: doc.id,
          likes: data.likes,
          text: data.text,
          timestamp: data.timestamp.toDate(),
          user: data.user,
        },
      ]);
    });
  }

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <ModalContainer style={styles.container}>
      <ScrollView automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
        {comments
          .sort((a, b) => b.likes.length - a.likes.length)
          .map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text
                onPress={() =>
                  comment.user === username
                    ? navigation.navigate('Root', { screen: 'Social' })
                    : navigation.navigate('UserScreen', {
                        user: comment.user,
                      })
                }>
                {comment.user}
              </Text>
              <Text style={styles.comment}>{comment.text}</Text>
              <View style={styles.commentControlsContainer}>
                <Pressable
                  style={styles.likeButton}
                  onPress={() => {
                    // Update the likes array in the comment state???
                    //i do not like this
                    setComments((prev) =>
                      prev.map((comment) =>
                        comment.id === comment.id
                          ? {
                              ...comment,
                              likes: comment.likes.includes(username)
                                ? comment.likes.filter((like) => like !== username)
                                : [...comment.likes, username],
                            }
                          : comment,
                      ),
                    );
                    comment.likes.includes(username)
                      ? unlikeComment(username, clubId, comment.id)
                      : likeComment(username, clubId, comment.id);
                  }}>
                  {comment.likes.includes(username) ? (
                    <FontAwesome name="heart" size={14} color={Colors.WHITE} />
                  ) : (
                    <FontAwesome name="heart-o" size={14} color={Colors.WHITE} />
                  )}
                </Pressable>
                <Text style={styles.likes}>{comment.likes.length}</Text>
              </View>
            </View>
          ))}
      </ScrollView>
      <KeyboardAvoidingView>
      <TextInput style={styles.input} placeholder="Leave a comment..."
          placeholderTextColor={Colors.SUBTEXT}
      
      />
      </KeyboardAvoidingView>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  commentContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
  },
  comment: {
    flex: 1,
    flexWrap: 'wrap',
  },
  commentControlsContainer: {
    marginLeft: 'auto',
    alignItems: 'center',
  },
  likeButton: {
    padding: 5,
  },
  likes: {
    fontSize: 10,
  },
  commentButton: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  input: {
    backgroundColor: Colors.INPUT,
    borderRadius: 5,
    padding: 10,
    color: Colors.WHITE,
    marginTop: 10,

  },
});
