import { ClubCard } from '@components/ClubCard';
import { Container } from '@components/Container';
import { SearchBar } from '@components/SearchBar';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db';
import { useProfile } from '@hooks/useProfile';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export function Clubs() {
  const { clubs, setClubs, username } = useProfile();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshing) {
      onSnapshot(doc(db, 'users', username), (snapshot) => {
        const data = snapshot.data();
        if (data) {
          setClubs([]);
          setClubs(data.clubs);
        }
      });
      setRefreshing(false);
    }
  }, [refreshing]);

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
        refreshing={refreshing}
        onRefresh={() => setRefreshing(true)}
        data={
          search ? clubs.filter((club) => club.toLowerCase().includes(search.toLowerCase())) : clubs
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ClubCard id={item} />
          </View>
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
  item: {
    marginVertical: 5,
  },
});
