'use client'

import { useState } from 'react'
import { GibraltarData, GibraltarResult } from '@/types'
import { calculateGibraltarTax } from '@/lib/gibraltarCalculations'
import { Calculator, TrendingDown, TrendingUp } from 'lucide-react'

export default function GibraltarCalculator() {
  const [data, setData] = useState<GibraltarData>({
    annualIncome: 0,
    allowances: 0,
    yearsInGibraltar: 0,
    maritalStatus: 'single',
    hasChildren: false,
    numberOfChildren: 0,
    hasMortgage: false,
    mortgageInterest: 0,
    otherDeductions: 0,
  })

  const [result, setResult] = useState<GibraltarResult | null>(null)

  const handleCalculate = () => {
    const calculatedResult = calculateGibraltarTax(data)
    setResult(calculatedResult)

    // Guardar en localStorage
    localStorage.setItem('gibraltar-data', JSON.stringify(data))
    localStorage.setItem('gibraltar-result', JSON.stringify(calculatedResult))
  }

  const handleInputChange = (field: keyof GibraltarData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-600 p-3 rounded-lg">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Calculadora Gibraltar</h2>
        </div>

        <p className="text-gray-600 mb-8">
          Introduce tus datos para comparar automáticamente entre ABS (Allowance Based System) y GIBS (Gross Income Based System).
        </p>

        {/* Formulario */}
        <div className="space-y-6">
          {/* Ingresos anuales */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ingresos Anuales Brutos (£)
            </label>
            <input
              type="number"
              value={data.annualIncome || ''}
              onChange={(e) => handleInputChange('annualIncome', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: 45000"
            />
          </div>

          {/* Estado civil */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado Civil
            </label>
            <select
              value={data.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="single">Soltero/a</option>
              <option value="married">Casado/a</option>
              <option value="civil_partnership">Pareja de hecho</option>
            </select>
          </div>

          {/* Hijos */}
          <div>
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={data.hasChildren}
                onChange={(e) => {
                  handleInputChange('hasChildren', e.target.checked)
                  if (!e.target.checked) handleInputChange('numberOfChildren', 0)
                }}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-semibold text-gray-700">Tengo hijos</span>
            </label>

            {data.hasChildren && (
              <input
                type="number"
                value={data.numberOfChildren || ''}
                onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Número de hijos"
                min="0"
              />
            )}
          </div>

          {/* Allowances */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Allowances adicionales (£)
            </label>
            <input
              type="number"
              value={data.allowances || ''}
              onChange={(e) => handleInputChange('allowances', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: 5000"
            />
            <p className="text-xs text-gray-500 mt-1">Allowances específicos a los que tienes derecho</p>
          </div>

          {/* Años en Gibraltar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Años trabajando en Gibraltar
            </label>
            <input
              type="number"
              value={data.yearsInGibraltar || ''}
              onChange={(e) => handleInputChange('yearsInGibraltar', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: 3"
              min="0"
            />
          </div>

          {/* Hipoteca */}
          <div>
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={data.hasMortgage}
                onChange={(e) => {
                  handleInputChange('hasMortgage', e.target.checked)
                  if (!e.target.checked) handleInputChange('mortgageInterest', 0)
                }}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-semibold text-gray-700">Tengo hipoteca</span>
            </label>

            {data.hasMortgage && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Intereses de hipoteca anuales (£)
                </label>
                <input
                  type="number"
                  value={data.mortgageInterest || ''}
                  onChange={(e) => handleInputChange('mortgageInterest', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ej: 3000"
                />
              </div>
            )}
          </div>

          {/* Otras deducciones */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Otras deducciones (£)
            </label>
            <input
              type="number"
              value={data.otherDeductions || ''}
              onChange={(e) => handleInputChange('otherDeductions', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: 1000"
            />
          </div>

          {/* Botón calcular */}
          <button
            onClick={handleCalculate}
            className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
          >
            Calcular Impuestos
          </button>
        </div>

        {/* Resultados */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resultados</h3>

              {/* Recomendación destacada */}
              <div className={`p-6 rounded-xl mb-6 ${
                result.system === 'ABS' ? 'bg-green-50 border-2 border-green-500' : 'bg-blue-50 border-2 border-blue-500'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  {result.system === 'ABS' ? (
                    <TrendingDown className="h-8 w-8 text-green-600" />
                  ) : (
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  )}
                  <h4 className="text-xl font-bold">
                    Sistema Recomendado: <span className="text-2xl">{result.system}</span>
                  </h4>
                </div>
                <p className="text-gray-700">{result.recommendation}</p>
              </div>

              {/* Comparación lado a lado */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* ABS */}
                <div className={`p-6 rounded-xl border-2 ${
                  result.system === 'ABS' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}>
                  <h4 className="text-lg font-bold mb-4 flex items-center justify-between">
                    <span>ABS (Allowance Based)</span>
                    {result.system === 'ABS' && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">MEJOR</span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impuesto:</span>
                      <span className="font-semibold">£{result.absCalculation?.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa efectiva:</span>
                      <span className="font-semibold">{result.absCalculation?.effectiveRate}%</span>
                    </div>
                  </div>
                </div>

                {/* GIBS */}
                <div className={`p-6 rounded-xl border-2 ${
                  result.system === 'GIBS' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}>
                  <h4 className="text-lg font-bold mb-4 flex items-center justify-between">
                    <span>GIBS (Gross Income Based)</span>
                    {result.system === 'GIBS' && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">MEJOR</span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impuesto:</span>
                      <span className="font-semibold">£{result.gibsCalculation?.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa efectiva:</span>
                      <span className="font-semibold">{result.gibsCalculation?.effectiveRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen final */}
              <div className="bg-gray-100 p-6 rounded-xl mt-6">
                <h4 className="text-lg font-bold mb-4">Resumen con sistema {result.system}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ingresos anuales</p>
                    <p className="text-2xl font-bold">£{data.annualIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Impuesto a pagar</p>
                    <p className="text-2xl font-bold text-red-600">£{result.taxAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ingreso neto</p>
                    <p className="text-2xl font-bold text-green-600">£{result.netIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tasa efectiva</p>
                    <p className="text-2xl font-bold">{result.effectiveRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
