import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { protectedRoute } from '@/lib/protected'

export async function GET(req: Request) {
  try {
    const user = await protectedRoute(req)
    if (user instanceof NextResponse) return user

    const result = await query(
      `SELECT u.id, u.username, u.bio 
       FROM follows f 
       JOIN users u ON f.follower_id = u.id 
       WHERE f.following_id = $1`,
      [user.id]
    )

    return NextResponse.json(result.rows, { status: 200 })
  } catch (error) {
    console.error('[FOLLOWERS_FETCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}