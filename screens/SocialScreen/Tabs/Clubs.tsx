import { ClubCard } from '@components/ClubCard';
import { Container } from '@components/Container';
import { SearchBar } from '@components/SearchBar';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export function Clubs() {
  const { clubs } = useProfile();
  const [search, setSearch] = useState('');

  return (
    <Container style={styles.container}>
      {clubs.length === 0 ? (
        <Text style={styles.blurb}>
          Find clubs on the map and go to their page to follow them. Then, they'll end up here in
          the future.
        </Text>
      ) : (
        <View style={styles.searchBar}>
          {/*Searching on ID rather than name*/}
          <SearchBar search={search} setSearch={setSearch} placeholder="Search for clubs..." />
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        data={
          search ? clubs.filter((club) => club.toLowerCase().includes(search.toLowerCase())) : clubs
        }
        renderItem={({ item }) => <ClubCard id={item} />}
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
    gap: 20,
    paddingHorizontal: 10,
  },
});
