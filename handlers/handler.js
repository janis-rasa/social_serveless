"use strict"
import AWS from "aws-sdk"
const BUCKET = process.env.SERVERLESS_BUCKET

export const hello = async (event) => {
	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: "Go Serverless v1.0! Your function executed successfully!",
				input: event,
			},
			null,
			2
		),
	}
}

export const webhook = (event, context, callback) => {
	const S3 = new AWS.S3({
		s3ForcePathStyle: true,
		accessKeyId: "9e730KUkoU39bTAa",
		secretAccessKey: "BBvZ2AjR3WHXzYJpGiw2xPpDDC3H19uE",
		endpoint: new AWS.Endpoint("https://127.0.0.1:9000"),
	})
	S3.putObject(
		{
			Bucket: BUCKET,
			Key: "1234",
			Body: new Buffer("abcd"),
		},
		() => callback(null, "ok")
	)
}

export const s3hook = async (event, context) => {
	const S3 = new AWS.S3({
		s3ForcePathStyle: true,
		accessKeyId: "9e730KUkoU39bTAa",
		secretAccessKey: "BBvZ2AjR3WHXzYJpGiw2xPpDDC3H19uE",
		endpoint: new AWS.Endpoint("https://127.0.0.1:9000"),
	})
	try {
		// Converted it to async/await syntax just to simplify.
		const data = await S3.getObject({
			Bucket: BUCKET,
			Key: "vlcsnap-2021-02-12-22h44m33s633.png",
		}).promise()
		return {
			statusCode: 200,
			body: JSON.stringify(data),
		}
	} catch (err) {
		return {
			statusCode: err.statusCode || 400,
			body: err.message || JSON.stringify(err.message),
		}
	}
}
