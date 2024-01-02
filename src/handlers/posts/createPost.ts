import { APIGatewayEvent } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { returnData } from '../../utils/returnData'
import { returnPutItems } from '../../aws/dynamodb/putItem'
import { validateInput } from '../../utils/validateInput'
import { postCreateSchema } from './validation/postValidation'
import { InputPostIF, PostIF } from '../../types/posts'

export const handler = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_POSTS } = process.env
  if (!TABLE_NAME_POSTS) {
    return returnData(400, 'Table name is not defined!', false)
  }
  const userId: string = event.requestContext.authorizer?.lambda.userId
  if (!event.body) {
    return returnData(400, 'No body!', false)
  }
  const postData: InputPostIF = JSON.parse(event.body)

  await validateInput(postCreateSchema, postData)

  const post: PostIF = {
    ...postData,
    userId,
    postId: uuidv4(),
    isActive: 1,
    unixTimestamp: new Date().valueOf(),
  }

  const params: PutCommandInput = {
    TableName: TABLE_NAME_POSTS,
    Item: post,
  }

  return returnPutItems(params, { postId: post.postId })
}
