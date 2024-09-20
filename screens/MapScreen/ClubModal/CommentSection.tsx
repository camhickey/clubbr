import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { arrayRemove, arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { CommentModal } from './CommentModal';

interface CommentSectionProps {
  clubId: string;
}

interface Comment {
  id: string;
  likes: string[];
  text: string;
  timestamp: Date;
  user: string;
}

export function CommentSection({ clubId }: CommentSectionProps) {
  const { username } = useProfile();
  const navigation = useNavigation();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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
    setLoading(true);
    setComments([]);
    fetchComments().then(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          comments
            .sort((a, b) => b.likes.length - a.likes.length)
            .map((comment, index) => (
              <View key={index} style={styles.commentContainer}>
                <Text
                  onPress={() =>
                    comment.user === username
                      ? navigation.navigate('Root', { screen: 'Social' })
                      : navigation.navigate('UserModal', {
                          title: comment.user,
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
                        prev.map((c) =>
                          c.id === comment.id
                            ? {
                                ...c,
                                likes: c.likes.includes(username)
                                  ? c.likes.filter((like) => like !== username)
                                  : [...c.likes, username],
                              }
                            : c,
                        ),
                      );
                      updateDoc(doc(db, 'clubs', clubId, 'comments', comment.id), {
                        likes: comment.likes.includes(username)
                          ? arrayRemove(username)
                          : arrayUnion(username),
                      });
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
            ))
        )}
      </ScrollView>
      <CommentModal
        clubId={clubId}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {/*Probably add the ability to sort by likes or recency*/}
      <Pressable onPress={() => setModalVisible(true)} style={styles.commentButton}>
        <Text>Leave a comment</Text>
        <FontAwesome name="comment" size={18} color={Colors.WHITE} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
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
});
