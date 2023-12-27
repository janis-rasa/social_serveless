import { APIGatewayEvent } from 'aws-lambda'
import { verifyCookie } from './lib/cookies'

export const handler = async (event: APIGatewayEvent) => {
  const { JWT_SECRET } = process.env
  const unauthorized = {
    statusCode: 401,
    body: JSON.stringify({ success: false, err: 'Unauthorized' }),
  }
  const cookieHeader = event.headers.cookie ?? event.headers.Cookie
  const decoded = verifyCookie(cookieHeader, JWT_SECRET)
  if (!Object.keys(decoded).length) {
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
