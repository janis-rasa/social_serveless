import { APIGatewayEvent } from 'aws-lambda'
import { GetItemCommandInput } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { returnData } from '../../utils/returnData'
import { UserAuthIF, UserAuthResponseIF } from '../../types/users'
import { matchPassword } from './lib/password'
import { generateCookie } from './lib/cookies'
import { authSchema } from './validation/authValidation'
import { validateInput } from '../../utils/validateInput'
import { getItem } from '../../aws/dynamodb/getItem'

export const handler = async (event: APIGatewayEvent) => {
  if (!event.body) {
    return returnData(400, 'No body!', false)
  }
  const { TABLE_NAME_AUTH, TABLE_NAME_USERS } = process.env
  if (!TABLE_NAME_AUTH || !TABLE_NAME_USERS) {
    return returnData(400, 'Table name is not defined!', false)
  }
  const { JWT_SECRET } = process.env
  if (!JWT_SECRET) {
    return returnData(400, "Can't find JWT secret key", false)
  }
  const auth: UserAuthIF = JSON.parse(event.body)

  await validateInput(authSchema, auth)

  const { email, password } = auth
  const params: GetItemCommandInput = {
    TableName: TABLE_NAME_AUTH,
    Key: {
      email: { S: email },
    },
  }

  const item: UserAuthResponseIF = (await getItem(params)) as any
  if (!Object.keys(item).length) {
    return returnData(401, 'Email or password is incorrect', false)
  }

  const userId = item.userId.S
  console.log('Auth query: ', item.email.S, userId)
  const hashedPassword = item.password.S
  const isMatched = await matchPassword(password, hashedPassword)

  if (!isMatched) {
    return returnData(401, 'Email or password is incorrect', false)
  }
  const cookie = generateCookie(userId, 1, JWT_SECRET)
  const getItemParams: GetItemCommandInput = {
    Key: {
      userId: { S: userId },
    },
    TableName: TABLE_NAME_USERS,
  }
  let user = {}
  try {
    const data = await getItem(getItemParams)
    user = {
      ...unmarshall(data),
      followed: data.followed.SS ?? [],
    }
  } catch (error: any) {
    const errMessage = error.message ?? 'Unknown error'
    console.error(errMessage)
    return returnData(500, 'Internal error', false, { message: errMessage })
  }

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': cookie,
    },
    body: JSON.stringify({
      message: 'Login succeeded!',
      success: true,
      data: {
        ...user,
      },
    }),
  }
}
