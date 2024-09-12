import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be at most 15 characters')
    .matches(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores')
    .required('Enter a username'),
  displayName: yup
    .string()
    .min(1, 'Display name must be at least 1 character')
    .max(15, 'Display name must be at most 15 characters')
    .matches(/^[a-zA-Z0-9_]*$/, 'Display name can only contain letters, numbers, and underscores')
    .required('Enter a display name'),
  email: yup.string().email('Enter a valid email').required('Enter a valid email'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      'Passwords must be at least 8 characters and contain at least one uppercase letter, one lowercase letter and one number',
    )
    .required('Enter a password'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Passwords must match'),
});
