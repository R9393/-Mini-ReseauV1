import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { protectedRoute } from '@/lib/protected'

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    const user = await protectedRoute(req)
    if (user instanceof NextResponse) return user

    const postId = parseInt(params.postId)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      )
    }

    const postResult = await query(
      `SELECT p.id, p.content, p.created_at, 
              u.id AS author_id, u.username AS author_username
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.id = $1`,
      [postId]
    )

    if (postResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const commentsResult = await query(
      `SELECT c.id, c.content, c.created_at, 
              u.id AS author_id, u.username AS author_username
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    )

    return NextResponse.json({
      ...postResult.rows[0],
      comments: commentsResult.rows
    }, { status: 200 })
  } catch (error) {
    console.error('[POST_FETCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: { params: { postId: string } }) {
  try {
    const user = await protectedRoute(req)
    if (user instanceof NextResponse) return user

    const postId = parseInt(params.postId)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      )
    }

    const postResult = await query(
      'SELECT author_id FROM posts WHERE id = $1',
      [postId]
    )

    if (postResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (postResult.rows[0].author_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await query('DELETE FROM posts WHERE id = $1', [postId])

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[POST_DELETION_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}