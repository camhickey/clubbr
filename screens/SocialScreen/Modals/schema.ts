import * as yup from 'yup';

export const addFriendSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be at most 15 characters')
    .matches(/^[a-zA-Z0-9_]*$/, 'Usernames can only contain letters, numbers, and underscores')
    .required('Enter a username'),
});
