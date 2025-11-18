'use client'

import { useState } from 'react'
import { SpainData, SpainResult } from '@/types'
import { calculateSpainTax } from '@/lib/spainCalculations'
import { Calculator, FileText, AlertCircle, MapPin } from 'lucide-react'

type IncomeSource = 'gibraltar' | 'spain' | 'both'

export default function SpainCalculator() {
  const [incomeSource, setIncomeSource] = useState<IncomeSource | null>(null)

  const [data, setData] = useState<SpainData>({
    incomeSpain: 0,
    incomeGibraltar: 0,
    socialSecurityContributions: 0,
    maritalStatus: 'single',
    hasChildren: false,
    numberOfChildren: 0,
    childrenUnder3: 0,
    hasDisabledDependents: false,
    hasMortgage: false,
    mortgageAmount: 0,
    isPrimaryResidence: false,
    purchaseYear: new Date().getFullYear(),
    regionalDeductions: 0,
    maternityPaternity: 0,
    retentions: 0,
    autonomousCommunity: 'andalucia',
  })

  const [result, setResult] = useState<SpainResult | null>(null)

  const handleCalculate = () => {
    const calculatedResult = calculateSpainTax(data)
    setResult(calculatedResult)

    // Guardar en localStorage
    localStorage.setItem('spain-income-source', incomeSource || '')
    localStorage.setItem('spain-data', JSON.stringify(data))
    localStorage.setItem('spain-result', JSON.stringify(calculatedResult))
  }

  const handleInputChange = (field: keyof SpainData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleIncomeSourceChange = (source: IncomeSource) => {
    setIncomeSource(source)
    // Reset income fields based on source
    if (source === 'gibraltar') {
      setData((prev) => ({ ...prev, incomeSpain: 0 }))
    } else if (source === 'spain') {
      setData((prev) => ({ ...prev, incomeGibraltar: 0 }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Calculadora España (IRPF)</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Calcula tu declaración de la renta en España. Versión simplificada para cálculo rápido.
        </p>

        {/* Selector de origen de ingresos */}
        {!incomeSource && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿De dónde has obtenido tus ingresos en el año fiscal?
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Solo Gibraltar */}
              <button
                onClick={() => handleIncomeSourceChange('gibraltar')}
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Solo Gibraltar</h4>
                </div>
                <p className="text-sm text-gray-600">
                  He trabajado únicamente en Gibraltar
                </p>
              </button>

              {/* Solo España */}
              <button
                onClick={() => handleIncomeSourceChange('spain')}
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Solo España</h4>
                </div>
                <p className="text-sm text-gray-600">
                  He trabajado únicamente en España
                </p>
              </button>

              {/* Ambos */}
              <button
                onClick={() => handleIncomeSourceChange('both')}
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Ambos Países</h4>
                </div>
                <p className="text-sm text-gray-600">
                  He trabajado en Gibraltar y España
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Formulario según origen */}
        {incomeSource && (
          <div className="space-y-6">
            {/* Botón para cambiar selección */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className={`h-5 w-5 ${
                  incomeSource === 'gibraltar' ? 'text-red-600' :
                  incomeSource === 'spain' ? 'text-blue-600' :
                  'text-purple-600'
                }`} />
                <span className="font-semibold text-gray-900">
                  {incomeSource === 'gibraltar' && 'Ingresos solo de Gibraltar'}
                  {incomeSource === 'spain' && 'Ingresos solo de España'}
                  {incomeSource === 'both' && 'Ingresos de ambos países'}
                </span>
              </div>
              <button
                onClick={() => {
                  setIncomeSource(null)
                  setResult(null)
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
              >
                Cambiar
              </button>
            </div>

            {/* Aviso según origen */}
            {(incomeSource === 'gibraltar' || incomeSource === 'both') && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Convenio de doble imposición:</strong> Los impuestos pagados en Gibraltar
                      se descuentan de tu declaración española para evitar doble tributación.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Campos según origen */}
            <div className="space-y-6">
              {/* Ingresos de España */}
              {(incomeSource === 'spain' || incomeSource === 'both') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ingresos anuales en España (€) *
                  </label>
                  <input
                    type="number"
                    value={data.incomeSpain || ''}
                    onChange={(e) => handleInputChange('incomeSpain', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 25000"
                  />
                </div>
              )}

              {/* Ingresos de Gibraltar */}
              {(incomeSource === 'gibraltar' || incomeSource === 'both') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ingresos anuales en Gibraltar (€) *
                  </label>
                  <input
                    type="number"
                    value={data.incomeGibraltar || ''}
                    onChange={(e) => handleInputChange('incomeGibraltar', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 35000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Convertir libras a euros al tipo de cambio medio anual
                  </p>
                </div>
              )}

              {/* Comunidad Autónoma */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comunidad Autónoma de residencia *
                </label>
                <select
                  value={data.autonomousCommunity}
                  onChange={(e) => handleInputChange('autonomousCommunity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="andalucia">Andalucía</option>
                  <option value="aragon">Aragón</option>
                  <option value="asturias">Asturias</option>
                  <option value="baleares">Baleares</option>
                  <option value="canarias">Canarias</option>
                  <option value="cantabria">Cantabria</option>
                  <option value="castilla-leon">Castilla y León</option>
                  <option value="castilla-mancha">Castilla-La Mancha</option>
                  <option value="cataluna">Cataluña</option>
                  <option value="valencia">Comunidad Valenciana</option>
                  <option value="extremadura">Extremadura</option>
                  <option value="galicia">Galicia</option>
                  <option value="madrid">Madrid</option>
                  <option value="murcia">Murcia</option>
                  <option value="navarra">Navarra</option>
                  <option value="pais-vasco">País Vasco</option>
                  <option value="rioja">La Rioja</option>
                </select>
              </div>

              {/* Cotizaciones SS (solo si tiene ingresos en España) */}
              {(incomeSource === 'spain' || incomeSource === 'both') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cotizaciones a la Seguridad Social (€)
                  </label>
                  <input
                    type="number"
                    value={data.socialSecurityContributions || ''}
                    onChange={(e) => handleInputChange('socialSecurityContributions', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 3000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cotizaciones deducibles de tu base imponible
                  </p>
                </div>
              )}

              {/* Retenciones (solo si tiene ingresos en España) */}
              {(incomeSource === 'spain' || incomeSource === 'both') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Retenciones practicadas (€)
                  </label>
                  <input
                    type="number"
                    value={data.retentions || ''}
                    onChange={(e) => handleInputChange('retentions', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    IRPF retenido en tus nóminas españolas
                  </p>
                </div>
              )}
            </div>

            {/* Botón calcular */}
            <button
              onClick={handleCalculate}
              disabled={
                (incomeSource === 'spain' && data.incomeSpain === 0) ||
                (incomeSource === 'gibraltar' && data.incomeGibraltar === 0) ||
                (incomeSource === 'both' && (data.incomeSpain === 0 || data.incomeGibraltar === 0))
              }
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Calcular Declaración IRPF
            </button>
          </div>
        )}

        {/* Resultados */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Resultado de tu Declaración</h3>

              {/* Resultado final destacado */}
              <div className={`p-6 rounded-xl mb-6 ${
                result.finalTax > 0
                  ? 'bg-red-50 border-2 border-red-500'
                  : 'bg-green-50 border-2 border-green-500'
              }`}>
                <h4 className="text-xl font-bold mb-2">
                  {result.finalTax > 0 ? 'A pagar' : 'A devolver'}
                </h4>
                <p className="text-4xl font-bold">
                  {result.finalTax > 0 ? '+' : ''}{result.finalTax.toLocaleString()}€
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Resultado final de la declaración (diferencia entre impuesto total y retenciones)
                </p>
              </div>

              {/* Desglose detallado */}
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h4 className="text-lg font-bold mb-4">Desglose detallado</h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Ingresos brutos totales</p>
                    <p className="text-2xl font-bold">{result.grossIncome.toLocaleString()}€</p>
                    <p className="text-xs text-gray-500 mt-1">
                      España: {data.incomeSpain.toLocaleString()}€ + Gibraltar: {data.incomeGibraltar.toLocaleString()}€
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Base liquidable general</p>
                    <p className="text-2xl font-bold">{result.generalBase.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Cuota estatal</p>
                    <p className="text-xl font-semibold text-blue-600">{result.stateTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Cuota autonómica</p>
                    <p className="text-xl font-semibold text-blue-600">{result.regionalTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Impuesto total</p>
                    <p className="text-xl font-semibold">{result.totalTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tasa efectiva</p>
                    <p className="text-xl font-semibold">{result.effectiveRate}%</p>
                  </div>

                  {result.doubleTaxationRelief > 0 && (
                    <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                      <p className="text-sm text-green-700 font-semibold">Crédito por doble imposición</p>
                      <p className="text-xl font-bold text-green-700">-{result.doubleTaxationRelief.toLocaleString()}€</p>
                      <p className="text-xs text-green-600 mt-1">
                        Por impuestos pagados en Gibraltar
                      </p>
                    </div>
                  )}

                  {result.deductions > 0 && (
                    <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                      <p className="text-sm text-blue-700 font-semibold">Deducciones aplicadas</p>
                      <p className="text-xl font-bold text-blue-700">-{result.deductions.toLocaleString()}€</p>
                    </div>
                  )}

                  <div className="bg-gray-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Retenciones practicadas</p>
                    <p className="text-xl font-semibold">-{data.retentions.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Ingreso neto estimado</p>
                    <p className="text-2xl font-bold text-green-600">{result.netIncome.toLocaleString()}€</p>
                  </div>
                </div>
              </div>

              {/* Explicación convenio */}
              {result.doubleTaxationRelief > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                  <p className="text-sm text-blue-700">
                    <strong>Convenio de doble imposición:</strong> Se ha aplicado un crédito de{' '}
                    {result.doubleTaxationRelief.toLocaleString()}€ correspondiente a los impuestos pagados en Gibraltar.
                    Esto evita que pagues impuestos dos veces sobre los mismos ingresos.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
