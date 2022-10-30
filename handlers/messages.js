"use strict"
const { runDynamoDb } = require("./libs/runDynamoDb")
const { missingRequiredField } = require("./libs/responseMessages")

const tableName = process.env.SERVERLESS_TABLE_SOCIAL_MESSAGES

// Get posts
module.exports.getMessages = async (event) => {
	let params = {
		TableName: tableName,
		ScanIndexForward: false,
	}
	if (event.queryStringParameters !== null) {
		switch (true) {
			case !!event.queryStringParameters.userId && !!event.queryStringParameters.targetUserId:
				params.KeyConditionExpression = "userId = :userId and targetUserId=:targetUserId"
				params.IndexName = "usersIndex"
				params.ExpressionAttributeValues = {
					":userId": Number(event.queryStringParameters.userId),
					":targetUserId": Number(event.queryStringParameters.targetUserId),
				}
				break
			case !!event.queryStringParameters.userId && !!event.queryStringParameters.messageId:
				params.KeyConditionExpression = "userId = :userId and messageId=:messageId"
				params.IndexName = "usersAndMessageIndex"
				params.ExpressionAttributeValues = {
					":userId": Number(event.queryStringParameters.userId),
					":messageId": Number(event.queryStringParameters.messageId),
				}
				break
			default:
				return { statusCode: 200, body: JSON.stringify({ text: "OK" }) }
		}
	}
	return runDynamoDb("query", params)
}

// Create new message
module.exports.createMessage = async (event) => {
	const newMessage = JSON.parse(event.body)
	newMessage.messageId = Date.now()

	const params = {
		TableName: tableName,
		Item: newMessage,
	}

	if (
		!newMessage.text ||
		!newMessage.targetUserId ||
		!newMessage.userId ||
		!newMessage.unixTimestamp
	) {
		return { statusCode: 400, body: missingRequiredField }
	}

	return runDynamoDb("put", params, { messageId: params.Item.messageId })
}
