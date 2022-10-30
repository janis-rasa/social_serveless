const { DynamoDB } = require("aws-sdk")

const documentClient = new DynamoDB.DocumentClient({
	region: process.env.SERVERLESS_REGION,
	endpoint: process.env.SERVERLESS_ENDPOINT,
})

module.exports.runDynamoDb = async (method, params, returnData = {}) => {
	try {
		switch (method) {
			case "query":
				returnData = await documentClient.query(params).promise()
				break
			case "put":
				await documentClient.put(params).promise()
				break
			case "delete":
				await documentClient.delete(params).promise()
				break
			default:
		}

		return { statusCode: 200, body: JSON.stringify(returnData) }
	} catch (err) {
		return { statusCode: 400, body: JSON.stringify({ error: err }) }
	}
}
