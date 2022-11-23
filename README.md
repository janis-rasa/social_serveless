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

After export, don't forget to remove these values at the end of the file.

```
"Count": 20,
"ScannedCount": 20
```

Example:

```
aws dynamodb scan --endpoint-url http://localhost:8010 --table-name social_users > ./tables/social_users.json
```

### Tables import

To import JSON files from tables folder use the command:

```
node ./utils/importTables.js
```

## HTTPS

To be able to authorize on the framework, you need a [trusted certificate authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority). In this project, [mkcert](https://github.com/FiloSottile/mkcert) was used to generate the certificate. How to do this is described in detail [here](https://web.dev/how-to-use-local-https/).

## Routes

Default endpoint: `http://localhost:8010`

Default stage: `/dev`

Example: `http://localhost:8010/dev/posts`

**All routes except /login and /users/create require user authorization on front-end**

### Login

To login use

```
POST /login
```

with email and password inside the request body. Available credentials for login:

| Email                      | Password |
| -------------------------- | -------- |
| Vickie_Boyer@example.com   | password |
| Pauline_Paucek@example.com | password |

### Messages

Get target user's messages for logged in user

```
GET  /messages?targetUserId=2
```

Get messages for logged in user from target user

```
GET  /messages?userId=2
```

Get one message for logged in user

```
GET  /messages?messageId=38
```

Create new message use POST method with `"Content-Type": "application/json"`

```
POST /messages/create
```

Return messageId

### Posts

Get posts for an authorized user

```
GET  /posts
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
