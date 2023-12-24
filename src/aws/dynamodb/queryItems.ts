import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from './lib/ddbDocClient'

export const queryItems = async (params: QueryCommandInput) => {
  try {
    const data = await ddbDocClient.send(new QueryCommand(params))
    if (!data.Items?.[0].password) {
      console.log('Success!. First 5 entries ', data.Items?.slice(0, 4))
    }
    return data.Items
  } catch (error: any) {
    console.error('Error', JSON.stringify(error))
    throw new Error(error.message)
  }
}
