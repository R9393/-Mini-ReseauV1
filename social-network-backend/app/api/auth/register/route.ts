import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { username, password, bio } = await req.json()
    
    // Validation
    if (!username || !password) {
      return new NextResponse('Username and password required', { status: 400 })
    }

    // Vérification de l'existence de l'utilisateur
    const existingUser = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )
    
    if (existingUser.rows.length > 0) {
      return new NextResponse('Username already exists', { status: 400 })
    }

    // Création de l'utilisateur
    const hashedPassword = await hashPassword(password)
    const newUser = await query(
      `INSERT INTO users (username, password, bio) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, bio`,
      [username, hashedPassword, bio || null]
    )
    
    const user = newUser.rows[0]
    const token = generateToken(user.id)

    // Réponse avec cookie
    const response = NextResponse.json(user, { status: 201 })
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 jour
    })

    return response
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}