import { ClubCard } from '@components/ClubCard';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput } from 'react-native';

export function Clubs() {
  const { setClubs, clubs } = useProfile();
  const [search, setSearch] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!refreshing) return;
      setClubs([]);
      setClubs(clubs);
      setRefreshing(false);
    }, 5000);
  }, [refreshing]);

  const renderClubCard = useCallback((item: string) => <ClubCard id={item} />, []);

  return (
    <Container style={styles.container}>
      {clubs.length === 0 ? (
        <Text style={styles.blurb}>
          Find clubs on the map and go to their page to follow them. Then, they'll end up here in
          the future.
        </Text>
      ) : (
        <TextInput
          style={styles.search}
          onChangeText={setSearch}
          value={search}
          placeholder="Search for clubs..."
          placeholderTextColor={Colors.SUBTEXT}
          autoCapitalize="none"
        />
      )}
      <FlatList
        refreshing={refreshing}
        onRefresh={() => setRefreshing(true)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        data={
          search ? clubs.filter((club) => club.toLowerCase().includes(search.toLowerCase())) : clubs
        }
        renderItem={({ item }) => renderClubCard(item)}
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
  search: {
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
    width: '100%',
  },
  list: {
    gap: 20,
    paddingHorizontal: 10,
  },
});
