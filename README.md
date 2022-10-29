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

## Routes

Default endpoint: `http://localhost:8010/`

Default stage: `dev`

Example: `http://localhost:8010/dev/posts`

### Messages

Get messages by users

```
GET  /messages?userId=1&targetUserId=2
```

Get one user message

```
GET  /messages?userId=1&messageId=38
```

Create new message use POST method with `"Content-Type": "application/json"`

```
POST /messages/create
```

Return messageId

### Posts

Get posts or posts by user

```
GET  /posts
GET  /posts?userId=1
```

To create or update post use POST method with `"Content-Type": "application/json"`. If there is a postId, then the post will be updated.

```
POST /posts/create
```

Return postId

To delete post, use DELETE method with this JSON in the body `{ postId: postId, unixTimestamp: unixTimestamp }`

```
DELETE /posts
```

Return postId

### Users

Get all active users

```
GET /users
```

Get user by Id or by Username

```
GET /users?userId=1
GET /users?userName=Jermaine1
```

Get users count

```
GET /users?info=1

```

Get first 10 users.

```
GET /users?limit=10
```

To get next 10 users you must include urlEncoded LastEvaluatedKey that came in the previous response.

```
GET /users?limit=10&LastEvaluatedKey=%7B%22isActive%22%3A1%2C%22firstName%22%3A%22Carla%22%2C%22userId%22%3A19%7D

```
