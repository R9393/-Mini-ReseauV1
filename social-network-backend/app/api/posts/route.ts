import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { protectedRoute } from '@/lib/protected'

export async function POST(req: Request) {
  try {
    const user = await protectedRoute(req)
    if (user instanceof NextResponse) return user

    const { content } = await req.json()
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO posts (content, author_id) 
       VALUES ($1, $2) 
       RETURNING id, content, author_id, created_at`,
      [content, user.id]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('[POST_CREATION_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

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
       ORDER BY p.created_at DESC
       LIMIT 50`,
      []
    )

    return NextResponse.json(result.rows, { status: 200 })
  } catch (error) {
    console.error('[POSTS_FETCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}