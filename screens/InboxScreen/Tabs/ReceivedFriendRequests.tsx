import { acceptRequest, rejectRequest } from '@actions/friendActions';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { UserCard } from '@components/UserCard';
import Colors from '@constants/Colors';
import { db } from '@db';
import { AntDesign } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export function ReceivedFriendRequests() {
  const { friendRequestsReceived, setFriendRequestsReceived, username } = useProfile();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshing) {
      onSnapshot(doc(db, 'users', username), (snapshot) => {
        const data = snapshot.data();
        if (data) {
          setFriendRequestsReceived([]);
          setFriendRequestsReceived(data.friendRequestsReceived);
        }
      });
      setRefreshing(false);
    }
  }, [refreshing]);

  return (
    <Container style={styles.container}>
      {friendRequestsReceived.length === 0 && (
        <Text style={styles.blurb}>You have no received friend requests</Text>
      )}
      <FlatList
        data={friendRequestsReceived}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <UserCard
              user={item}
              key={index}
              actions={[
                {
                  icon: (
                    <AntDesign name="check" size={24} color={Colors.GREEN} style={styles.icon} />
                  ),
                  onPress: () => acceptRequest(username, item),
                },
                {
                  icon: <AntDesign name="close" size={24} color={Colors.RED} style={styles.icon} />,
                  onPress: () => rejectRequest(username, item),
                },
              ]}
              blurb="sent you a friend request"
            />
          );
        }}
        keyExtractor={(item) => item}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  blurb: {
    color: Colors.SUBTEXT,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  list: {
    gap: 20,
  },
  icon: {
    padding: 10,
  },
});
