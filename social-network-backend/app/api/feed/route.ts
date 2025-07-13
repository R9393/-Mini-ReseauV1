import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { protectedRoute } from '@/lib/protected'

export async function GET(req: Request) {
  try {
    const user = await protectedRoute(req)
    if (user instanceof NextResponse) return user

    const result = await query(
      `SELECT p.id, p.content, p.created_at, 
              u.id AS author_id, u.username AS author_username,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.author_id IN (
         SELECT following_id FROM follows WHERE follower_id = $1
       )
       ORDER BY p.created_at DESC
       LIMIT 50`,
      [user.id]
    )

    return NextResponse.json(result.rows, { status: 200 })
  } catch (error) {
    console.error('[FEED_FETCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}