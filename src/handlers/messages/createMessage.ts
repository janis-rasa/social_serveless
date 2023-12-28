import { APIGatewayEvent } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { returnData } from '../../utils/returnData'
import { validateInput } from '../../utils/validateInput'
import { messageCreateSchema } from './validation/messagesValidation'
import { returnPutItems } from '../../aws/dynamodb/putItem'
import { MessageIF } from '../../types/messages'

export const handler = async (event: APIGatewayEvent) => {
  const userId: string = event.requestContext.authorizer?.lambda.userId
  const { TABLE_NAME_MESSAGES } = process.env
  if (!TABLE_NAME_MESSAGES) {
    return returnData(400, 'Table name is not defined!')
  }
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const newMessage = JSON.parse(event.body)
  await validateInput(messageCreateSchema, newMessage)
  const item: MessageIF = {
    ...newMessage,
    messageId: uuidv4(),
    userId,
    unixTimestamp: new Date(),
  }
  const params = {
    TableName: TABLE_NAME_MESSAGES,
    Item: item,
  }

  return returnPutItems(params, { messageId: params.Item.messageId })
}
