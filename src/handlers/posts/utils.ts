import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { PostIF } from '../../types/posts'
import { queryItems } from '../../aws/dynamodb/queryItems'
import { returnData } from '../../utils/returnData'

export const checkPostOwner = async (
  userId: string,
  postId: string,
  tableName: string
) => {
  const params: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: 'postId = :i',
    ExpressionAttributeValues: { ':i': postId },
    ScanIndexForward: false,
  }

  const post = (await queryItems(params)) as PostIF[]
  if (post[0].userId !== userId) {
    throw returnData(400, 'This post does not belong to you!', false)
  }
}
