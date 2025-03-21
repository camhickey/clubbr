import { disbandParty, kickUser, leaveParty } from '@actions/partyActions';
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
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';

import { CreatePartyModal } from './CreatePartyModal';

export function PartyScreen() {
  const { party, username } = useProfile();
  const { partyLeader, partyName, partyMembers } = useParty();
  const navigation = useNavigation();

  const [createPartyModalVisible, setCreatePartyModalVisible] = useState(false);

  //iffy
  useEffect(() => {
    navigation.setOptions({ title: party !== '' ? partyName : 'Party Screen' });
  }, [partyName, party]);

  return (
    <Container style={styles.container}>
      {party ? (
        <View>
          {partyMembers && (
            <FlatList
              data={Object.keys(partyMembers)}
              contentContainerStyle={styles.memberList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <UserCard
                    user={item}
                    key={index}
                    actions={
                      username === partyLeader && item !== partyLeader
                        ? [
                            {
                              icon: <Ionicons name="close" size={24} color={Colors.RED} />,
                              onPress: () =>
                                Alert.alert(
                                  'Kick User',
                                  `Are you sure you want to kick ${item} from the party?`,
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () => {},
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Yes',
                                      onPress: () => kickUser(item, party),
                                    },
                                  ],
                                ),
                            },
                          ]
                        : []
                    }
                  />
                );
              }}
              keyExtractor={(item) => item}
            />
          )}
          <View style={styles.buttonGroup}>
            <Button
              titleStyle={styles.buttonTitle}
              onPress={() =>
                partyLeader === username
                  ? Alert.alert('Disband Party', 'Are you sure you want to disband the party?', [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: () => disbandParty(username),
                      },
                    ])
                  : Alert.alert('Leave Party', 'Are you sure you want to leave the party?', [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: () => leaveParty(username, party),
                      },
                    ])
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
              onPress={() => navigation.navigate('InviteScreen')}>
              INVITE FRIENDS
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.createParty}>
          <Button onPress={() => setCreatePartyModalVisible(true)}>CREATE PARTY</Button>
          <Text style={styles.partyBlurb}>
            Press "Create Party" and invite your friends so you can keep tabs on each other through
            the night.
          </Text>
        </View>
      )}
      <CreatePartyModal
        isVisible={createPartyModalVisible}
        onClose={() => setCreatePartyModalVisible(false)}
      />
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
  memberList: {
    gap: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  buttonTitle: {
    fontSize: 10,
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
