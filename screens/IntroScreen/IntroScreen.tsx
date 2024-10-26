import { Button } from '@components/Button';
import { Container } from '@components/Container';
import Colors from '@constants/Colors';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

export function IntroScreen() {
  const navigation = useNavigation();
  return (
    <Container style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/images/clubbr.png')} />
      <Button buttonStyle={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
        LOGIN
      </Button>
      <Button buttonStyle={styles.button} onPress={() => navigation.navigate('RegisterScreen')}>
        REGISTER
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  logo: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
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
