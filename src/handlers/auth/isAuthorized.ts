import { APIGatewayEvent } from 'aws-lambda'
import { verifyCookie } from './lib/cookies'
import { returnData } from '../../utils/returnData'

export const handler = async (event: APIGatewayEvent) => {
  const { JWT_SECRET } = process.env
  const unauthorized = returnData(401, 'Unauthorized', false)
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
  return returnData(200, 'Authorized!', true, {
    userId: decoded.userId,
    expireTimestamp,
  })
}
