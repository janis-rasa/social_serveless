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
