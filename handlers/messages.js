"use strict"
import { runDynamoDb } from "./libs/runDynamoDb.js"
import { missingRequiredField } from "./libs/responseMessages.js"
import { checkAuth } from "./libs/cookies.js"

const TABLE_NAME = process.env.SERVERLESS_TABLE_SOCIAL_MESSAGES

// Get posts
export const getMessages = async (event) => {
	const status = checkAuth(event)
	if (!status.userId) {
		return status
	}

	let params = {
		TableName: TABLE_NAME,
		ScanIndexForward: false,
	}
	if (event.queryStringParameters !== null) {
		switch (true) {
			case !!event.queryStringParameters.targetUserId:
				params.KeyConditionExpression = "userId = :userId and targetUserId=:targetUserId"
				params.IndexName = "usersIndex"
				params.ExpressionAttributeValues = {
					":userId": status.userId,
					":targetUserId": Number(event.queryStringParameters.targetUserId),
				}
				break
			case !!event.queryStringParameters.userId:
				params.KeyConditionExpression = "userId = :userId and targetUserId=:targetUserId"
				params.IndexName = "usersIndex"
				params.ExpressionAttributeValues = {
					":userId": Number(event.queryStringParameters.userId),
					":targetUserId": status.userId,
				}
				break
			case !!event.queryStringParameters.messageId:
				params.KeyConditionExpression = "userId = :userId and messageId=:messageId"
				params.IndexName = "usersAndMessageIndex"
				params.ExpressionAttributeValues = {
					":userId": status.userId,
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
export const createMessage = async (event) => {
	const status = checkAuth(event)
	if (!status.userId) {
		return status
	}

	const newMessage = JSON.parse(event.body)
	newMessage.messageId = Date.now()
	newMessage.userId = status.userId
	const params = {
		TableName: TABLE_NAME,
		Item: newMessage,
	}

	if (!newMessage.text || !newMessage.targetUserId || !newMessage.unixTimestamp) {
		return { statusCode: 400, body: missingRequiredField }
	}

	return runDynamoDb("put", params, { messageId: params.Item.messageId })
}
