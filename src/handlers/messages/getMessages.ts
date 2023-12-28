import { APIGatewayEvent } from 'aws-lambda'
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { returnData } from '../../utils/returnData'
import { queryItems } from '../../aws/dynamodb/queryItems'
import { MessageIF } from '../../types/messages'

const getUsersChat = async (
  baseParams: QueryCommandInput,
  currentUserId: string,
  targetUserId: string
) => {
  const currentUserParams: QueryCommandInput = {
    ...baseParams,
    KeyConditionExpression: 'userId = :userId and targetUserId=:targetUserId',
    IndexName: 'usersIndex',
    ExpressionAttributeValues: {
      ':userId': currentUserId,
      ':targetUserId': targetUserId,
    },
  }
  const targetUserParams: QueryCommandInput = {
    ...baseParams,
    KeyConditionExpression: 'userId = :userId and targetUserId=:targetUserId',
    IndexName: 'usersIndex',
    ExpressionAttributeValues: {
      ':userId': targetUserId,
      ':targetUserId': currentUserId,
    },
  }
  const [currentMessages, targetMessages] = (await Promise.all([
    queryItems(currentUserParams),
    queryItems(targetUserParams),
  ])) as MessageIF[][]
  const result = [...(currentMessages ?? []), ...(targetMessages ?? [])]
  return result.sort((a, b) => a.unixTimestamp - b.unixTimestamp)
}

const getUserMessage = async (
  baseParams: QueryCommandInput,
  currentUserId: string,
  messageId: string
) => {
  const params: QueryCommandInput = {
    ...baseParams,
    KeyConditionExpression: 'userId = :userId and messageId=:messageId',
    IndexName: 'usersAndMessageIndex',
    ExpressionAttributeValues: {
      ':userId': currentUserId,
      ':messageId': messageId,
    },
  }
  return queryItems(params)
}

export const handler = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_MESSAGES } = process.env
  if (!TABLE_NAME_MESSAGES) {
    return returnData(400, 'Table name is not defined!')
  }
  if (event.queryStringParameters === null) {
    return returnData(400, 'No parameters!')
  }
  const currentUserId: string = event.requestContext.authorizer?.lambda.userId
  const params: QueryCommandInput = {
    TableName: TABLE_NAME_MESSAGES,
    ScanIndexForward: false,
  }
  const { targetUserId, messageId } = event.queryStringParameters
  if (targetUserId) {
    const data = await getUsersChat(params, currentUserId, targetUserId)
    return returnData(200, 'Messages list', data)
  }
  if (messageId) {
    const data = await getUserMessage(params, currentUserId, messageId)
    return returnData(200, 'User message', data)
  }
  return returnData(200, 'OK')
}
