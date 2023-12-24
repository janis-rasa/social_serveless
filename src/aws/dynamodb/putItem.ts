import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from './lib/ddbDocClient'

export const putItem = async (params: PutCommandInput) => {
  try {
    const data = await ddbDocClient.send(new PutCommand(params))
    console.log(
      'Success - item added or updated: httpStatusCode ',
      data.$metadata.httpStatusCode
    )
    return {
      success: true,
    }
  } catch (error: any) {
    console.log('Error: ', error.stack)
    return {
      success: false,
      error,
    }
  }
}
