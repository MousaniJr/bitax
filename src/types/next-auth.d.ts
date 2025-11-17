import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

/**
 * Extensión de tipos para NextAuth
 * Añade propiedades personalizadas a User y Session
 */

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      subscription?: {
        plan: string
        status: string
        endDate: Date | null
      }
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    subscription?: {
      plan: string
      status: string
      endDate: Date | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
  }
}
