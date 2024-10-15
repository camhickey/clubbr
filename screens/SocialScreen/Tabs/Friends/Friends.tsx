import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { UserCard } from '@components/UserCard';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

import { AddFriendModal } from './AddFriendModal';

export function Friends() {
  const { friends, setFriends } = useProfile();
  const [search, setSearch] = useState('');

  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  //Make refresh process take 5 seconds to prevent spamming
  //This is probably not a good idea
  useEffect(() => {
    setTimeout(() => {
      if (!refreshing) return;
      setFriends([]);
      setFriends(friends);
      setRefreshing(false);
    }, 5000);
  }, [refreshing]);

  //useCallback to prevent re-rendering of UserCard components
  const renderUserCard = useCallback((item: string) => <UserCard user={item} />, []);

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
          onRefresh={() => setRefreshing(true)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          data={
            search
              ? friends.filter((friend) => friend.toLowerCase().includes(search.toLowerCase()))
              : friends
          }
          renderItem={({ item }) => renderUserCard(item)}
          keyExtractor={(item) => item}
        />
      ) : (
        <Text style={styles.blurb}>
          You don't have any friends yet. Tap on the{' '}
          <Ionicons name="person-add" size={16} color={Colors.WHITE} /> to add some.
        </Text>
      )}
      <AddFriendModal
        isVisible={addFriendModalVisible}
        onClose={() => setAddFriendModalVisible(false)}
      />
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
    gap: 0,
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
    gap: 20,
    paddingHorizontal: 10,
  },
});
