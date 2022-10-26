"use strict"
const { DynamoDB } = require("aws-sdk")

const documentClient = new DynamoDB.DocumentClient({
	region: process.env.SERVERLESS_REGION,
	endpoint: process.env.SERVERLESS_ENDPOINT,
})

const tableName = process.env.SERVERLESS_TABLE_SOCIAL_MESSAGES

// Get posts
module.exports.getMessages = async (event) => {
	if (
		event.queryStringParameters !== null &&
		event.queryStringParameters.userId &&
		event.queryStringParameters.targetUserId
	) {
		let params = {
			TableName: tableName,
			ScanIndexForward: false,
			KeyConditionExpression: "userId = :userId",
			FilterExpression: "targetUserId=:targetUserId",
			IndexName: "usersIndex",
			ExpressionAttributeValues: {
				":userId": Number(event.queryStringParameters.userId),
				":targetUserId": Number(event.queryStringParameters.targetUserId),
			},
		}
		try {
			const messages = await documentClient.query(params).promise()
			return { statusCode: 200, body: JSON.stringify(messages) }
		} catch (err) {
			console.log(err)
		}
	} else {
		return { statusCode: 200, body: JSON.stringify({ text: "OK" }) }
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

	try {
		await documentClient.put(params).promise()
		return { body: JSON.stringify({ messageId: params.Item.messageId }) }
	} catch (err) {
		return { error: err }
	}
}
