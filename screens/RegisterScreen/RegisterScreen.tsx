import { Button } from '@components/Button';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { DEFAULT_PFP } from '@constants/profile';
import { db } from '@db';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { registerSchema } from './schema';

export function RegisterScreen() {
  const auth = getAuth();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const [focusedField, setFocusedField] = useState<
    'username' | 'displayName' | 'email' | 'password' | 'confirmPassword' | null
  >(null);

  const formState = watch();

  function onSubmit() {
    getDoc(doc(db, 'users', formState.username.toLowerCase()))
      .then((userDoc) => {
        if (userDoc.exists()) {
          Alert.alert('This username is already taken.');
        } else {
          createUserWithEmailAndPassword(auth, formState.email, formState.password)
            .then(async (userCredentials: { user: any }) => {
              const user = userCredentials.user;
              if (user.emailVerified) {
                Alert.alert('There is already a user associated with this email address.');
              }
              sendEmailVerification(user);
              Alert.alert(
                `A verification email has been sent to ${formState.email}. Once verified, you may log in with the email and password you just entered.`,
              );
              await setDoc(doc(db, 'usernames', user.uid), {
                [user.uid]: formState.username.toLowerCase(),
              });
              await setDoc(doc(db, 'users', formState.username.toLowerCase()), {
                displayName: formState.displayName,
                email: formState.email,
                clubs: [],
                friendRequestsReceived: [],
                friendRequestsPending: [],
                friends: [],
                party: '',
                invites: [],
                photoURL: DEFAULT_PFP,
                username: formState.username.toLowerCase(),
                userId: user?.uid,
              });
            })
            .then(() => {
              auth.signOut();
              navigation.navigate('Login');
            })
            .catch((error: { message: any }) => Alert.alert(error.message));
        }
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }

  return (
    <Container style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <SafeAreaView style={styles.inputContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onBlur, value } }) => (
              <TextInput
                placeholder="Username"
                placeholderTextColor={Colors.INACTIVE}
                style={[styles.input, errors.username && { borderBottomColor: Colors.RED }]}
                onFocus={() => setFocusedField('username')}
                onBlur={onBlur}
                onChange={(e) => setValue('username', e.nativeEvent.text, { shouldValidate: true })}
                value={value}
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
            name="username"
          />
          {errors.username && focusedField === 'username' && (
            <Text style={styles.error}>{errors.username.message}</Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onBlur, value } }) => (
              <TextInput
                placeholder="Display name"
                placeholderTextColor={Colors.INACTIVE}
                style={[styles.input, errors.displayName && { borderBottomColor: Colors.RED }]}
                onFocus={() => setFocusedField('displayName')}
                onBlur={onBlur}
                onChange={(e) =>
                  setValue('displayName', e.nativeEvent.text, { shouldValidate: true })
                }
                value={value}
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
            name="displayName"
          />
          {errors.displayName && focusedField === 'displayName' && (
            <Text style={styles.error}>{errors.displayName.message}</Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onBlur, value } }) => (
              <TextInput
                placeholder="Email"
                placeholderTextColor={Colors.INACTIVE}
                style={[styles.input, errors.email && { borderBottomColor: Colors.RED }]}
                onFocus={() => setFocusedField('email')}
                onBlur={onBlur}
                onChange={(e) => setValue('email', e.nativeEvent.text, { shouldValidate: true })}
                value={value}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
            name="email"
          />
          {errors.email && focusedField === 'email' && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
          <Controller
            control={control}
            render={({ field: { onBlur, value } }) => (
              <TextInput
                placeholder="Password"
                placeholderTextColor={Colors.INACTIVE}
                style={[styles.input, errors.password && { borderBottomColor: Colors.RED }]}
                onFocus={() => setFocusedField('password')}
                onBlur={onBlur}
                onChange={(e) => setValue('password', e.nativeEvent.text, { shouldValidate: true })}
                value={value}
                secureTextEntry
              />
            )}
            name="password"
          />
          {errors.password && focusedField === 'password' && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
          <Controller
            control={control}
            render={({ field: { onBlur, value } }) => (
              <TextInput
                placeholder="Confirm password"
                placeholderTextColor={Colors.INACTIVE}
                style={[styles.input, errors.confirmPassword && { borderBottomColor: Colors.RED }]}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={onBlur}
                onChange={(e) =>
                  setValue('confirmPassword', e.nativeEvent.text, { shouldValidate: true })
                }
                value={value}
                secureTextEntry
              />
            )}
            name="confirmPassword"
          />
          {errors.confirmPassword && focusedField === 'confirmPassword' && (
            <Text style={styles.error}>{errors.confirmPassword.message}</Text>
          )}
          <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
            REGISTER
          </Button>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Already have an account? Sign in <Text style={{ fontWeight: 'bold' }}>here.</Text>
          </Text>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
    gap: 20,
  },
  error: {
    color: Colors.RED,
    textAlign: 'center',
    fontSize: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: Colors.WHITE,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    paddingVertical: 10,
  },
});
