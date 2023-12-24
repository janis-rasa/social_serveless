import * as Yup from 'yup'
import { InputUserCreateIF } from '../../../types/users'

const MIN_NAME_LETTERS = 2
const MAX_NAME_LETTERS = 20
const MIN_NAME_LETTERS_PASSWORD = 8

export const userCreateSchema: Yup.ObjectSchema<InputUserCreateIF> = Yup.object(
  {
    firstName: Yup.string()
      .required('First name is required!')
      .min(
        MIN_NAME_LETTERS,
        `Name must be at least ${MIN_NAME_LETTERS} letters`
      )
      .max(
        MAX_NAME_LETTERS,
        `Name must not exceed ${MAX_NAME_LETTERS} letters`
      ),
    lastName: Yup.string()
      .required('Surname is required!')
      .min(
        MIN_NAME_LETTERS,
        `Surname must be at least ${MIN_NAME_LETTERS} letters`
      )
      .max(
        MAX_NAME_LETTERS,
        `Surname must not exceed ${MAX_NAME_LETTERS} letters`
      ),
    email: Yup.string()
      .required('Email is required')
      .email('Please input valid email'),
    avatarUrl: Yup.string(),
    userName: Yup.string()
      .required('Username is required!')
      .min(
        MIN_NAME_LETTERS,
        `Username must be at least ${MIN_NAME_LETTERS} letters`
      )
      .max(
        MAX_NAME_LETTERS,
        `Username must not exceed ${MAX_NAME_LETTERS} letters`
      ),
    password: Yup.string()
      .required('Password is required!')
      .min(
        MIN_NAME_LETTERS_PASSWORD,
        `Username must be at least ${MIN_NAME_LETTERS_PASSWORD} letters`
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*()'
      ),
  }
)
