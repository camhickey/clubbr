import { Container } from '@components/Container';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet } from 'react-native';

export function SafetyScreen() {
  return (
    <Container style={styles.container}>
      <Text style={styles.disclaimer}>
        If you experience or witness illegal activity, call 911 immediately. This is not a subsitute
        for emergency services.
      </Text>
      <Text>
        - If you see something unsafe or concerning that other users should be aware of, you can set
        a marker for eveyrone else to see.
      </Text>
      <Text>
        - Go to your map and long press on the approximate location of the incident. You can give
        information about the incident on the next screen.
      </Text>
      <Text>
        - Click the "Submit" button and your marker will now be visible on the map with a{' '}
        <FontAwesome name="exclamation-triangle" size={12} color={Colors.ORANGE} /> icon. Markers
        are only visible for 12 hours.
      </Text>
      <Text>
        - In order to see safety markers, tap the{' '}
        <AntDesign name="plus" size={12} color={Colors.WHITE} /> button on your map and then tap the
        "Safety" button that pops up.
      </Text>
      <Text>
        - You can tap safety markers on your map in order to see the information that was submitted.
      </Text>
    </Container>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
  disclaimer: {
    color: Colors.SUBTEXT,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
