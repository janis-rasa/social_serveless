"use strict"
import cookie from "cookie"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../keys/jwtSecret.js"

const EXPIRE_TIME = 24 * 60 * 60 // 1 day in seconds

export const generateCookie = (userId, expireTimeInDays) => {
	const token = jwt.sign({ userId }, JWT_SECRET, {
		expiresIn: expireTimeInDays + "d",
	})

	return cookie.serialize("token", token, {
		maxAge: expireTimeInDays * EXPIRE_TIME,
		httpOnly: true,
	})
}

export const verifyCookie = (cookieHeader) => {
	const { token } = cookie.parse(cookieHeader)
	return jwt.verify(token, JWT_SECRET)
}

export const checkAuth = (event) => {
	const unauthorized = {
		statusCode: 401,
		body: JSON.stringify({ success: false, err: "Unauthorized" }),
	}
	const cookieHeader = event.headers.Cookie
	if (!cookieHeader) {
		return unauthorized
	}
	const decoded = verifyCookie(cookieHeader)
	if (!decoded.userId) {
		return unauthorized
	}

	const currentTimestamp = new Date().getTime()
	if (decoded.exp * 1000 < currentTimestamp) {
		return unauthorized
	}

	return { userId: decoded.userId }
}
