import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import SessionProvider from '@/components/auth/SessionProvider'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BiTax - Impuestos España-Gibraltar',
  description: 'La forma más fácil de gestionar tus impuestos entre España y Gibraltar. Cálculos estimados, guías claras y comparación automática entre sistemas fiscales.',
  keywords: ['impuestos', 'Gibraltar', 'España', 'IRPF', 'ABS', 'GIBS', 'doble imposición'],
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
