'use client'

import { useEffect, useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
} from 'lucide-react'

interface Declaration {
  id: string
  year: number
  type: string
  gibraltarResult: any
  spainResult: any
}

export default function ComparePage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [year1, setYear1] = useState<string>('')
  const [year2, setYear2] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDeclarations()
  }, [])

  const fetchDeclarations = async () => {
    try {
      const res = await fetch('/api/declarations?limit=100')
      if (res.ok) {
        const data = await res.json()
        setDeclarations(data.declarations || [])

        // Auto-select last two years if available
        const years = Array.from(new Set(data.declarations.map((d: Declaration) => d.year)))
          .sort((a, b) => b - a)
        if (years.length >= 2) {
          setYear1(years[0].toString())
          setYear2(years[1].toString())
        } else if (years.length === 1) {
          setYear1(years[0].toString())
        }
      }
    } catch (error) {
      console.error('Error fetching declarations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const availableYears = Array.from(
    new Set(declarations.map(d => d.year))
  ).sort((a, b) => b - a)

  const getDeclarationForYear = (year: string) => {
    return declarations.find(d => d.year === parseInt(year))
  }

  const declaration1 = year1 ? getDeclarationForYear(year1) : null
  const declaration2 = year2 ? getDeclarationForYear(year2) : null

  const extractMetrics = (declaration: Declaration | null) => {
    if (!declaration) return null

    const gibraltar = declaration.gibraltarResult || {}
    const spain = declaration.spainResult || {}

    return {
      gibraltarIncome: gibraltar.grossIncome || 0,
      gibraltarTax: gibraltar.taxAmount || 0,
      gibraltarNet: gibraltar.netIncome || 0,
      gibraltarRate: gibraltar.effectiveRate || 0,
      spainIncome: spain.grossIncome || 0,
      spainTax: spain.totalTax || 0,
      spainNet: spain.netIncome || 0,
      spainRate: spain.effectiveRate || 0,
      totalTax: (gibraltar.taxAmount || 0) + (spain.totalTax || 0),
      totalIncome: (gibraltar.grossIncome || 0) + (spain.grossIncome || 0),
    }
  }

  const metrics1 = extractMetrics(declaration1)
  const metrics2 = extractMetrics(declaration2)

  const calculateDifference = (val1: number, val2: number) => {
    if (!val2) return { value: 0, percent: 0, trend: 'neutral' as const }
    const diff = val1 - val2
    const percent = ((diff / val2) * 100)
    const trend = diff > 0 ? 'up' as const : diff < 0 ? 'down' as const : 'neutral' as const
    return { value: diff, percent, trend }
  }

  const ComparisonRow = ({
    label,
    value1,
    value2,
    format = 'currency',
  }: {
    label: string
    value1: number
    value2: number
    format?: 'currency' | 'percent'
  }) => {
    const diff = calculateDifference(value1, value2)

    const formatValue = (val: number) => {
      if (format === 'currency') {
        return `${val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`
      } else {
        return `${val.toFixed(2)}%`
      }
    }

    return (
      <div className="grid grid-cols-4 gap-4 py-4 border-b border-gray-200">
        <div className="font-medium text-gray-700">{label}</div>
        <div className="text-right text-gray-900">{formatValue(value1)}</div>
        <div className="text-right text-gray-900">{formatValue(value2)}</div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            {diff.trend === 'up' && (
              <TrendingUp className="w-4 h-4 text-green-600" />
            )}
            {diff.trend === 'down' && (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            {diff.trend === 'neutral' && (
              <Minus className="w-4 h-4 text-gray-400" />
            )}
            <span className={`text-sm font-medium ${
              diff.trend === 'up' ? 'text-green-600' :
              diff.trend === 'down' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {diff.percent > 0 ? '+' : ''}{diff.percent.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Comparación Año a Año
        </h1>
        <p className="text-gray-600">
          Analiza la evolución de tus impuestos entre diferentes años
        </p>
      </div>

      {/* Year Selectors */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año 1
            </label>
            <select
              value={year1}
              onChange={(e) => setYear1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar año</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año 2
            </label>
            <select
              value={year2}
              onChange={(e) => setYear2(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar año</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {year1 && year2 && metrics1 && metrics2 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Comparativa Detallada
              </h2>
            </div>
          </div>

          <div className="p-6">
            {/* Headers */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b-2 border-gray-300">
              <div className="font-semibold text-gray-900">Concepto</div>
              <div className="text-right font-semibold text-gray-900">{year1}</div>
              <div className="text-right font-semibold text-gray-900">{year2}</div>
              <div className="text-right font-semibold text-gray-900">Variación</div>
            </div>

            {/* Ingresos */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Ingresos</h3>
              <ComparisonRow
                label="Ingresos Gibraltar"
                value1={metrics1.gibraltarIncome}
                value2={metrics2.gibraltarIncome}
              />
              <ComparisonRow
                label="Ingresos España"
                value1={metrics1.spainIncome}
                value2={metrics2.spainIncome}
              />
              <ComparisonRow
                label="Ingresos Totales"
                value1={metrics1.totalIncome}
                value2={metrics2.totalIncome}
              />
            </div>

            {/* Impuestos */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Impuestos</h3>
              <ComparisonRow
                label="Impuesto Gibraltar"
                value1={metrics1.gibraltarTax}
                value2={metrics2.gibraltarTax}
              />
              <ComparisonRow
                label="Impuesto España"
                value1={metrics1.spainTax}
                value2={metrics2.spainTax}
              />
              <ComparisonRow
                label="Impuestos Totales"
                value1={metrics1.totalTax}
                value2={metrics2.totalTax}
              />
            </div>

            {/* Tasas Efectivas */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Tasas Efectivas</h3>
              <ComparisonRow
                label="Tasa Gibraltar"
                value1={metrics1.gibraltarRate}
                value2={metrics2.gibraltarRate}
                format="percent"
              />
              <ComparisonRow
                label="Tasa España"
                value1={metrics1.spainRate}
                value2={metrics2.spainRate}
                format="percent"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Selecciona dos años para ver la comparación
          </p>
        </div>
      )}

      {/* Info */}
      {declarations.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                No hay declaraciones para comparar
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Crea al menos dos declaraciones para diferentes años para poder compararlas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
