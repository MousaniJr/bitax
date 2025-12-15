import { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Error de Autenticación - BiTax',
  description: 'Ha ocurrido un error durante la autenticación',
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessages: Record<string, string> = {
    Configuration: 'Hay un problema con la configuración del servidor.',
    AccessDenied: 'No tienes permisos para acceder.',
    Verification: 'El enlace de verificación ha expirado o ya fue usado.',
    Default: 'Ha ocurrido un error durante la autenticación.',
  }

  const error = searchParams?.error || 'Default'
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Error card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error de Autenticación
            </h1>

            {/* Error message */}
            <p className="text-gray-600 mb-8">
              {errorMessage}
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
              >
                Volver a intentar
              </Link>

              <Link
                href="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition inline-flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Support info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Si el problema persiste, por favor contacta con soporte.
          </p>
        </div>
      </div>
    </div>
  )
}
