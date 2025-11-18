import { Metadata } from 'next'
import Link from 'next/link'
import SignUpForm from '@/components/auth/SignUpForm'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Crear Cuenta - BiTax',
  description: 'Crea tu cuenta en BiTax y comienza a gestionar tus impuestos',
}

export default function SignUpPage() {
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
      <SignUpForm />

      {/* Benefits */}
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            ¿Por qué crear una cuenta?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Guarda tus declaraciones fiscales de forma segura</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Compara tus impuestos año tras año</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Exporta tus cálculos a PDF</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Recibe recordatorios de plazos fiscales</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Info */}
      <div className="max-w-md mx-auto mt-8 text-center text-sm text-gray-600">
        <p>
          Esta plataforma NO sustituye el asesoramiento profesional.
        </p>
      </div>
    </div>
  )
}
