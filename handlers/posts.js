"use strict"
import { runDynamoDb } from "./libs/runDynamoDb.js"
import { missingRequiredField } from "./libs/responseMessages.js"
import { checkAuth } from "./libs/cookies.js"

const TABLE_NAME = process.env.SERVERLESS_TABLE_SOCIAL_POSTS

// Get posts
export const getPosts = async (event) => {
	const status = checkAuth(event)
	if (status.statusCode) {
		return status
	}

	let params = {
		TableName: TABLE_NAME,
		ScanIndexForward: false,
		ExpressionAttributeValues: { ":userId": status.userId },
		KeyConditionExpression: "userId = :userId",
		IndexName: "userIndex",
	}

	if (event.queryStringParameters !== null) {
		switch (true) {
			case !!event.queryStringParameters.info:
				params.Select = "COUNT"
				break
			case !!event.queryStringParameters.postId:
				params.FilterExpression = "postId = :postId"
				params.ExpressionAttributeValues = {
					...params.ExpressionAttributeValues,
					":postId": Number(event.queryStringParameters.postId),
				}
				break
			default:
		}
	}

	return runDynamoDb("query", params)
}

// Create new / edit post
export const createPost = async (event) => {
	const status = checkAuth(event)
	if (status.statusCode) {
		return status
	}

	const newPost = JSON.parse(event.body)
	newPost.userId = status.userId
	if (!newPost.postId) {
		newPost.postId = Date.now()
	}

	const params = {
		TableName: TABLE_NAME,
		Item: newPost,
	}

	if (!newPost.title || !newPost.text || !newPost.imageUrl || !newPost.unixTimestamp) {
		return { statusCode: 400, body: missingRequiredField }
	}

	return runDynamoDb("put", params, { postId: params.Item.postId })
}

// Delete post
export const deletePost = async (event) => {
	const postParams = JSON.parse(event.body)
	const params = {
		TableName: TABLE_NAME,
		Key: {
			postId: postParams.postId,
			unixTimestamp: postParams.unixTimestamp,
		},
	}

	return runDynamoDb("delete", params, { postId: postParams.postId })
}
