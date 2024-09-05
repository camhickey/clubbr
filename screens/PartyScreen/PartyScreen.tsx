import { createParty, leaveParty } from '@actions/partyActions';
import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { UserCard } from '@components/UserCard';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useParty } from '@hooks/useParty';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';

export function PartyScreen() {
  const navigation = useNavigation();
  const { party, username } = useProfile();
  const { partyLeader, partyName, partyMembers } = useParty();

  useEffect(() => {
    if (partyName) {
      navigation.setParams({ title: partyName });
    } else {
      navigation.setParams({ title: 'Create a Party' });
    }
  }, [partyName]);

  return (
    <Container style={styles.container}>
      {party ? (
        <View>
          {partyMembers && (
            <FlatList
              data={Object.keys(partyMembers)}
              renderItem={({ item, index }) => {
                return (
                  <UserCard
                    user={item}
                    key={index}
                    actions={
                      [
                        {
                          icon: <AntDesign name="star" size={24} color={Colors.WHITE} />,
                          onPress: () => {},
                        },
                      ]

                      /*username === partyLeader && item !== partyLeader
                        ? [
                            {
                              icon: <AntDesign name="close" size={24} color={Colors.ERROR} />,
                              onPress: () => {
                                Alert.alert(
                                  'Remove Member',
                                  `Are you sure you want to remove ${item} from the party?`,
                                  [
                                    {
                                      text: 'Cancel',
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Remove',
                                      onPress: () => {
                                        kickUser(item, party!);
                                      },
                                    },
                                  ]
                                );
                              },
                            },
                          ]
                        : []*/
                    }
                  />
                );
              }}
              keyExtractor={(item) => item}
              style={styles.list}
            />
          )}
          <View style={styles.buttonGroup}>
            <Button titleStyle={styles.buttonTitle} onPress={() => leaveParty(username, party!)}>
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
        <View style={styles.test}>
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
  test: {
    gap: 10,
    width: '75%',
  },
  partyBlurb: {
    fontSize: 16,
    color: Colors.SUBTEXT,
    textAlign: 'center',
  },
});
