import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { APIGatewayEvent } from 'aws-lambda'
import { returnQueryItems } from '../../aws/dynamodb/queryItems'
import { returnData } from '../../utils/returnData'

export const handler = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_POSTS } = process.env
  if (!TABLE_NAME_POSTS) {
    return returnData(400, 'Table name is not defined!')
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
