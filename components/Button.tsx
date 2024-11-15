import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import React, { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export interface ButtonProps {
  children?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export function Button({ children, onPress, disabled, buttonStyle, titleStyle }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        { opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}
      onPress={onPress}>
      <Text style={[styles.title, titleStyle, disabled && { opacity: 0.5 }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: Colors.WHITE,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
});
