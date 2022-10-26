"use strict"
const { DynamoDB } = require("aws-sdk")

const documentClient = new DynamoDB({
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
			Statement:
				"SELECT * FROM " +
				tableName +
				" WHERE userId=" +
				event.queryStringParameters.userId +
				" AND targetUserId=" +
				event.queryStringParameters.targetUserId,
		}
		const messages = await documentClient.executeStatement(params).promise()
		return { statusCode: 200, body: JSON.stringify(messages) }
	} else {
		return { statusCode: 200, body: JSON.stringify({ text: "OK" }) }
	}
}
