export interface InputMessageIF {
  text: string
  targetUserId: string
}

export interface MessageIF extends InputMessageIF {
  messageId: string
  unixTimestamp: number
  userId: string
}
