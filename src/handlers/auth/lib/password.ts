import bcrypt from 'bcrypt'

export const matchPassword = async (password: string, hash: string) => {
  const isMatch = await bcrypt.compare(password, hash)
  return isMatch
}
