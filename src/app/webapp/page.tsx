'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import GibraltarCalculator from '@/components/calculators/GibraltarCalculator'
import GibraltarCalculatorPremium from '@/components/calculators/GibraltarCalculatorPremium'
import SpainCalculator from '@/components/calculators/SpainCalculator'
import SpainCalculatorPremium from '@/components/calculators/SpainCalculatorPremium'
import GibraltarGuide from '@/components/guides/GibraltarGuide'
import SpainGuide from '@/components/guides/SpainGuide'
import { Calculator, FileText, BookOpen, Home, AlertCircle, Crown, Download, User } from 'lucide-react'
import { GibraltarDataPremium, GibraltarResult, SpainDataPremium, SpainResult } from '@/types'

type TabType = 'gibraltar' | 'spain' | 'guide-gibraltar' | 'guide-spain'

export default function WebAppPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<TabType>('gibraltar')
  const [isPremium, setIsPremium] = useState(false)
  const [usePremiumMode, setUsePremiumMode] = useState(false)

  // Check subscription status
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/subscription/status')
        .then(res => res.json())
        .then(data => {
          setIsPremium(data.hasPremium || false)
          setUsePremiumMode(data.hasPremium || false)
        })
        .catch(() => setIsPremium(false))
    }
  }, [session])

  // Save declaration to database
  const handleSaveGibraltar = async (data: GibraltarDataPremium, result: GibraltarResult) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: new Date().getFullYear(),
          type: 'gibraltar',
          data: { gibraltarData: data, gibraltarResult: result },
        }),
      })

      if (response.ok) {
        alert('Declaración guardada correctamente')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar')
      }
    } catch (error) {
      alert('Error al guardar la declaración')
    }
  }

  const handleSaveSpain = async (data: SpainDataPremium, result: SpainResult) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: new Date().getFullYear(),
          type: 'spain',
          data: { spainData: data, spainResult: result },
        }),
      })

      if (response.ok) {
        alert('Declaración guardada correctamente')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar')
      }
    } catch (error) {
      alert('Error al guardar la declaración')
    }
  }

  // Export to PDF
  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: html2canvas } = await import('html2canvas')

    const content = document.getElementById('calculator-content')
    if (!content) return

    try {
      const canvas = await html2canvas(content, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`bitax-${activeTab}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      alert('Error al exportar PDF')
    }
  }

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
          <div className="flex items-center space-x-4">
            {isPremium && (
              <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-semibold">Premium</span>
              </div>
            )}
            {session ? (
              <Link href="/dashboard" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                Iniciar Sesión
              </Link>
            )}
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
        {/* Premium Mode Toggle & Tabs */}
        <div className="mb-8">
          {/* Premium controls */}
          {isPremium && (
            <div className="flex items-center justify-between mb-4 bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-gray-900">Modo Premium</span>
                <label className="relative inline-flex items-center cursor-pointer ml-2">
                  <input
                    type="checkbox"
                    checked={usePremiumMode}
                    onChange={(e) => setUsePremiumMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
              {(activeTab === 'gibraltar' || activeTab === 'spain') && (
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar PDF</span>
                </button>
              )}
            </div>
          )}

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
        <div id="calculator-content">
          {activeTab === 'gibraltar' && (
            usePremiumMode ? (
              <GibraltarCalculatorPremium
                isPremium={isPremium}
                onSave={handleSaveGibraltar}
              />
            ) : (
              <GibraltarCalculator />
            )
          )}
          {activeTab === 'spain' && (
            usePremiumMode ? (
              <SpainCalculatorPremium
                isPremium={isPremium}
                onSave={handleSaveSpain}
              />
            ) : (
              <SpainCalculator />
            )
          )}
          {activeTab === 'guide-gibraltar' && <GibraltarGuide />}
          {activeTab === 'guide-spain' && <SpainGuide />}
        </div>

        {/* Info sobre datos */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            Tus datos están seguros
          </h3>
          {isPremium ? (
            <>
              <p className="text-blue-800 mb-4">
                Como usuario premium, tus declaraciones se guardan de forma segura en la nube.
                Puedes acceder a tu historial desde cualquier dispositivo y exportar a PDF.
              </p>
              <p className="text-blue-700 text-sm">
                Accede al <Link href="/dashboard" className="text-blue-600 hover:underline font-semibold">Dashboard</Link> para
                ver tu historial completo, comparar años y configurar recordatorios.
              </p>
            </>
          ) : (
            <>
              <p className="text-blue-800 mb-4">
                En el modo gratuito, todos tus datos se guardan únicamente en tu navegador (localStorage).
                No se envían a ningún servidor. Al cerrar la sesión o borrar datos del navegador, toda la
                información se eliminará automáticamente.
              </p>
              <p className="text-blue-700 text-sm">
                Con la <Link href="/dashboard/subscription" className="text-blue-600 hover:underline font-semibold">suscripción premium</Link>,
                podrás guardar tu historial de manera segura, exportar a PDF y acceder desde cualquier dispositivo.
              </p>
            </>
          )}
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
