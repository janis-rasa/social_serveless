"use strict"
const { DynamoDB } = require("aws-sdk")

const documentClient = new DynamoDB.DocumentClient({
	region: process.env.SERVERLESS_REGION,
	endpoint: process.env.SERVERLESS_ENDPOINT,
})

const tableName = process.env.SERVERLESS_TABLE_SOCIAL_POSTS

// Get posts
module.exports.getPosts = async (event) => {
	let params = {
		TableName: tableName,
		ScanIndexForward: false,
		KeyConditionExpression: "isActive = :isActive",
		ExpressionAttributeValues: { ":isActive": 1 },
		IndexName: "isActiveIndex",
	}

	if (event.queryStringParameters !== null) {
		switch (true) {
			case !!event.queryStringParameters.userId:
				params.ExpressionAttributeValues = { ":userId": Number(event.queryStringParameters.userId) }
				params.KeyConditionExpression = "userId = :userId"
				params.IndexName = "userIndex"
				break
			case !!event.queryStringParameters.info:
				params.Select = "COUNT"
				break
			default:
		}
	}

	const posts = await documentClient.query(params).promise()
	return { statusCode: 200, body: JSON.stringify(posts) }
}

// Create new post
module.exports.createPost = async (event) => {
	const newPost = JSON.parse(event.body)
	newPost.postId = Date.now()

	const params = {
		TableName: tableName,
		Item: newPost,
	}

	try {
		await documentClient.put(params).promise()
		return { body: JSON.stringify({ postId: params.Item.postId }) }
	} catch (err) {
		return { error: err }
	}
}
