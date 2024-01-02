import { GetItemCommand, GetItemCommandInput } from '@aws-sdk/client-dynamodb'
import { returnData } from '../../utils/returnData'
import { ddbClient } from './lib/ddbClient'

export const getItem = async (params: GetItemCommandInput) => {
  try {
    const { Item } = await ddbClient.send(new GetItemCommand(params))
    if (Item?.length && !Item.password) {
      console.log(
        `Get item result of the table ${params.TableName}: ${JSON.stringify(
          Item
        )}`
      )
    }
    if (Item) {
      return Item
    }
    return {}
  } catch (error: any) {
    console.error(
      `Get item for table ${params.TableName} Error: ${JSON.stringify(error)}`
    )
    const errorResponse = {
      success: false,
      message: error.message,
    }
    throw errorResponse
  }
}

export const returnGetItem = async (
  params: GetItemCommandInput,
  successMessage: string
) => {
  try {
    const data = await getItem(params)
    return returnData(200, successMessage, true, data)
  } catch (error: any) {
    const errMessage = error.message ?? 'Unknown error'
    console.error(errMessage)
    return returnData(500, 'Internal error', false, { message: errMessage })
  }
}
