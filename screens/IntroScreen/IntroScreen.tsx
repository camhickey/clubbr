import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';

export function IntroScreen() {
  const navigation = useNavigation();
  return (
    <Container style={styles.container}>
      <Text style={styles.header}>clubbr</Text>
      <Button buttonStyle={styles.button} onPress={() => navigation.navigate('Login')}>
        LOGIN
      </Button>
      <Button buttonStyle={styles.button} onPress={() => navigation.navigate('Register')}>
        REGISTER
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 75,
    color: Colors.WHITE,
    textAlign: 'center',
    padding: 20,
  },
  button: {
    alignSelf: 'center',
    width: '75%',
    marginVertical: 10,
  },
});
