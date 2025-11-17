'use client'

import { useState } from 'react'
import { SpainData, SpainResult } from '@/types'
import { calculateSpainTax } from '@/lib/spainCalculations'
import { Calculator, FileText, AlertCircle } from 'lucide-react'

export default function SpainCalculator() {
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
    localStorage.setItem('spain-data', JSON.stringify(data))
    localStorage.setItem('spain-result', JSON.stringify(calculatedResult))
  }

  const handleInputChange = (field: keyof SpainData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
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

        <p className="text-gray-600 mb-4">
          Calcula tu declaración de la renta en España considerando tus ingresos en Gibraltar y el convenio de doble imposición.
        </p>

        {/* Aviso importante */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Este cálculo aplica el convenio de doble imposición España-Gibraltar. Los impuestos pagados en Gibraltar
                se pueden descontar de tu declaración española.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-6">
          {/* Ingresos en España */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ingresos anuales en España (€)
            </label>
            <input
              type="number"
              value={data.incomeSpain || ''}
              onChange={(e) => handleInputChange('incomeSpain', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 20000"
            />
          </div>

          {/* Ingresos en Gibraltar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ingresos anuales en Gibraltar (€)
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

          {/* Cotizaciones Seguridad Social */}
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
          </div>

          {/* Retenciones */}
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

          {/* Estado civil */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado Civil
            </label>
            <select
              value={data.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="single">Soltero/a</option>
              <option value="married">Casado/a</option>
              <option value="divorced">Divorciado/a</option>
              <option value="widowed">Viudo/a</option>
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
                  if (!e.target.checked) {
                    handleInputChange('numberOfChildren', 0)
                    handleInputChange('childrenUnder3', 0)
                  }
                }}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">Tengo hijos</span>
            </label>

            {data.hasChildren && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Número total de hijos
                  </label>
                  <input
                    type="number"
                    value={data.numberOfChildren || ''}
                    onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Hijos menores de 3 años
                  </label>
                  <input
                    type="number"
                    value={data.childrenUnder3 || ''}
                    onChange={(e) => handleInputChange('childrenUnder3', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 1"
                    min="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Comunidad Autónoma */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comunidad Autónoma de residencia
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

          {/* Hipoteca */}
          <div>
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={data.hasMortgage}
                onChange={(e) => {
                  handleInputChange('hasMortgage', e.target.checked)
                  if (!e.target.checked) {
                    handleInputChange('mortgageAmount', 0)
                    handleInputChange('isPrimaryResidence', false)
                  }
                }}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">Tengo hipoteca de vivienda habitual</span>
            </label>

            {data.hasMortgage && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Cantidad pagada por hipoteca en el año (€)
                  </label>
                  <input
                    type="number"
                    value={data.mortgageAmount || ''}
                    onChange={(e) => handleInputChange('mortgageAmount', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 6000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Año de compra de la vivienda
                  </label>
                  <input
                    type="number"
                    value={data.purchaseYear || ''}
                    onChange={(e) => handleInputChange('purchaseYear', parseInt(e.target.value) || new Date().getFullYear())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 2010"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo deducible si se compró antes de 2013
                  </p>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={data.isPrimaryResidence}
                    onChange={(e) => handleInputChange('isPrimaryResidence', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Es mi vivienda habitual</span>
                </label>
              </div>
            )}
          </div>

          {/* Maternidad/Paternidad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deducción por maternidad/paternidad (€)
            </label>
            <input
              type="number"
              value={data.maternityPaternity || ''}
              onChange={(e) => handleInputChange('maternityPaternity', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 1200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hasta 1.200€ por hijo menor de 3 años
            </p>
          </div>

          {/* Deducciones autonómicas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deducciones autonómicas adicionales (€)
            </label>
            <input
              type="number"
              value={data.regionalDeductions || ''}
              onChange={(e) => handleInputChange('regionalDeductions', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 500"
            />
          </div>

          {/* Botón calcular */}
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
          >
            Calcular Declaración IRPF
          </button>
        </div>

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
