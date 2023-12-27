import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from './lib/ddbDocClient'
import { returnData } from '../../utils/returnData'

export const queryItems = async (params: QueryCommandInput) => {
  try {
    const data = await ddbDocClient.send(new QueryCommand(params))
    if (data.Items?.length && !data.Items[0].password) {
      console.log(
        `Query result of the table ${
          params.TableName
        }. First 5 entries: ${JSON.stringify(data.Items?.slice(0, 4))}`
      )
    }
    return data.Items
  } catch (error: any) {
    console.error(
      `Query table ${params.TableName} Error: ${JSON.stringify(error)}`
    )
    throw new Error(error.message)
  }
}

export const returnQueryItems = async (
  params: QueryCommandInput,
  successMessage: string
) => {
  try {
    const data = await queryItems(params)
    return returnData(200, successMessage, data)
  } catch (error: any) {
    const errMessage = error.message ?? 'Unknown error'
    console.error(errMessage)
    return returnData(500, 'Internal error', { message: errMessage })
  }
}
