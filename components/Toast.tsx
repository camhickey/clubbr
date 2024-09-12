import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export type ToastProps = {
  setToast: Dispatch<SetStateAction<boolean>>;
  header?: string;
  message?: string;
  variant?: 'success' | 'error' | 'warning';
};

export function Toast({ setToast, header, message, variant }: ToastProps) {
  const bottom = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  function animate() {
    Animated.timing(bottom, {
      toValue: 20,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      Animated.delay(2000).start(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          setToast(false);
        });
      });
    });
  }

  useEffect(() => {
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom, opacity },
        variant === 'success' && { borderColor: Colors.GREEN },
        variant === 'error' && { borderColor: Colors.RED },
        variant === 'warning' && { borderColor: Colors.ORANGE },
      ]}>
      <View>
        <Text style={styles.header}>{header}</Text>
        <Text>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.BLACK,
    position: 'absolute',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  header: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});
