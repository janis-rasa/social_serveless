export interface AwsPolicyIF {
  principalId: string
  policyDocument: {
    Version: string
    Statement: {
      Action: string
      Effect: string
      Resource: string
    }[]
  }
  context: {
    userId: string
  }
}
