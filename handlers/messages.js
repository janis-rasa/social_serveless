"use strict"
const { documentClient } = require("../utils/docClient")
const { missingRequiredField } = require("../utils/responseMessages")

const tableName = process.env.SERVERLESS_TABLE_SOCIAL_MESSAGES

// Get posts
module.exports.getMessages = async (event) => {
	let params = {
		TableName: tableName,
		ScanIndexForward: false,
	}
	if (event.queryStringParameters !== null)
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

	try {
		const messages = await documentClient.query(params).promise()
		return { statusCode: 200, body: JSON.stringify(messages) }
	} catch (err) {
		console.log(err)
	}
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

	try {
		await documentClient.put(params).promise()
		return { body: JSON.stringify({ messageId: params.Item.messageId }) }
	} catch (err) {
		return { statusCode: 400, body: JSON.stringify({ message: err }) }
	}
}
