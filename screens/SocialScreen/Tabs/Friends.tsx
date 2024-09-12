import { sendRequest } from '@actions/friendActions';
import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { Toast } from '@components/Toast';
import { UserCard } from '@components/UserCard';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, Pressable, StyleSheet, TextInput } from 'react-native';

export function Friends() {
  const { friends, setFriends, username } = useProfile();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [addedFriend, setAddedFriend] = useState('');
  const [addFriendToastVisible, setAddFriendToastVisible] = useState(false);

  useEffect(() => {
    if (refreshing) {
      onSnapshot(doc(db, 'users', username), (snapshot) => {
        const data = snapshot.data();
        if (data) {
          setFriends([]);
          setFriends(data.friends);
        }
      });
      setRefreshing(false);
    }
  }, [refreshing]);

  return (
    <Container>
      <View style={styles.controls}>
        <TextInput
          style={styles.search}
          onChangeText={setSearch}
          value={search}
          placeholder="Search for friends..."
          placeholderTextColor={Colors.SUBTEXT}
          autoCapitalize="none"
        />
        <Pressable style={styles.addFriendButton} onPress={() => setAddFriendModalVisible(true)}>
          <Ionicons name="person-add" size={24} color={Colors.WHITE} />
        </Pressable>
      </View>
      {friends.length !== 0 ? (
        <FlatList
          refreshing={refreshing}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={() => setRefreshing(true)}
          data={
            search
              ? friends.filter((friend) => friend.toLowerCase().includes(search.toLowerCase()))
              : friends
          }
          renderItem={({ item }) => (
            <UserCard
              user={item}
              actions={[
                {
                  icon: <AntDesign name="star" size={24} color={Colors.WHITE} />,
                  onPress: () => {},
                },
              ]}
            />
          )}
          keyExtractor={(item) => item}
        />
      ) : (
        <Text style={styles.blurb}>
          You don't have any friends yet. Tap on the{' '}
          <Ionicons name="person-add" size={16} color={Colors.WHITE} /> to add some.
        </Text>
      )}
      <CustomAlert visible={addFriendModalVisible}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.header}>Add Friend</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Enter a username..."
            placeholderTextColor={Colors.SUBTEXT}
            onChangeText={setAddedFriend}
            value={addedFriend}
            autoCapitalize="none"
          />
          <View style={modalStyles.buttonGroup}>
            <Button
              onPress={() => {
                Keyboard.dismiss();
                if (addedFriend === username) {
                  Alert.alert(
                    'Failed to send friend request',
                    'You cannot add yourself as a friend.',
                  );
                } else {
                  sendRequest(username, addedFriend)
                    .then(() => {
                      setAddFriendToastVisible(true);
                      setAddFriendModalVisible(false);
                      setAddedFriend('');
                    })
                    .catch((error) => {
                      setAddFriendModalVisible(false);
                      Alert.alert('Failed to send friend request', error.message);
                    });
                }
              }}
              disabled={!addedFriend}>
              ADD FRIEND
            </Button>
            <Button
              onPress={() => {
                setAddFriendModalVisible(false);
                setAddedFriend('');
              }}>
              CANCEL
            </Button>
          </View>
        </View>
      </CustomAlert>
      {addFriendToastVisible && (
        <Toast
          setToast={setAddFriendToastVisible}
          variant="success"
          header="Friend Request"
          message="Friend request sent successfully!"
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  blurb: {
    color: Colors.SUBTEXT,
    fontSize: 16,
    width: '80%',
    alignSelf: 'center',
  },
  controls: {
    padding: 10,
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    flex: 1,
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
  },
  addFriendButton: {
    padding: 10,
  },
  list: {
    gap: 10,
  },
});

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
