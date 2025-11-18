import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

/**
 * Middleware para proteger rutas
 * - Rutas /dashboard/* requieren autenticación
 * - Rutas /api/* (excepto públicas) requieren autenticación
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas de API
  const publicApiRoutes = [
    '/api/auth',
  ]

  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))

  // Si es una ruta de API pública, permitir acceso
  if (isPublicApiRoute) {
    return NextResponse.next()
  }

  // Obtener token de autenticación
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Rutas que requieren autenticación
  const isProtectedRoute = pathname.startsWith('/dashboard') ||
                          (pathname.startsWith('/api/') && !isPublicApiRoute)

  // Si es una ruta protegida y no hay token, redirigir a login
  if (isProtectedRoute && !token) {
    if (pathname.startsWith('/api/')) {
      // Para rutas de API, devolver 401
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Para rutas de página, redirigir a login
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Si está autenticado e intenta acceder a páginas de auth, redirigir a dashboard
  if (token && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

/**
 * Configuración del middleware
 * Define en qué rutas se ejecuta
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
}
