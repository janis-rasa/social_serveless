import { APIGatewayEvent, Context } from 'aws-lambda'
import { verifyCookie } from './lib/cookies'
import { generatePolicy } from './lib/policy'

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Function
) => {
  const { JWT_SECRET } = process.env
  const cookieHeader = event.headers.cookie ?? event.headers.Cookie
  const decoded = verifyCookie(cookieHeader, JWT_SECRET)
  if (!(decoded instanceof Object)) {
    callback(null, generatePolicy('user', 'Deny'))
  }
  callback(null, generatePolicy(decoded.userId, 'Allow'))
}
