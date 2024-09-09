import { Container } from '@components/Container';
import { SearchBar } from '@components/SearchBar';
import { Text } from '@components/Text';
import { UserCard } from '@components/UserCard';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db';
import { AntDesign } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export function Friends() {
  const { friends, setFriends, username } = useProfile();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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
    <Container style={styles.container}>
      {friends.length === 0 ? (
        <Text style={styles.blurb}>
          Tap the icon at the top of your screen to send a friend request to a user.
        </Text>
      ) : (
        <View style={styles.searchBar}>
          <SearchBar search={search} setSearch={setSearch} placeholder="Search your friends..." />
        </View>
      )}
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
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
  blurb: {
    color: Colors.SUBTEXT,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  searchBar: {
    alignItems: 'center',
  },
  list: {
    gap: 10,
  },
});
