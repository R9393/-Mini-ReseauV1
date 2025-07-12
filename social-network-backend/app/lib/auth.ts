import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from './db'

export const hashPassword = (password: string) => bcrypt.hash(password, 10)
export const comparePasswords = (password: string, hash: string) => bcrypt.compare(password, hash)

export const generateToken = (userId: number) => 
  jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '1d' })

export const verifyToken = (token: string) => 
  new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      err ? reject(err) : resolve(decoded as jwt.JwtPayload)
    })
  })

export async function getCurrentUser(token: string) {
  try {
    const decoded = await verifyToken(token)
    const result = await query(
      'SELECT id, username, bio FROM users WHERE id = $1',
      [decoded.id]
    )
    return result.rows[0] || null
  } catch (error) {
    return null
  }
}