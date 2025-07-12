import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Création de la réponse
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )
    
    // Suppression du cookie
    response.cookies.delete('token')
    
    return response
  } catch (error) {
    console.error('[LOGOUT_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}