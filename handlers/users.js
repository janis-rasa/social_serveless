"use strict"
import { runDynamoDb } from "./libs/runDynamoDb.js"
import { missingRequiredField } from "./libs/responseMessages.js"
import { checkAuth } from "./libs/cookies.js"

const TABLE_NAME = process.env.SERVERLESS_TABLE_SOCIAL_USERS

// Create user
export const createUser = async (event) => {
	const newUser = JSON.parse(event.body)
	newUser.userId = Date.now()
	newUser.isActive = 1

	if (
		!newUser.firstName ||
		!newUser.lastName ||
		!newUser.avatarUrl ||
		!newUser.userName ||
		!newUser.email ||
		!newUser.password
	) {
		return { statusCode: 400, body: missingRequiredField }
	}

	const authUserData = {
		userId: newUser.userId,
		password: newUser.password,
		email: newUser.email,
	}

	delete newUser.password

	const params = {
		TableName: TABLE_NAME,
		Item: newUser,
	}

	const paramsAuth = {
		TableName: process.env.SERVERLESS_TABLE_SOCIAL_AUTH,
		Item: authUserData,
	}

	try {
		return Promise.all([
			runDynamoDb("put", paramsAuth, { success: true }),
			runDynamoDb("put", params, newUser),
		]).then((response) => response[1])
	} catch (err) {
		return { statusCode: 400, body: JSON.stringify({ error: err }) }
	}
}

// Get users
export const getUsers = async (event) => {
	const status = checkAuth(event)
	if (!status.userId) {
		return status
	}

	let params = {
		TableName: TABLE_NAME,
		KeyConditionExpression: "isActive = :isActive",
		ExpressionAttributeValues: { ":isActive": 1 },
		ScanIndexForward: true,
		IndexName: "isActiveIndex",
	}
	if (event.queryStringParameters !== null) {
		switch (true) {
			case !!event.queryStringParameters.limit:
				let LastEvaluatedKey = event.queryStringParameters.LastEvaluatedKey
				params.ExclusiveStartKey = LastEvaluatedKey ? JSON.parse(LastEvaluatedKey) : undefined
				params.Limit = event.queryStringParameters.limit
				break
			case !!event.queryStringParameters.userId:
				params.KeyConditionExpression = "userId = :userId"
				params.ExpressionAttributeValues = { ":userId": Number(event.queryStringParameters.userId) }
				delete params.IndexName
				break
			case !!event.queryStringParameters.userName:
				params.KeyConditionExpression = "userName = :userName"
				params.ExpressionAttributeValues = { ":userName": event.queryStringParameters.userName }
				params.IndexName = "userNameIndex"
				break
			case !!event.queryStringParameters.info:
				params.Select = "COUNT"
				break
			default:
		}
	}

	return runDynamoDb("query", params)
}

// Delete user
export const deleteUser = async (event) => {
	const status = checkAuth(event)
	if (!status.userId) {
		return status
	}

	const params = {
		TableName: TABLE_NAME,
		Key: {
			userId: status.userId,
		},
	}

	return runDynamoDb("delete", params, { userId: status.userId })
}
