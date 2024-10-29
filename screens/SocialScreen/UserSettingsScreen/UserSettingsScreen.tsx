import { Container } from '@components/Container';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

type ItemProps = {
  title: string;
  onClick: () => void;
};

function Item({ title, onClick }: ItemProps) {
  return (
    <Text style={styles.item} onPress={onClick}>
      {title}
    </Text>
  );
}

export function UserSettingsScreen() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [items, setItems] = useState([
    { title: 'Log Out', onClick: () => auth.signOut() },
    { title: 'Reset Password', onClick: () => navigation.navigate('ResetPasswordScreen') },
  ]);

  return (
    <Container>
      <FlatList
        data={items}
        renderItem={({ item }) => <Item title={item.title} onClick={item.onClick} />}
        keyExtractor={(item) => item.title}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  //just messing with styles
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold',
    backgroundColor: Colors.INPUT,
    borderWidth: 2,
    borderColor: Colors.INACTIVE,
    borderRadius: 10,
  },
});
