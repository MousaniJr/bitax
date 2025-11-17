import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * API Route handler para NextAuth
 * Maneja todas las rutas de autenticación: /api/auth/*
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
