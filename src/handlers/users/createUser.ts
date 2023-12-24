import { APIGatewayEvent } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { ValidationError } from 'yup'
import bcrypt from 'bcrypt'
import { putItem } from '../../aws/dynamodb/putItem'
import { returnData } from '../../utils/returnData'
import { InputUserCreateIF } from '../../types/users'
import { userCreateSchema } from './validation/usersValidation'

export const handler = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_USERS } = process.env
  const { TABLE_NAME_AUTH } = process.env
  if (!TABLE_NAME_USERS) {
    return returnData(400, 'Table name is not defined!')
  }
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const user: InputUserCreateIF = JSON.parse(event.body)
  try {
    await userCreateSchema.validate(user)
  } catch (error) {
    if (error instanceof ValidationError) {
      return returnData(400, error.message)
    }
    return returnData(400, 'Something goes wrong', { error })
  }
  const uuid = uuidv4()
  const params: PutCommandInput = {
    TableName: TABLE_NAME_USERS,
    Item: {
      userId: uuid,
      firstName: user.firstName,
      isActive: 1,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      avatarUrl: user.avatarUrl,
    },
  }

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(user.password.toString(), salt)

  const paramsAuth: PutCommandInput = {
    TableName: TABLE_NAME_AUTH,
    Item: {
      userId: uuid,
      isAdmin: 0,
      email: user.email,
      password: hashedPassword,
    },
  }
  try {
    const [result, resultAuth] = await Promise.all([
      putItem(params),
      putItem(paramsAuth),
    ])

    if (result.success && resultAuth.success) {
      console.log(`User with Id ${uuid} created!`)
      return returnData(200, 'Success!', { userId: uuid })
    }
    return returnData(400, 'Failed to create user or auth entry')
  } catch (error) {
    return returnData(500, 'Internal Server Error', { error })
  }
}
