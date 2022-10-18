## Usage

```
npm start // to start Serverless in offline mode
```

### Docker

To create and run a local DynamoDB container with persistent data:

```
docker run --name LocalDynamoDB -p 8010:8000 -d amazon/dynamodb-local -jar DynamoDBLocal.jar
```

### Table export

To export selected table ([require AWS CLI](https://aws.amazon.com/cli/))

```
aws dynamodb scan --endpoint-url http://localhost:8010 --table-name TABLE_NAME > JSON_FILE
```

Example:

```
aws dynamodb scan --endpoint-url http://localhost:8010 --table-name users > ./tables/users.json
```

### Table import

Command to import the previously exported JSON file. At the moment the file is configured to import users table from tables folder

```
node import.js
```
