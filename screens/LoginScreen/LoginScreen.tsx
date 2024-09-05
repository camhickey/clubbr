import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { loginSchema } from './schema';

export function LoginScreen() {
  const auth = getAuth();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const formState = watch();

  function onSubmit() {
    //feel like i shouldn't have to check this
    formState.email &&
      formState.password &&
      signInWithEmailAndPassword(auth, formState.email, formState.password).then(async () => {
        const user = auth.currentUser;
        if (user?.emailVerified) {
          navigation.navigate('StartupScreen');
        } else {
          auth.signOut();
          alert(
            'This email has not been verified. Check your email and click the link to verify your email to sign in. If you need another registration email, register with your email again.',
          );
        }
      });
  }

  return (
    <Container style={styles.container}>
      <SafeAreaView style={{ width: '80%' }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, value } }) => (
            <TextInput
              placeholder="Email"
              placeholderTextColor={Colors.SUBTEXT}
              style={[styles.input, errors.email && { borderBottomColor: Colors.ERROR }]}
              onFocus={() => setFocusedField('email')}
              onBlur={onBlur}
              onChange={(e) => setValue('email', e.nativeEvent.text, { shouldValidate: true })}
              value={value}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && focusedField === 'email' && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, value } }) => (
            <TextInput
              placeholder="Password"
              placeholderTextColor={Colors.SUBTEXT}
              style={[styles.input, errors.password && { borderBottomColor: Colors.ERROR }]}
              onFocus={() => setFocusedField('password')}
              onBlur={onBlur}
              onChange={(e) => setValue('password', e.nativeEvent.text, { shouldValidate: true })}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && focusedField === 'password' && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
        <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
          LOGIN
        </Button>
        <Pressable onPress={() => navigation.navigate('Register')} style={{ marginVertical: 20 }}>
          <Text style={{ textAlign: 'center' }}>
            Don't have an account? Create one <Text style={{ fontWeight: 'bold' }}>here.</Text>
          </Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={{ textAlign: 'center' }}>Forgot password?</Text>
        </Pressable>
      </SafeAreaView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    textAlign: 'center',
    color: Colors.ERROR,
    marginVertical: 10,
    fontSize: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    color: Colors.WHITE,
    textAlign: 'center',
  },
});
