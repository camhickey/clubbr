import { Container } from '@components/Container';
import React from 'react';
import { StyleSheet } from 'react-native';

export function SafetyScreen() {
  return <Container style={styles.container} />;
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
