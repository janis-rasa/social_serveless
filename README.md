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

## API calls

Default endpoint: `http://localhost:8010`

Default stage: `dev`

### Messages

```
GET  /messages?userId=1&targetUserId=2
```

Create new message use POST method with `"Content-Type": "application/json"`

```
POST /messages/create
```

Return messageId

### Posts

```
GET  /posts
GET  /posts?userId=1
```

Create new post use POST method with `"Content-Type": "application/json"`

```
POST /posts/create
```

Return postId

### Users

```
GET /users
```

Get all active users

```
GET /users?userId=1
GET /users?userName=Jermaine1
```

Get user by Id or by Username

```
GET /users?info=1

```

Get users count

```
GET /users?limit=10
```

Get first 10 users. To get next 10 users you must include urlEncoded LastEvaluatedKey that came in the previous response.

```
GET /users?limit=10&LastEvaluatedKey=%7B%22isActive%22%3A1%2C%22firstName%22%3A%22Carla%22%2C%22userId%22%3A19%7D

```
