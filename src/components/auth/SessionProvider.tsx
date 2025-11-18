'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

/**
 * Wrapper del SessionProvider de NextAuth
 * Debe usarse en el nivel superior de la app
 */
export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
