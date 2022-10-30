"use strict"
import { runDynamoDb } from "./libs/runDynamoDb.js"
import { missingRequiredField } from "./libs/responseMessages.js"

const tableName = process.env.SERVERLESS_TABLE_SOCIAL_USERS

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
		!newUser.email
	) {
		return { statusCode: 400, body: missingRequiredField }
	}

	const params = {
		TableName: tableName,
		Item: newUser,
	}

	return runDynamoDb("put", params, newUser)
}

// Get users
export const getUsers = (event) => {
	let params = {
		TableName: tableName,
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
				params.IndexName = undefined
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
export const deleteUser = (event) => {
	const params = {
		TableName: tableName,
		Key: {
			userId: event.body.userId,
		},
	}

	return runDynamoDb("delete", params, { userId: event.body.userId })
}
