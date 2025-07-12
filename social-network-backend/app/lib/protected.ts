import { getCurrentUser } from './auth'
import { NextResponse } from 'next/server'

export async function protectedRoute(req: Request) {
  const token = req.headers.get('cookie')?.split('; ')
    .find(cookie => cookie.startsWith('token='))?.split('=')[1] || ''
  
  const user = await getCurrentUser(token)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return user
}