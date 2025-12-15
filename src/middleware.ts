import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware para proteger rutas y manejar i18n
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware called for path:', pathname);

  // 1. Manejo de API (sin i18n, solo auth)
  if (pathname.startsWith('/api')) {
    const publicApiRoutes = ['/api/auth'];
    const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));

    if (isPublicApiRoute) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Lógica de Autenticación para Páginas
  // Excluir archivos estáticos y de sistema si el matcher falla (aunque el matcher debería encargarse)
  const isAsset = pathname.includes('.') || pathname.startsWith('/_next');
  if (isAsset) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Determinar la ruta sin el locale para chequear protección
  // pathname podría ser /es/dashboard, /en-GI/dashboard, o /dashboard (si no tiene locale aún)
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  let pathWithoutLocale = pathname;
  if (!pathnameIsMissingLocale) {
    const segments = pathname.split('/');
    // segments[0] is empty, segments[1] is locale
    pathWithoutLocale = '/' + segments.slice(2).join('/');
  }

  // Normalizar path vacío
  if (pathWithoutLocale === '') pathWithoutLocale = '/';

  const isProtectedRoute = pathWithoutLocale.startsWith('/dashboard');
  const isAuthPage = pathWithoutLocale.startsWith('/auth/signin') || pathWithoutLocale.startsWith('/auth/signup');

  if (isProtectedRoute && !token) {
    // Redirigir a login, preservando el locale si existe, o usando el default 'es'
    const locale = !pathnameIsMissingLocale ? pathname.split('/')[1] : 'es';
    const url = new URL(`/${locale}/auth/signin`, request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && token) {
    const locale = !pathnameIsMissingLocale ? pathname.split('/')[1] : 'es';
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 3. Aplicar middleware de i18n
  return intlMiddleware(request);
}

export const config = {
  // Ajustar matcher para next-intl y nuestras rutas
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
