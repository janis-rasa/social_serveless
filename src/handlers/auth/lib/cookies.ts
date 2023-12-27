import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const EXPIRE_TIME = 24 * 60 * 60 // 1 day in seconds

export const generateCookie = (
  userId: string,
  expireTimeInDays: number,
  jwtSecret: string
) => {
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: `${expireTimeInDays}d`,
  })

  return cookie.serialize('token', token, {
    maxAge: expireTimeInDays * EXPIRE_TIME,
    httpOnly: true,
  })
}

export const verifyCookie = (
  cookieHeader: string | undefined,
  jwtSecret: string | undefined
) => {
  if (!jwtSecret) {
    return {}
  }
  if (!cookieHeader) {
    return {}
  }
  const { token } = cookie.parse(cookieHeader)
  if (!token) {
    return {}
  }
  const response = jwt.verify(token, jwtSecret)
  if (!(response instanceof Object)) {
    console.log('jwt.verify message: ', response)
    return {}
  }
  return response
}
