import * as Yup from 'yup'
import { UserAuthIF } from '../../../types/users'

export const authSchema: Yup.ObjectSchema<UserAuthIF> = Yup.object({
  email: Yup.string().required('Email is required!'),
  password: Yup.string().required('Password is required!'),
})
