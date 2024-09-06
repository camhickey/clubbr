import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/core';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resetPasswordSchema } from './schema';

export function ResetPasswordScreen() {
  const auth = getAuth();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const formState = watch();

  function onSubmit() {
    formState.email &&
      sendPasswordResetEmail(auth, formState.email)
        .then(() => {
          alert(
            `An email has been sent to ${formState.email} with instructions to reset your password. If the email has not shown up after 10 minutes, check your spam folder or try again.`,
          );
          navigation.navigate('Login');
        })
        .catch((error) => {
          alert(error.message);
        });
  }

  return (
    <Container style={styles.container}>
      <SafeAreaView style={styles.inputContainer}>
        <Text style={{ textAlign: 'center', marginVertical: 10 }}>
          Enter the email address of your clubbr account and click "Reset Password." If it is a
          valid address, you will be sent an email to reset your password.
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, value } }) => (
            <TextInput
              placeholder="Email"
              placeholderTextColor={Colors.SUBTEXT}
              style={[styles.input, errors.email && { borderBottomColor: Colors.RED }]}
              onBlur={onBlur}
              onChange={(e) => setValue('email', e.nativeEvent.text, { shouldValidate: true })}
              value={value}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
          RESET PASSWORD
        </Button>
      </SafeAreaView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  error: {
    textAlign: 'center',
    color: Colors.RED,
    marginBottom: 10,
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
