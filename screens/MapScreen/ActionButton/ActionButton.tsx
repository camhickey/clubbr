import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import React, { useState, ReactElement } from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface OptionButtonProps {
  icon: ReactElement;
  title: string;
  active: boolean;
  onPress: () => void;
}

interface ActionButtonProps {
  options: OptionButtonProps[];
}

export function OptionButton({ icon, title, active, onPress }: OptionButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.button, styles.optionButton, !active && styles.inactive]}>
        {icon}
        <Text style={!active && { color: Colors.INACTIVE }}>{title}</Text>
      </View>
    </Pressable>
  );
}

export function ActionButton({ options }: ActionButtonProps) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Pressable onPress={() => setCollapsed(!collapsed)}>
      {!collapsed && (
        <View style={styles.buttonContainer}>
          {options.map((option, index) => {
            return <OptionButton key={index} {...option} />;
          })}
        </View>
      )}
      <View style={[styles.button, styles.actionButton, !collapsed && styles.inactive]}>
        <AntDesign
          name="plus"
          size={24}
          color={collapsed ? Colors.WHITE : Colors.INACTIVE}
          style={{ transform: [{ rotate: collapsed ? '0deg' : '45deg' }] }}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    backgroundColor: Colors.BLACK,
    borderWidth: 1,
    borderColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  inactive: {
    borderColor: Colors.INACTIVE,
  },
  actionButton: {
    width: 75,
    height: 75,
  },
  optionButton: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
});
