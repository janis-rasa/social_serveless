"use strict"
import { runDynamoDb } from "./libs/runDynamoDb.js"
import { missingRequiredField } from "./libs/responseMessages.js"

const tableName = process.env.SERVERLESS_TABLE_SOCIAL_POSTS

// Get posts
export const getPosts = async (event) => {
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

	return runDynamoDb("query", params)
}

// Create new post
export const createPost = async (event) => {
	const newPost = JSON.parse(event.body)
	if (!newPost.postId) {
		newPost.postId = Date.now()
	}

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

	return runDynamoDb("put", params, { postId: params.Item.postId })
}

// Delete post
export const deletePost = async (event) => {
	const postParams = JSON.parse(event.body)
	const params = {
		TableName: tableName,
		Key: {
			postId: postParams.postId,
			unixTimestamp: postParams.unixTimestamp,
		},
	}

	return runDynamoDb("delete", params, { postId: postParams.postId })
}
