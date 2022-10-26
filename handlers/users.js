"use strict"
const { DynamoDB } = require("aws-sdk")

const documentClient = new DynamoDB.DocumentClient({
	region: process.env.SERVERLESS_REGION,
	endpoint: process.env.SERVERLESS_ENDPOINT,
})

const tableName = process.env.SERVERLESS_TABLE_SOCIAL_USERS

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
		TableName: tableName,
		Item: newUser,
	}

	await documentClient.put(params).promise()

	return { statusCode: 200, body: JSON.stringify(newUser) }
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
	const userToBeRemovedId = event.queryStringParameters.userId
	const params = {
		TableName: tableName,
		Key: {
			userId: userToBeRemovedId,
		},
	}

	await documentClient.delete(params).promise()

	return { statusCode: 200 }
}
