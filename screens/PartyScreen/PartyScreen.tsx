import { createParty, kickUser, leaveParty, disbandParty } from '@actions/partyActions';
import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { UserCard } from '@components/UserCard';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useParty } from '@hooks/useParty';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { Alert, FlatList, StyleSheet } from 'react-native';

export function PartyScreen() {
  const navigation = useNavigation();
  const { party, username } = useProfile();
  const { partyLeader, partyName, partyMembers } = useParty();

  return (
    <Container style={styles.container}>
      {party ? (
        <View>
          <Text style={styles.partyName}>{partyName}</Text>
          {partyMembers && (
            <FlatList
              data={Object.keys(partyMembers)}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.partyMember}>
                  <UserCard
                    user={item}
                    key={index}
                    actions={
                      username === partyLeader && item !== partyLeader
                        ? [
                            {
                              icon: <Ionicons name="close" size={24} color={Colors.ERROR} />,
                              onPress: () => kickUser(item, party),
                            },
                          ]
                        : []
                    }
                  />
                  </View>
                );
              }}
              keyExtractor={(item) => item}
              style={styles.list}
            />
          )}
          <View style={styles.buttonGroup}>
            <Button titleStyle={styles.buttonTitle} onPress={() => 
              partyLeader === username ? disbandParty(username) : leaveParty(username, party)
            }>
              LEAVE PARTY
            </Button>
            {username === partyLeader && (
              <Button titleStyle={styles.buttonTitle} onPress={() => alert('make a poll idk')}>
                PARTY ACTIONS
              </Button>
            )}
            <Button
              titleStyle={styles.buttonTitle}
              onPress={() => navigation.navigate('InviteModal')}>
              INVITE FRIENDS
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.createParty}>
          <Button
            onPress={() =>
              Alert.prompt('Enter a name for your party', 'Party Name', (text) =>
                createParty(username, text),
              )
            }>
            CREATE PARTY
          </Button>
          <Text style={styles.partyBlurb}>
            Press "Create Party" and invite your friends so you can keep tabs on each other through
            the night.
          </Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
    marginVertical: 10,
  },
  partyMember: {
    marginVertical: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  buttonTitle: {
    fontSize: 10,
  },
  list: {
    padding: 10,
  },
  createParty: {
    gap: 10,
    width: '75%',
  },
  partyBlurb: {
    fontSize: 16,
    color: Colors.SUBTEXT,
    textAlign: 'center',
  },
});
