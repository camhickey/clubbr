import { sendRequest } from '@actions/friendActions';
import { Button } from '@components/Button';
import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProfile } from '@hooks/useProfile';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput } from 'react-native';

import { addFriendSchema } from './schema';

export function AddFriendModal() {
  const { username } = useProfile();
  const {
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(addFriendSchema),
  });

  const formState = watch();

  return (
    <ModalContainer style={styles.container}>
      <Controller
        control={control}
        name="username"
        render={({ field: { onBlur, value } }) => (
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter a username"
            placeholderTextColor={Colors.SUBTEXT}
            style={[styles.search, errors.username && { borderBottomColor: Colors.RED }]}
            onBlur={onBlur}
            onChange={(e) => setValue('username', e.nativeEvent.text, { shouldValidate: true })}
            value={value}
          />
        )}
      />
      <Button
        onPress={() =>
          sendRequest(username, formState.username.toLowerCase()).then(() =>
            setValue('username', ''),
          )
        }
        disabled={!isValid}>
        ADD FRIEND
      </Button>
      {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  search: {
    width: '100%',
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
  },
  error: {
    fontSize: 12,
    color: Colors.RED,
    textAlign: 'center',
  },
});
