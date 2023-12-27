import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from './lib/ddbDocClient'

export const updateItem = async (params: UpdateCommandInput) => {
  try {
    await ddbDocClient.send(new UpdateCommand(params))
    console.log(`Item ${params.AttributeUpdates} updated successfully`)
    return {
      success: true,
    }
  } catch (error: any) {
    console.error(
      `Update Item in table ${params.TableName} failed. Error: ${JSON.stringify(
        error
      )}`
    )
    return {
      success: false,
      error,
    }
  }
}
