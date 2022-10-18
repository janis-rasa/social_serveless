"use_strict"
const fs = require("fs")
const async = require("async")
const AWS = require("aws-sdk")

// --- start user config ---

const DYNAMODB_TABLE_NAMES = ["posts", "messages", "users"]
const DYNAMODB_REGION = "eu-central-1"
const DYNAMODB_ENDPOINT = "http://localhost:8010"

// Set options
AWS.config.update({ region: DYNAMODB_REGION, endpoint: DYNAMODB_ENDPOINT })

// Create DynamoDB service object
const ddb = new AWS.DynamoDB({})

const parser = (data, tableName) => {
	let splitArrays = []
	const SIZE = 25
	while (data.Items.length > 0) {
		splitArrays = [...splitArrays, data.Items.splice(0, SIZE)]
	}
	async.each(
		splitArrays,
		(itemData, callback) => importData(tableName, itemData, callback),
		() => {
			// run after loops
			console.log("all data imported....")
		}
	)
}

let dataImported = false
let chunkNo = 1

const importData = (tableName, itemData, callback) => {
	const params = {
		RequestItems: {},
	}
	params.RequestItems[tableName] = []
	itemData.forEach((item) => {
		for (let key of Object.keys(item)) {
			// An AttributeValue may not contain an empty string
			if (item[key] === "") {
				delete item[key]
			}
		}

		let newItem = {
			PutRequest: {
				Item: item,
			},
		}
		params.RequestItems[tableName] = [...params.RequestItems[tableName], newItem]
	})

	ddb.batchWriteItem(params, function (err, res, cap) {
		console.log("Done going next...\n")
		if (err == null) {
			console.log("Success chunk #" + chunkNo + "\n")
			dataImported = true
		} else {
			console.log("Fail chunk #" + chunkNo + "\n")
			console.log(err)
			dataImported = false
		}
		chunkNo++
		callback()
	})
}

DYNAMODB_TABLE_NAMES.forEach((element) => {
	const jsonFilename = "./tables/" + element + ".json"
	const jsonData = JSON.parse(fs.readFileSync(jsonFilename))
	parser(jsonData, element)
})
