export const generatePolicy = (principalId: string, effect: string) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: 'arn:aws:execute-api:*:*:*',
        },
      ],
    },
    context: {
      userId: principalId,
    },
  }
}
