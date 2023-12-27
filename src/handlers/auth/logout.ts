export const handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': 'token=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT',
    },
    body: JSON.stringify({ success: true }),
  }
}
