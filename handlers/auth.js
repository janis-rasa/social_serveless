"use strict"
import { documentClient } from "./libs/runDynamoDb.js"
import { generateCookie, checkAuth } from "./libs/cookies.js"
import { matchPassword } from "./libs/password.js"

const TABLE_NAME = process.env.SERVERLESS_TABLE_SOCIAL_AUTH

export const login = async (event) => {
	const { email, password } = JSON.parse(event.body)
	const params = {
		TableName: TABLE_NAME,
		KeyConditionExpression: "email = :email",
		ExpressionAttributeValues: { ":email": email },
	}

	if (email && password) {
		const { Items } = await documentClient.query(params).promise()
		if (!Items.length) {
			return {
				statusCode: 404,
				body: JSON.stringify({ success: false, err: "Email not found" }),
			}
		}

		const { userId, password: hashedPassword } = Items[0]
		const matchedPassword = await matchPassword(password, hashedPassword)

		if (matchedPassword) {
			const cookie = generateCookie(userId, 1)
			return {
				statusCode: 200,
				headers: {
					"Set-Cookie": cookie,
				},
				body: JSON.stringify({ success: true, userId: userId }),
			}
		} else {
			return {
				statusCode: 401,
				body: JSON.stringify({ success: false, err: "Incorrect password" }),
			}
		}
	}
}

export const isAuthorized = async (event) => {
	const status = checkAuth(event)
	if (status.statusCode) {
		return status
	} else {
		return { statusCode: 200, body: JSON.stringify({ success: true, userId: status.userId }) }
	}
}
