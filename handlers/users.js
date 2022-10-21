"use strict"
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient({
	region: process.env.SERVERLESS_REGION,
	endpoint: process.env.SERVERLESS_ENDPOINT,
})

const usersTable = process.env.SERVERLESS_TABLE_SOCIAL_USERS

// Create user
module.exports.createUser = async (event) => {
	const newUser = {
		firstName: event.body.firstName,
		lastName: event.body.lastName,
		email: event.body.email,
		avatarUrl: event.body.avatarUrl,
		userName: event.body.userName,
	}

	const params = {
		TableName: usersTable,
		Item: newUser,
	}

	await db.put(params).promise()

	return { statusCode: 200, body: JSON.stringify(newUser) }
}

// Get users
module.exports.getUsers = async (event) => {
	const params = {
		TableName: usersTable,
		KeyConditionExpression: "isActive = :isActive",
		ExpressionAttributeValues: { ":isActive": 1 },
		ScanIndexForward: true,
		IndexName: "isActiveIndex",
	}
	if (event.queryStringParameters !== null) {
		let LastEvaluatedKey = event.queryStringParameters.LastEvaluatedKey
		params.ExclusiveStartKey = LastEvaluatedKey ? JSON.parse(LastEvaluatedKey) : undefined
		params.Limit = event.queryStringParameters.limit
	}

	const users = await db.query(params).promise()

	return { statusCode: 200, body: JSON.stringify(users) }
}

// Delete user
module.exports.deleteUser = async (event) => {
	const userToBeRemovedId = event.queryStringParameters.userId
	const params = {
		TableName: usersTable,
		Key: {
			userId: userToBeRemovedId,
		},
	}

	await db.delete(params).promise()

	return { statusCode: 200 }
}
