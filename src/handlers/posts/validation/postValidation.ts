import * as Yup from 'yup'
import { InputPostIF, InputUpdatePostIF } from '../../../types/posts'

const MAX_TITLE_LENGTH = 40
const MAX_TEXT_LENGTH = 1000
const MIN_TITLE_LENGTH = 3

const basePostSchema = {
  title: Yup.string()
    .required('First name is required!')
    .min(
      MIN_TITLE_LENGTH,
      `Post title must be at least ${MAX_TEXT_LENGTH} letters`
    )
    .max(
      MAX_TITLE_LENGTH,
      `Post title must not exceed ${MAX_TITLE_LENGTH} letters`
    ),
  text: Yup.string()
    .required('First name is required!')
    .max(
      MAX_TEXT_LENGTH,
      `Post text must not exceed ${MAX_TEXT_LENGTH} letters`
    ),
  imageUrl: Yup.string().required('Image url is required'),
  postId: Yup.string(),
}

export const postCreateSchema: Yup.ObjectSchema<InputPostIF> = Yup.object({
  ...basePostSchema,
})

export const postUpdateSchema: Yup.ObjectSchema<InputUpdatePostIF> = Yup.object(
  {
    ...basePostSchema,
    postId: Yup.string().required(),
  }
)
