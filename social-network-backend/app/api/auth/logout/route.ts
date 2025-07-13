import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )
    

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