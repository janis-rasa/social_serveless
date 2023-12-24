import { APIGatewayEvent } from 'aws-lambda'
import { returnData } from '../../utils/returnData'

export const handler = async (event: APIGatewayEvent) => {
  return returnData(200, 'SLS is up and running', event)
}
