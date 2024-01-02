export interface UserBaseIF {
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string
  userName: string
}

export interface UserIF extends UserBaseIF {
  userId: string
  isActive?: number
  followed: string[]
}

export interface InputUserCreateIF extends UserBaseIF {
  password: string
}

export interface InputUserUpdateIF extends UserBaseIF {
  userId: string
  isActive: number
}

export interface UserAuthIF {
  email: string
  password: string
}

export interface UserAuthResponseIF {
  userId: { S: string }
  email: { S: string }
  password: { S: string }
}

export interface MarshalledUserIF {
  firstName: { S: string }
  lastName: { S: string }
  email: { S: string }
  avatarUrl: { S: string }
  userName: { S: string }
  followed: { SS: string[] }
  userId: { S: string }
  isActive: { N: string }
}
