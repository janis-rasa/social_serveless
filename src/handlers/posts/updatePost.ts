import { APIGatewayEvent } from 'aws-lambda'
import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { returnData } from '../../utils/returnData'
import { validateInput } from '../../utils/validateInput'
import { postUpdateSchema } from './validation/postValidation'
import { InputUpdatePostIF } from '../../types/posts'
import { updateItem } from '../../aws/dynamodb/updateItem'
import { checkPostOwner } from './utils'

export const handler = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_POSTS } = process.env
  if (!TABLE_NAME_POSTS) {
    return returnData(400, 'Table name is not defined!')
  }
  const userId: string = event.requestContext.authorizer?.lambda.userId
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const postData: InputUpdatePostIF = JSON.parse(event.body)

  await validateInput(postUpdateSchema, postData)
  await checkPostOwner(userId, postData.postId, TABLE_NAME_POSTS)

  const params: UpdateCommandInput = {
    TableName: TABLE_NAME_POSTS,
    Key: { postId: postData.postId },
    UpdateExpression: 'set #u = :u, #img = :img, #txt = :txt, #t = :t',
    ExpressionAttributeNames: {
      '#u': 'unixTimestamp',
      '#img': 'imageUrl',
      '#txt': 'text',
      '#t': 'title',
    },
    ExpressionAttributeValues: {
      ':u': `${new Date().valueOf()}`,
      ':img': postData.imageUrl,
      ':txt': postData.text,
      ':t': postData.title,
    },
  }
  try {
    await updateItem(params)
    console.log(`Post with Id ${postData.postId} updated!`)
    return returnData(200, 'Success!', { postId: postData.postId })
  } catch (error) {
    return returnData(500, 'Internal Server Error', { error })
  }
}
