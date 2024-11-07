import Colors from '@constants/Colors';
import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  contentContainer: {
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    color: Colors.SUBTEXT,
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
  },
  description: {
    fontSize: 12,
    color: Colors.SUBTEXT,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
