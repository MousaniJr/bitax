'use client'

import { useState } from 'react'
import Link from 'next/link'
import GibraltarCalculator from '@/components/calculators/GibraltarCalculator'
import SpainCalculator from '@/components/calculators/SpainCalculator'
import GibraltarGuide from '@/components/guides/GibraltarGuide'
import SpainGuide from '@/components/guides/SpainGuide'
import { Calculator, FileText, BookOpen, Home, AlertCircle } from 'lucide-react'

type TabType = 'gibraltar' | 'spain' | 'guide-gibraltar' | 'guide-spain'

export default function WebAppPage() {
  const [activeTab, setActiveTab] = useState<TabType>('gibraltar')

  const tabs = [
    { id: 'gibraltar' as TabType, label: 'Gibraltar', icon: Calculator, color: 'red' },
    { id: 'spain' as TabType, label: 'España', icon: FileText, color: 'blue' },
    { id: 'guide-gibraltar' as TabType, label: 'Guía Gibraltar', icon: BookOpen, color: 'red' },
    { id: 'guide-spain' as TabType, label: 'Guía España', icon: BookOpen, color: 'blue' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Home className="h-6 w-6 text-gray-600" />
            <span className="text-xl font-bold text-gray-900">BiTax</span>
          </Link>
          <div className="text-sm text-gray-600">
            WebApp - Calculadora Fiscal
          </div>
        </nav>
      </header>

      {/* Disclaimer banner */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              <strong>Aviso:</strong> Cálculos estimados. No sustituye asesoramiento profesional. Consulta con un experto fiscal.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const colorClasses = tab.color === 'red'
                ? isActive
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-50'
                : isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-sm ${colorClasses}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'gibraltar' && <GibraltarCalculator />}
          {activeTab === 'spain' && <SpainCalculator />}
          {activeTab === 'guide-gibraltar' && <GibraltarGuide />}
          {activeTab === 'guide-spain' && <SpainGuide />}
        </div>

        {/* Info sobre datos */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            Tus datos están seguros
          </h3>
          <p className="text-blue-800 mb-4">
            En el modo gratuito, todos tus datos se guardan únicamente en tu navegador (localStorage).
            No se envían a ningún servidor. Al cerrar la sesión o borrar datos del navegador, toda la
            información se eliminará automáticamente.
          </p>
          <p className="text-blue-700 text-sm">
            Con la suscripción premium (próximamente), podrás crear una cuenta para guardar tu historial
            de manera segura y acceder desde cualquier dispositivo.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Volver a inicio
          </Link>
          <p className="text-gray-400 mt-2 text-sm">
            © 2024 BiTax - Gestión de Impuestos España-Gibraltar
          </p>
        </div>
      </footer>
    </div>
  )
}
