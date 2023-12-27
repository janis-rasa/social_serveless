import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { APIGatewayEvent } from 'aws-lambda'
import { returnQueryItems } from '../../aws/dynamodb/queryItems'

export const handler = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_POSTS } = process.env
  if (!TABLE_NAME_POSTS) {
    const errMessage = 'No TABLE_NAME_POSTS'
    console.log(errMessage)
    throw new Error(errMessage)
  }
  const userId = event.pathParameters?.userId
  const params: QueryCommandInput = {
    TableName: TABLE_NAME_POSTS,
    IndexName: 'userIndex',
    KeyConditionExpression: 'userId = :i',
    ExpressionAttributeValues: { ':i': userId ?? '0' },
    ScanIndexForward: false,
  }

  return returnQueryItems(params, 'User posts')
}
