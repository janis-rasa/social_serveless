const { DynamoDB } = require("aws-sdk")

module.exports.documentClient = new DynamoDB.DocumentClient({
	region: process.env.SERVERLESS_REGION,
	endpoint: process.env.SERVERLESS_ENDPOINT,
})
