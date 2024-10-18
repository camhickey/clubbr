import { inviteUsers } from '@actions/partyActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

export function InviteModal() {
  const { friends, username } = useProfile();
  const navigation = useNavigation();
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  return (
    <ModalContainer style={styles.container}>
      <TextInput
        style={styles.search}
        onChangeText={setSearch}
        value={search}
        placeholder="Search for friends..."
        placeholderTextColor={Colors.SUBTEXT}
        autoCapitalize="none"
      />
      <FlatList
        data={friends.filter((friend) => friend.includes(search))}
        showsVerticalScrollIndicator={false}
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
        <Text style={[styles.blurb, invitedUsers.length === 0 && { color: Colors.SUBTEXT }]}>
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
          buttonStyle={styles.inviteButton}
          onPress={() =>
            inviteUsers(username, invitedUsers)
              .then(() => {
                Toast.show({
                  text1: 'Invites sent',
                  text2: 'Your friends have been invited to your party!',
                  type: 'success',
                });
                navigation.goBack();
              })
              .catch((error) => {
                Toast.show({
                  text1: 'Error',
                  text2: error.message,
                  type: 'error',
                });
              })
          }
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
  search: {
    width: '100%',
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
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
  inviteButton: {
    width: '100%',
  },
});
