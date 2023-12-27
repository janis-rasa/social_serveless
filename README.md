## Docker for DynamoBD

Best choice for is install [Docker Engine](https://docs.docker.com/engine/install/). Windows users can install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) and use [Docker Engine for Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

Or you can install docker desktop
[Mac](https://docs.docker.com/desktop/install/mac-install/),
[Windows](https://docs.docker.com/desktop/install/windows-install/),
[Linux](https://docs.docker.com/desktop/install/linux-install/)

## DynamoDB

To start Dynamo DB locally, run `npm run dynamodb-local`

## Routes

Default endpoint: `http://localhost:4000`

Example: `http://localhost:4000/auth`

**All routes except POST /login, POST /users, GET /auth require user authorization on front-end**

### Login

To login use

```
POST /login
```

with email and password inside the request body. Available credentials for login:

| Email                    | Password   |
| ------------------------ | ---------- |
| Erma.Will66@example.com  | passwor3D@ |
| Ervin.Deckow@example.com | passwor3D@ |

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

Create new message

```
POST /messages/create
```

Return messageId

### Posts

Get posts for an authorized user

```
GET  /posts
```

Create post

```
POST /posts
```

Update post

```
PATCH /posts
```

Delete post

```
DELETE /posts/{postId}
```

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
