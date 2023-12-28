import * as Yup from 'yup'
import { InputMessageIF } from '../../../types/messages'

export const messageCreateSchema: Yup.ObjectSchema<InputMessageIF> = Yup.object(
  {
    text: Yup.string().required(),
    targetUserId: Yup.string().required(),
  }
)
