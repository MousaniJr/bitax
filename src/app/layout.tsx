import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/auth/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BiTax - Impuestos España-Gibraltar',
  description: 'La forma más fácil de gestionar tus impuestos entre España y Gibraltar. Cálculos estimados, guías claras y comparación automática entre sistemas fiscales.',
  keywords: ['impuestos', 'Gibraltar', 'España', 'IRPF', 'ABS', 'GIBS', 'doble imposición'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
