import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { comparePasswords, generateToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    
    // Validation
    if (!username || !password) {
      return new NextResponse('Username and password required', { status: 400 })
    }

    // Recherche de l'utilisateur
    const userResult = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )
    
    if (userResult.rows.length === 0) {
      return new NextResponse('Invalid credentials', { status: 401 })
    }

    const user = userResult.rows[0]
    const passwordMatch = await comparePasswords(password, user.password)
    
    if (!passwordMatch) {
      return new NextResponse('Invalid credentials', { status: 401 })
    }


    const token = generateToken(user.id)


    const response = NextResponse.json(
      { id: user.id, username: user.username, bio: user.bio },
      { status: 200 }
    )
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 
    })

    return response
  } catch (error) {
    console.error('[LOGIN_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}