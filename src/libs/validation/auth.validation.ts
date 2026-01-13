import * as yup from 'yup'

export const emailSchema = yup.string().required('Email is required').email('Please enter a valid email address')

export const passwordSchema = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )

export const logInSchema = yup.object().shape({
  email: emailSchema,
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], "Passwords don't match"),
})

export const resetPasswordSchema = yup.object().shape({
  email: emailSchema,
})

export const updatePasswordSchema = yup.object().shape({
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], "Passwords don't match"),
})

export type LogInFormData = yup.InferType<typeof logInSchema>
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>
export type UpdatePasswordFormData = yup.InferType<typeof updatePasswordSchema>
