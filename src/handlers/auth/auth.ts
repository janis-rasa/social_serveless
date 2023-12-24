import { APIGatewayEvent } from 'aws-lambda'
import { returnData } from '../../utils/returnData'
import { UserAuthIF } from '../../types/users'
import { queryItems } from '../../aws/dynamodb/queryItems'
import { matchPassword } from './lib/password'
import { generateCookie, verifyCookie } from './lib/cookies'
import { generatePolicy } from './lib/policy'

export const login = async (event: APIGatewayEvent) => {
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
  const { email, password }: UserAuthIF = JSON.parse(event.body)
  const params = {
    TableName: TABLE_NAME_AUTH,
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email },
  }

  if (!email || !password) {
    return returnData(400, 'Email and password is required')
  }
  const items = await queryItems(params)
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

export const logout = async () => {
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': 'token=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT',
    },
    body: JSON.stringify({ success: true }),
  }
}

export const isAuthorized = async (event: APIGatewayEvent) => {
  const { JWT_SECRET } = process.env
  const unauthorized = {
    statusCode: 401,
    body: JSON.stringify({ success: false, err: 'Unauthorized' }),
  }
  const cookieHeader = event.headers.cookie ?? event.headers.Cookie
  const decoded = verifyCookie(cookieHeader, JWT_SECRET)
  if (!(decoded instanceof Object)) {
    return unauthorized
  }
  const currentTimestamp = new Date().getTime()
  const expireTimestamp = decoded.exp ? decoded.exp * 1000 : 1000
  if (expireTimestamp < currentTimestamp) {
    return unauthorized
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      userId: decoded.userId,
      expireTimestamp,
    }),
  }
}

export const verifyToken = async (event: APIGatewayEvent) => {
  const { JWT_SECRET } = process.env
  const cookieHeader = event.headers.cookie ?? event.headers.Cookie
  const decoded = verifyCookie(cookieHeader, JWT_SECRET)
  if (!(decoded instanceof Object)) {
    return {}
  }
  const policy = generatePolicy(decoded.userId, 'Allow')
  return policy
}
