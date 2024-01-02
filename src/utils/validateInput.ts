import * as Yup from 'yup'
import { returnData } from './returnData'

export const validateInput = async (
  schema: Yup.ObjectSchema<Yup.AnyObject, any, ''>,
  inputData: Object
) => {
  try {
    await schema.validate(inputData)
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      throw returnData(400, error.message, false)
    }
    throw returnData(400, 'Something went wrong', false, JSON.stringify(error))
  }
}
