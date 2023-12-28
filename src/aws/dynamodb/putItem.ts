import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from './lib/ddbDocClient'
import { returnData } from '../../utils/returnData'

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
    console.log(
      `Put item into table ${
        params.TableName
      } ends with error: ${JSON.stringify(error)}`
    )
    const result = {
      success: false,
      message: error.message,
    }
    throw result
  }
}

export const returnPutItems = async (
  params: PutCommandInput,
  returnedObject: Object
) => {
  try {
    await putItem(params)
    return returnData(200, 'Success!', returnedObject)
  } catch (error: any) {
    const errMessage = error.message ?? 'Unknown error'
    console.error(errMessage)
    return returnData(500, 'Internal error', { message: errMessage })
  }
}
