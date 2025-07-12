import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { protectedRoute } from '@/lib/protected'

export async function POST(req: Request, { params }: { params: { postId: string } }) {
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

    const { content } = await req.json()
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Vérifier que le post existe
    const postCheck = await query(
      'SELECT 1 FROM posts WHERE id = $1',
      [postId]
    )
    
    if (postCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const result = await query(
      `INSERT INTO comments (content, post_id, author_id) 
       VALUES ($1, $2, $3) 
       RETURNING id, content, post_id, author_id, created_at`,
      [content, postId, user.id]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('[COMMENT_CREATION_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}