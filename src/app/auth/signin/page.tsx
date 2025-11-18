import { Metadata } from 'next'
import Link from 'next/link'
import SignInForm from '@/components/auth/SignInForm'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Iniciar Sesión - BiTax',
  description: 'Inicia sesión en tu cuenta de BiTax',
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to home */}
      <div className="max-w-md mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      {/* Form */}
      <SignInForm />

      {/* Info */}
      <div className="max-w-md mx-auto mt-8 text-center text-sm text-gray-600">
        <p>
          Esta plataforma NO sustituye el asesoramiento profesional.
        </p>
      </div>
    </div>
  )
}
