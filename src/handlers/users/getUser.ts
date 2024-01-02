import { APIGatewayEvent } from 'aws-lambda'
import { GetItemCommandInput } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { getItem } from '../../aws/dynamodb/getItem'
import { returnData } from '../../utils/returnData'

export const handler = async (event: APIGatewayEvent) => {
  const { TABLE_NAME_USERS } = process.env
  if (!TABLE_NAME_USERS) {
    const errMessage = 'No table name USERS'
    console.log(errMessage)
    throw new Error(errMessage)
  }

  const userId = event.pathParameters?.userId as string
  const params: GetItemCommandInput = {
    Key: {
      userId: { S: userId },
    },
    TableName: TABLE_NAME_USERS,
  }
  try {
    const data = await getItem(params)
    const unmarshalledData = {
      ...unmarshall(data),
      followed: data.followed.SS ?? [],
    }
    return returnData(200, 'Selected user', true, unmarshalledData)
  } catch (error: any) {
    const errMessage = error.message ?? 'Unknown error'
    console.error(errMessage)
    return returnData(500, 'Internal error', false, { message: errMessage })
  }
}
