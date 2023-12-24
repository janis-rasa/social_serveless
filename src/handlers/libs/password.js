"use strict"
import bcrypt from "bcrypt"

const ITERATIONS = 12

export const hashPassword = async (password) => {
	const hash = await bcrypt.hash(password, ITERATIONS)
	return hash
}

export const matchPassword = async (password, hash) => {
	const match = await bcrypt.compare(password, hash)
	return match
}
