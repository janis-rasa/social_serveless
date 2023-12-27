export interface InputPostIF {
  title: string
  text: string
  imageUrl: string
  postId?: string
}

export interface PostIF extends InputPostIF {
  unixTimestamp: number
  postId: string
  isActive: number
  userId: string
}

export interface InputUpdatePostIF extends InputPostIF {
  postId: string
}
