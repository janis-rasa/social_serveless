import { APIGatewayEvent } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { returnData } from '../../utils/returnData'
import { putItem } from '../../aws/dynamodb/putItem'
import { validateInput } from '../../utils/validateInput'
import { postCreateSchema } from './validation/postValidation'
import { InputPostIF } from '../../types/posts'

export const handler = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_POSTS } = process.env
  if (!TABLE_NAME_POSTS) {
    return returnData(400, 'Table name is not defined!')
  }
  const userId: string = event.requestContext.authorizer?.lambda.userId
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const postData: InputPostIF = JSON.parse(event.body)

  await validateInput(postCreateSchema, postData)

  const post = {
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
  try {
    const response = await putItem(params)
    if (response.success) {
      console.log(`Post with Id ${post.postId} created!`)
      return returnData(200, 'Success!', { postId: post.postId })
    }
    return returnData(
      400,
      `Create post failed with message: ${response.error.message}`
    )
  } catch (error) {
    return returnData(500, 'Internal Server Error', { error })
  }
}
