import { APIGatewayEvent } from 'aws-lambda'
import { returnData } from '../../utils/returnData'
import { UserAuthIF } from '../../types/users'
import { queryItems } from '../../aws/dynamodb/queryItems'
import { matchPassword } from './lib/password'
import { generateCookie } from './lib/cookies'
import { authSchema } from './validation/authValidation'
import { validateInput } from '../../utils/validateInput'

export const handler = async (event: APIGatewayEvent) => {
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const { TABLE_NAME_AUTH } = process.env
  if (!TABLE_NAME_AUTH) {
    return returnData(400, 'Table name is not defined!')
  }
  const { JWT_SECRET } = process.env
  if (!JWT_SECRET) {
    return returnData(400, "Can't find JWT secret key")
  }
  const auth: UserAuthIF = JSON.parse(event.body)

  await validateInput(authSchema, auth)

  const { email, password } = auth
  const params = {
    TableName: TABLE_NAME_AUTH,
    KeyConditionExpression: 'email = :e',
    ExpressionAttributeValues: { ':e': email },
  }

  const items = await queryItems(params)
  console.log('Auth query: ', items?.[0].email)
  if (!items?.length) {
    return returnData(401, 'Email or password is incorrect')
  }

  const { userId, password: hashedPassword } = items[0]
  const isMatched = await matchPassword(password, hashedPassword)

  if (!isMatched) {
    return returnData(401, 'Email or password is incorrect')
  }
  const cookie = generateCookie(userId, 1, JWT_SECRET)
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': cookie,
    },
    body: JSON.stringify({ success: true, userId }),
  }
}
