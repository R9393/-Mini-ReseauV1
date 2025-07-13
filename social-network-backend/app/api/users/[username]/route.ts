import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { protectedRoute } from '@/lib/protected'

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const currentUser = await protectedRoute(req)
    const isOwner = !(currentUser instanceof NextResponse) && currentUser.username === params.username

    const username = params.username

    const userResult = await query(
      `SELECT id, username, bio, created_at 
       FROM users 
       WHERE username = $1`,
      [username]
    )
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const user = userResult.rows[0]

    const postsResult = await query(
      `SELECT id, content, created_at 
       FROM posts 
       WHERE author_id = $1 
       ORDER BY created_at DESC
       LIMIT 20`,
      [user.id]
    )
    
    const posts = postsResult.rows

    const followersResult = await query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [user.id]
    )
    
    const followingResult = await query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [user.id]
    )
    
    let isFollowing = false
    
    if (!(currentUser instanceof NextResponse)) {
      const followCheck = await query(
        'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2',
        [currentUser.id, user.id]
      )
      isFollowing = followCheck.rows.length > 0
    }

    return NextResponse.json({
      ...user,
      posts,
      followersCount: parseInt(followersResult.rows[0].count),
      followingCount: parseInt(followingResult.rows[0].count),
      isOwner,
      isFollowing
    }, { status: 200 })
  } catch (error) {
    console.error('[PROFILE_FETCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}