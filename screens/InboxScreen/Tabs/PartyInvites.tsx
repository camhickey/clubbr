import { acceptInvite, getParty, rejectInvite } from '@actions/partyActions';
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

export function PartyInvites() {
  const { invites, setInvites, username } = useProfile();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshing) {
      onSnapshot(doc(db, 'users', username), (snapshot) => {
        const data = snapshot.data();
        if (data) {
          setInvites([]);
          setInvites(data.invites);
        }
      });
      setRefreshing(false);
    }
  }, [refreshing]);

  return (
    <Container style={styles.container}>
      {invites.length === 0 && <Text style={styles.blurb}>You have no party invites</Text>}
      <FlatList
        data={invites}
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
                  onPress: async () => acceptInvite(username, await getParty(item)),
                },
                {
                  icon: <AntDesign name="close" size={24} color={Colors.RED} style={styles.icon} />,
                  onPress: () => rejectInvite(username, item),
                },
              ]}
              blurb="invited you to their party"
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
