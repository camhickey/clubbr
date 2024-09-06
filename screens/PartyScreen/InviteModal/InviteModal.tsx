import { inviteUser } from '@actions/partyActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { SearchBar } from '@components/SearchBar';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet } from 'react-native';

export function InviteModal() {
  const { friends, username } = useProfile();
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [invited, setInvited] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  function handleInviteClick() {
    if (invitedUsers.length < 1) {
      Alert.alert('Select at least one user to invite.');
    } else {
      invitedUsers.map((user) => inviteUser(username, user));
      setInvited(true);
      setTimeout(() => {
        setInvited(false);
      }, 3000);
      setInvitedUsers([]);
    }
  }

  return (
    <ModalContainer style={styles.container}>
      <SearchBar search={search} setSearch={setSearch} placeholder="Search for friends..." />
      <FlatList
        data={friends.filter((friend) => friend.includes(search))}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                if (invitedUsers.includes(item)) {
                  setInvitedUsers(invitedUsers.filter((user) => user !== item));
                } else {
                  setInvitedUsers([...invitedUsers, item]);
                }
              }}
              style={styles.item}>
              <Text style={{ color: invitedUsers.includes(item) ? Colors.WHITE : Colors.INACTIVE }}>
                {item}
              </Text>
              {invitedUsers.includes(item) ? (
                <FontAwesome name="square" size={24} color={Colors.WHITE} />
              ) : (
                <FontAwesome name="square-o" size={24} color={Colors.INACTIVE} />
              )}
            </Pressable>
          );
        }}
        keyExtractor={(item) => item}
      />
      <View style={styles.footer}>
        {invited && <Text>Invites sent successfully!</Text>}
        <Text style={[styles.blurb, invitedUsers.length < 1 && { color: Colors.SUBTEXT }]}>
          {invitedUsers.length > 0
            ? `Invites will be sent to ${invitedUsers
                .map((user) => '@' + user)
                .slice(0, 3)
                .join(', ')} ${
                invitedUsers.length > 3 ? `and ${invitedUsers.length - 3} others` : ''
              }`
            : 'Select at least one user from the list above to invite to your party.'}
        </Text>
        <Button
          buttonStyle={{ width: '100%' }}
          onPress={() => handleInviteClick()}
          disabled={invitedUsers.length < 1}>
          INVITE
        </Button>
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  blurb: {
    textAlign: 'center',
  },
  footer: {
    gap: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
