import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

export interface Option {
  text: string;
  onPress: () => void;
  active: boolean;
}

export function MapFilter() {
  const OPTIONS = [
    { text: 'Clubs', onPress: () => {}, active: false },
    { text: 'Safety', onPress: () => {}, active: false },
    { text: 'Parties', onPress: () => {}, active: false },
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {OPTIONS.map((option: Option, index) => (
        <Pressable
          style={[styles.vibe, option.active && { borderColor: Colors.WHITE }]}
          key={index}
          onPress={option.onPress}>
          <Text style={!option.active && { color: Colors.INACTIVE }}>{option.text}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  vibe: {
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: Colors.BLACK,
    borderWidth: 1,
    borderColor: Colors.INACTIVE,
    alignItems: 'center',
    width: 100,
  },
  inactive: {
    borderColor: Colors.INACTIVE,
  },
});
