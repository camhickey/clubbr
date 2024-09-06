import { Container } from '@components/Container';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import React from 'react';
import { StyleSheet } from 'react-native';

export function SafetyScreen() {
  return (
    <Container style={styles.container}>
      <Text style={styles.disclaimer}>
        {' '}
        If you experience or witness illegal activity, call 911 immediately. This is not a subsitute
        for emergency services.{' '}
      </Text>
    </Container>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  disclaimer: {
    color: Colors.SUBTEXT,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
