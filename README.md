## Usage

To start Serverless in offline mode just type

```
npm start
```

## HTTPS

To be able to authorize on the framework, you need a [trusted certificate authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority). In this project, [mkcert](https://github.com/FiloSottile/mkcert) was used to generate the certificate. How to do this is described in detail [here](https://web.dev/how-to-use-local-https/).

Install mkcert on Windows, use [Chocolatey](https://chocolatey.org/)

```
choco install mkcert
```

To add mkcert to your local root CAs run the following command:

```
mkcert -install
```

Generate a certificate for your site, signed by mkcert.

In terminal, create the `./keys` directory and navigate to it.

Then, run:

```
mkcert localhost 127.0.0.1
```

## Docker

### DynamoDB

To create and run a local DynamoDB container with persistent data. Windows Power shell command line:

```
docker run `
   --name LocalDynamoDB `
	 -p 8010:8000 `
	 -d amazon/dynamodb-local `
	 -jar DynamoDBLocal.jar
```

After that, you can simply run the LocalDynamoDB container from Docker Desktop.

### S3

This project uses [MinIO](https://min.io/) to build and run S3 offline.

#### Enabling TLS

The MinIO server searches the following directory for TLS keys and certificates (private.key and public.crt):

```
$env:USERPROFILE\.minio\certs
```

Where `$env:USERPROFILE` is the home directory of the user running the MinIO Server process. If this directory does not already exist, create it. Then just make a copy of your `key.pem -> private.key` and `cert.pem -> public.crt` you created before and put them in the directory for certificates. After starting the container, the management console is available at [https://localhost:9090/](https://localhost:9090/). Default login:password is `minioadmin:minioadmin` After logging into the console, you need to create a bucket `social-net`.

### S3 docker

Windows Power shell command line:

```
docker run `
   -p 9000:9000 `
   -p 9090:9090 `
   --name minio-local `
   -e "MINIO_ROOT_USER=minioadmin" `
   -e "MINIO_ROOT_PASSWORD=minioadmin" `
   -v E:\Web\MinIO\socialnet:/data `
   -v $env:USERPROFILE\.minio\certs:/certs `
   quay.io/minio/minio server /data --console-address ":9090" --certs-dir /certs
```

Where `E:\Web\MinIO\socialnet` is your local file storage path.

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

| Email                          | Password |
| ------------------------------ | -------- |
| Karla.Conn@example.com         | password |
| Dustin.Schneider96@example.com | password |

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
