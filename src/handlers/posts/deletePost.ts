import { APIGatewayEvent } from 'aws-lambda'
import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { returnData } from '../../utils/returnData'
import { updateItem } from '../../aws/dynamodb/updateItem'
import { checkPostOwner } from './utils'

export const deletePost = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_POSTS } = process.env
  if (!TABLE_NAME_POSTS) {
    return returnData(400, 'Table name is not defined!')
  }
  const postId = event.pathParameters?.postId as string
  const userId: string = event.requestContext.authorizer?.lambda.userId
  await checkPostOwner(userId, postId, TABLE_NAME_POSTS)
  const updateParams: UpdateCommandInput = {
    TableName: TABLE_NAME_POSTS,
    Key: {
      postId,
    },
    UpdateExpression: 'set isActive = :status',
    ExpressionAttributeValues: {
      ':status': 0,
    },
  }
  const response = await updateItem(updateParams)
  return returnData(200, 'Post deleted', response)
}
