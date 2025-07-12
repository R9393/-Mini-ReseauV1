import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const protectedRoutes = [
    '/feed', 
    '/profile', 
    '/post', 
    '/follow',
    '/followers',
    '/following',
    '/api/posts',
    '/api/feed',
    '/api/users/follow',
    '/api/users/followers',
    '/api/users/following'
  ]

  // Vérification des routes protégées
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      await verifyToken(token)
      return NextResponse.next()
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  // Redirection si connecté et sur login/register
  if (['/login', '/register'].includes(request.nextUrl.pathname)) {
    if (token) {
      try {
        await verifyToken(token)
        return NextResponse.redirect(new URL('/feed', request.url))
      } catch (error) {
        // Token invalide, on laisse passer
      }
    }
  }

  return NextResponse.next()
}