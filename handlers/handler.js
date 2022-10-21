"use strict"
const { create, jsonMiddleware } = require("slspress")
const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient({
	region: "eu-central-1",
	endpoint: "http://localhost:8010",
})

// Hello world
const handler = create()
handler
	.on("handle")
	.middleware(jsonMiddleware)
	.get("/hello-world", (req, res) => {
		return res.ok("hello-world")
	})

module.exports = handler.export()
