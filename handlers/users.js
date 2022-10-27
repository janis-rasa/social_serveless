"use strict"
const { documentClient } = require("../utils/docClient")
const { missingRequiredField } = require("../utils/responseMessages")

const tableName = process.env.SERVERLESS_TABLE_SOCIAL_USERS

// Create user
module.exports.createUser = async (event) => {
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

	try {
		await documentClient.put(params).promise()
		return { statusCode: 200, body: JSON.stringify(newUser) }
	} catch (err) {
		return { statusCode: 400, body: JSON.stringify({ errorMessage: err }) }
	}
}

// Get users
module.exports.getUsers = async (event) => {
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

	const users = await documentClient.query(params).promise()

	return { statusCode: 200, body: JSON.stringify(users) }
}

// Delete user
module.exports.deleteUser = async (event) => {
	const params = {
		TableName: tableName,
		Key: {
			userId: event.queryStringParameters.userId,
		},
	}

	await documentClient.delete(params).promise()

	return { statusCode: 200, body: { userId: event.queryStringParameters.userId } }
}
