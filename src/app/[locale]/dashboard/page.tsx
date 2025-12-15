'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  FileText,
  TrendingUp,
  Calendar,
  Calculator,
  Download,
  Plus,
  ArrowRight,
} from 'lucide-react'
import StatsWidget from '@/components/dashboard/StatsWidget'
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus'

interface Declaration {
  id: string
  year: number
  type: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    thisYear: 0,
    completed: 0,
  })

  useEffect(() => {
    fetchDeclarations()
  }, [])

  const fetchDeclarations = async () => {
    try {
      const res = await fetch('/api/declarations?limit=5')
      if (res.ok) {
        const data = await res.json()
        setDeclarations(data.declarations || [])
        calculateStats(data.declarations || [])
      }
    } catch (error) {
      console.error('Error fetching declarations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (decs: Declaration[]) => {
    const currentYear = new Date().getFullYear()
    setStats({
      total: decs.length,
      thisYear: decs.filter(d => d.year === currentYear).length,
      completed: decs.filter(d => d.status === 'completed').length,
    })
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido, {session?.user?.name || 'Usuario'}!
        </h1>
        <p className="text-gray-600">
          Gestiona tus declaraciones fiscales de España y Gibraltar
        </p>
      </div>

      {/* Subscription Status */}
      <SubscriptionStatus />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsWidget
          title="Declaraciones Totales"
          value={stats.total}
          subtitle="Guardadas en tu cuenta"
          icon={FileText}
          color="blue"
        />
        <StatsWidget
          title="Este Año"
          value={stats.thisYear}
          subtitle={`Declaraciones de ${new Date().getFullYear()}`}
          icon={Calendar}
          color="green"
        />
        <StatsWidget
          title="Completadas"
          value={stats.completed}
          subtitle="Listas para presentar"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/webapp"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition group"
          >
            <div className="p-2 bg-blue-600 rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Nueva Declaración</p>
              <p className="text-sm text-gray-600">Gibraltar o España</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
          </Link>

          <Link
            href="/dashboard/history"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition group"
          >
            <div className="p-2 bg-purple-600 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Ver Historial</p>
              <p className="text-sm text-gray-600">Todas tus declaraciones</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
          </Link>

          <Link
            href="/dashboard/compare"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition group"
          >
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Comparar Años</p>
              <p className="text-sm text-gray-600">Análisis histórico</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
          </Link>

          <Link
            href="/dashboard/reminders"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition group"
          >
            <div className="p-2 bg-orange-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Recordatorios</p>
              <p className="text-sm text-gray-600">Próximos plazos</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
          </Link>
        </div>
      </div>

      {/* Recent Declarations */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Declaraciones Recientes
          </h2>
          <Link
            href="/dashboard/history"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : declarations.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Aún no has creado ninguna declaración
            </p>
            <Link
              href="/webapp"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Crear primera declaración
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {declarations.map((declaration) => (
              <div
                key={declaration.id}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Declaración {declaration.year}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        declaration.type === 'BOTH'
                          ? 'bg-purple-100 text-purple-700'
                          : declaration.type === 'GIBRALTAR'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {declaration.type === 'BOTH' ? 'España + Gibraltar' :
                         declaration.type === 'GIBRALTAR' ? 'Gibraltar' : 'España'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        declaration.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : declaration.status === 'filed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {declaration.status === 'completed' ? 'Completada' :
                         declaration.status === 'filed' ? 'Presentada' : 'Borrador'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Última actualización:{' '}
                      {new Date(declaration.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/history`}
                    className="ml-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Important Dates */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-500 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Fechas Importantes
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>Gibraltar:</strong> Declaración hasta el 30 de Noviembre (año fiscal Julio-Junio)
              </li>
              <li>
                <strong>España:</strong> Campaña de la Renta del 3 de Abril al 30 de Junio
              </li>
            </ul>
            <Link
              href="/dashboard/reminders"
              className="inline-flex items-center gap-2 mt-4 text-orange-700 hover:text-orange-800 font-medium text-sm"
            >
              Configurar recordatorios
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
