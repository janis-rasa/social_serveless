## Usage

To start Serverless in offline mode just type

```
npm start
```

### Docker

To create and run a local DynamoDB container with persistent data:

```
docker run --name LocalDynamoDB -p 8010:8000 -d amazon/dynamodb-local -jar DynamoDBLocal.jar
```

After that, you can simply run the LocalDynamoDB container from Docker Desktop.

### Create tables

To create table use command ([require AWS CLI](https://aws.amazon.com/cli/)):

```
aws dynamodb create-table --cli-input-json file://config/TABLE_CONFIG.json --endpoint-url http://localhost:8010
```

where TABLE_CONFIG.json is JSON table config file.

### Table export

To export selected table

```
aws dynamodb scan --endpoint-url http://localhost:8010 --table-name TABLE_NAME > JSON_FILE
```

where TABLE_NAME is source table name and JSON_FILE is target json file name

Example:

```
aws dynamodb scan --endpoint-url http://localhost:8010 --table-name social_users > ./tables/social_users.json
```

### Tables import

To import JSON files from tables folder use the command:

```
node ./utils/importTables.js
```
