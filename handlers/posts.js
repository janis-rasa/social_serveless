"use strict"
const { documentClient } = require("../utils/docClient")
const { missingRequiredField } = require("../utils/responseMessages")

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
				if (!!event.queryStringParameters.postId) {
					params.FilterExpression = "postId = :postId"
					params.ExpressionAttributeValues = {
						...params.ExpressionAttributeValues,
						":postId": Number(event.queryStringParameters.postId),
					}
				}
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
	newPost.postId ? newPost.postId : (newPost.postId = Date.now())

	const params = {
		TableName: tableName,
		Item: newPost,
	}

	if (
		!newPost.title ||
		!newPost.text ||
		!newPost.userId ||
		!newPost.imageUrl ||
		!newPost.unixTimestamp
	) {
		return { statusCode: 400, body: missingRequiredField }
	}

	try {
		await documentClient.put(params).promise()
		return { body: JSON.stringify({ postId: params.Item.postId }) }
	} catch (err) {
		return { statusCode: 400, body: JSON.stringify({ errorMessage: err }) }
	}
}

// Delete post
module.exports.deletePost = async (event) => {
	const postParams = JSON.parse(event.body)
	const params = {
		TableName: tableName,
		Key: {
			postId: postParams.postId,
			unixTimestamp: postParams.unixTimestamp,
		},
	}

	console.log(params)
	try {
		await documentClient.delete(params).promise()
		return { statusCode: 200, body: JSON.stringify({ postId: postParams.postId }) }
	} catch (err) {
		return { statusCode: 400, body: JSON.stringify({ errorMessage: err }) }
	}
}
