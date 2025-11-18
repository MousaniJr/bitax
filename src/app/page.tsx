'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Calculator, FileText, Shield, Users, CheckCircle, AlertCircle, LogIn, UserPlus, LayoutDashboard } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BiTax</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#como-funciona" className="text-gray-700 hover:text-blue-600">Cómo funciona</a>
            <a href="#funcionalidades" className="text-gray-700 hover:text-blue-600">Funcionalidades</a>
            <a href="#suscripcion" className="text-gray-700 hover:text-blue-600">Suscripción</a>
          </div>
          <div className="flex items-center gap-3">
            {status === 'authenticated' ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden sm:inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Sección 1 - Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          La forma más fácil de gestionar tus impuestos entre{' '}
          <span className="text-blue-600">España</span> y{' '}
          <span className="text-red-600">Gibraltar</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Cálculos estimados, guías claras y comparación automática entre sistemas fiscales.
        </p>
        <Link
          href="/webapp"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Abrir WebApp →
        </Link>

        {/* Disclaimer destacado */}
        <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-3xl mx-auto">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
            <div className="ml-3 text-left">
              <p className="text-sm text-yellow-700">
                <strong>Aviso importante:</strong> Esta herramienta utiliza cálculos estimados basados en normativa vigente.
                Los resultados pueden no ser exactos. Recomendamos consultar con un asesor fiscal especializado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2 - Qué hace la webapp */}
      <section id="funcionalidades" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            ¿Qué hace la WebApp?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Herramientas profesionales para gestionar tus obligaciones fiscales en ambos países
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Declaración España */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Declaración España</h3>
              <p className="text-gray-700">
                Resultado estimado de IRPF considerando ingresos en ambos países y aplicación
                del convenio de doble imposición.
              </p>
            </div>

            {/* Declaración Gibraltar */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Declaración Gibraltar</h3>
              <p className="text-gray-700">
                Comparación automática entre ABS y GIBS. Te mostramos cuál es la opción
                más beneficiosa para tu situación específica.
              </p>
            </div>

            {/* Guías completas */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Guías Completas</h3>
              <p className="text-gray-700">
                Instrucciones paso a paso para realizar tus declaraciones fiscales en
                ambos sistemas, con ejemplos prácticos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3 - Cómo funciona */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            ¿Cómo funciona?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Rellenas los datos', desc: 'Introduce tu información fiscal de forma sencilla' },
              { step: '2', title: 'Cálculo automático', desc: 'El sistema procesa tu información al instante' },
              { step: '3', title: 'Mejor opción', desc: 'Te mostramos el resultado óptimo para ambos países' },
              { step: '4', title: 'Datos seguros', desc: 'No guardamos datos salvo que pagues suscripción (RGPD)' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección 4 - Suscripción */}
      <section id="suscripcion" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Planes y Precios
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plan Gratuito */}
            <div className="bg-white p-8 rounded-xl shadow-md border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Uso Gratuito</h3>
              <p className="text-gray-600 mb-6">Ideal para consultas ocasionales</p>
              <p className="text-4xl font-bold text-gray-900 mb-6">0€</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Usar la herramienta completa</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Cálculos estimados ilimitados</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Descargar PDF de resultados</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Los datos se borran al salir</span>
                </li>
              </ul>

              <Link
                href="/webapp"
                className="block w-full bg-gray-600 text-white text-center px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Usar Gratis
              </Link>
            </div>

            {/* Plan Premium */}
            <div className="bg-blue-600 p-8 rounded-xl shadow-xl border-2 border-blue-700 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg rounded-tr-lg font-semibold text-sm">
                Recomendado
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Suscripción Anual</h3>
              <p className="text-blue-100 mb-6">Para usuarios frecuentes</p>
              <p className="text-4xl font-bold text-white mb-1">39€</p>
              <p className="text-blue-200 mb-6">por año</p>

              <ul className="space-y-3 mb-8 text-white">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Todo del plan gratuito</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Guardar tus datos año tras año</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Historial y comparación entre años</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Informes detallados en PDF</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Recordatorios automáticos de plazos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Actualizaciones fiscales automáticas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Soporte prioritario</span>
                </li>
              </ul>

              <Link
                href="/auth/signup"
                className="block w-full bg-white text-blue-600 text-center px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Crear Cuenta Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 5 - Disclaimer legal */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-8 w-8 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-3">Aviso Legal Importante</h3>
              <p className="text-gray-300 leading-relaxed">
                Esta herramienta utiliza cálculos estimados basados en la normativa vigente en España y Gibraltar.
                Dado que las leyes fiscales cambian con frecuencia y cada situación personal es única, los resultados
                proporcionados pueden no ser exactos o aplicables a su caso específico. Esta plataforma tiene fines
                informativos y educativos, y <strong>no sustituye el asesoramiento profesional</strong>. Recomendamos
                encarecidamente consultar con un asesor fiscal especializado en fiscalidad internacional antes de
                tomar cualquier decisión relacionada con sus obligaciones tributarias. BiTax no se hace responsable
                de las decisiones tomadas en base a la información proporcionada por esta herramienta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 BiTax - Gestión de Impuestos España-Gibraltar
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Desarrollado para ayudar a trabajadores transfronterizos
          </p>
        </div>
      </footer>
    </div>
  )
}
