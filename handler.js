"use strict"
const { create, jsonMiddleware } = require("slspress")
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient({
	region: "eu-central-1",
	endpoint: "http://localhost:8010",
})
const TableName = process.env.TABLE_USERS

// Hello world
const handler = create()
handler
	.on("handle")
	.middleware(jsonMiddleware)
	.get("/hello-world", (req, res) => {
		return res.ok("hello-world")
	})

module.exports = handler.export()

// Create user
module.exports.createUser = async (event) => {
	const newUser = {
		firstName: event.body.firstName,
		lastName: event.body.lastName,
		email: event.body.email,
		avatarUrl: event.body.avatarUrl,
		userName: event.body.userName,
	}

	await db
		.put({
			TableName,
			Item: newUser,
		})
		.promise()

	return { statusCode: 200, body: JSON.stringify(newUser) }
}

// Get users
module.exports.listUsers = async (event) => {
	const users = await db
		.scan({
			TableName,
		})
		.promise()

	return { statusCode: 200, body: JSON.stringify(users) }
}

// Delete user
module.exports.deleteUser = async (event) => {
	const userToBeRemovedId = event.pathParameters.name

	await db
		.delete({
			TableName,
			Key: {
				userId: userToBeRemovedId,
			},
		})
		.promise()

	return { statusCode: 200 }
}
