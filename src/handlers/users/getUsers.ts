import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { returnQueryItems } from '../../aws/dynamodb/queryItems'

export const handler = async () => {
  const { TABLE_NAME_USERS } = process.env
  if (!TABLE_NAME_USERS) {
    const errMessage = 'No TABLE_NAME_USERS'
    console.log(errMessage)
    throw new Error(errMessage)
  }
  const params: QueryCommandInput = {
    IndexName: 'isActiveIndex',
    KeyConditionExpression: 'isActive = :i',
    ExpressionAttributeValues: {
      ':i': 1,
    },
    TableName: TABLE_NAME_USERS,
    ScanIndexForward: true,
  }
  return returnQueryItems(params, 'User list')
}
