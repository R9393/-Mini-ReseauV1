import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { protectedRoute } from '@/lib/protected'

export async function POST(req: Request, { params }: { params: { username: string } }) {
  try {
    const currentUser = await protectedRoute(req)
    if (currentUser instanceof NextResponse) return currentUser

    const username = params.username

    // Ne pas se suivre soi-même
    if (currentUser.username === username) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur à suivre
    const userResult = await query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    )
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const userToFollow = userResult.rows[0]

    // Vérifier si on suit déjà
    const followCheck = await query(
      'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2',
      [currentUser.id, userToFollow.id]
    )
    
    if (followCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      )
    }

    // Créer le suivi
    await query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [currentUser.id, userToFollow.id]
    )

    return NextResponse.json(
      { message: 'Successfully followed user' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[FOLLOW_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: { params: { username: string } }) {
  try {
    const currentUser = await protectedRoute(req)
    if (currentUser instanceof NextResponse) return currentUser

    const username = params.username

    // Récupérer l'utilisateur à ne plus suivre
    const userResult = await query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    )
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const userToUnfollow = userResult.rows[0]

    // Supprimer le suivi
    const result = await query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [currentUser.id, userToUnfollow.id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Not following this user' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully unfollowed user' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[UNFOLLOW_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}