'use client'

import { useState, useEffect } from 'react'
import { GibraltarData, GibraltarResult } from '@/types'
import { calculateGibraltarTax, PERSONAL_ALLOWANCE } from '@/lib/gibraltarCalculations'
import { allowanceToTaxCode, taxCodeToAllowance, getTaxCodeRange } from '@/lib/taxCodeUtils'
import { formatNumber, parseFormattedNumber } from '@/lib/numberFormat'
import { Calculator, TrendingDown, TrendingUp, Info, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function GibraltarCalculator() {
  const t = useTranslations('Calculator')
  const [data, setData] = useState<GibraltarData>({
    annualIncome: 0,
    totalAllowances: PERSONAL_ALLOWANCE, // Empieza con Minimum Allowance
    taxCode: 4, // Tax Code 4 corresponde al rango £4,300-£4,399
  })

  const [result, setResult] = useState<GibraltarResult | null>(null)
  const [isEditingAllowance, setIsEditingAllowance] = useState(false)
  const [showDetailedComparison, setShowDetailedComparison] = useState(false)

  // Sincronizar Total Allowances <-> Tax Code (solo cuando no está editando)
  useEffect(() => {
    if (isEditingAllowance) return // No actualizar mientras el usuario escribe

    // Actualizar Tax Code cuando cambia Total Allowances
    const newTaxCode = allowanceToTaxCode(data.totalAllowances)
    if (newTaxCode !== null && newTaxCode !== data.taxCode) {
      setData((prev) => ({ ...prev, taxCode: newTaxCode }))
    }
  }, [data.totalAllowances, isEditingAllowance])

  const handleCalculate = () => {
    // Aplicar mínimo antes de calcular
    const finalData = {
      ...data,
      totalAllowances: Math.max(PERSONAL_ALLOWANCE, data.totalAllowances)
    }

    const calculatedResult = calculateGibraltarTax(finalData)
    setResult(calculatedResult)

    // Guardar en localStorage
    localStorage.setItem('gibraltar-data', JSON.stringify(finalData))
    localStorage.setItem('gibraltar-result', JSON.stringify(calculatedResult))
  }

  const handleAllowanceChange = (value: number) => {
    // Permitir escribir libremente, sin forzar el mínimo
    setData((prev) => ({ ...prev, totalAllowances: value }))
  }

  const handleAllowanceBlur = () => {
    // Al salir del campo, aplicar la validación de mínimo
    setIsEditingAllowance(false)
    if (data.totalAllowances < PERSONAL_ALLOWANCE) {
      setData((prev) => ({ ...prev, totalAllowances: PERSONAL_ALLOWANCE }))
    }
  }

  const handleTaxCodeChange = (code: number) => {
    // Validar que el código esté en el rango 1-52
    if (code < 1 || code > 52) return

    // Calcular el allowance correspondiente (punto medio del rango)
    const allowance = taxCodeToAllowance(code)
    if (allowance !== null) {
      setData((prev) => ({
        ...prev,
        taxCode: code,
        totalAllowances: allowance,
      }))
    }
  }

  // Obtener el rango del Tax Code actual
  const taxCodeRange = data.taxCode ? getTaxCodeRange(data.taxCode) : null

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-600 p-3 rounded-lg">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t('Gibraltar.title')}</h2>
        </div>

        <p className="text-gray-600 mb-8">
          {t('Gibraltar.description')}
        </p>

        {/* Alerta de limitaciones versión gratis */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex">
            <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-amber-800 mb-1">
                {t('Gibraltar.freeLimitTitle')}
              </h4>
              <p className="text-sm text-amber-700 mb-2" dangerouslySetInnerHTML={{ __html: t.raw('Gibraltar.freeLimitDesc1') }} />
              <p className="text-sm text-amber-700 mb-2" dangerouslySetInnerHTML={{ __html: t.raw('Gibraltar.freeLimitDesc2') }} />
              <ul className="text-sm text-amber-700 list-disc list-inside ml-2 space-y-1">
                {(t.raw('Gibraltar.freeLimitList') as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="text-sm text-amber-700 mt-3" dangerouslySetInnerHTML={{ __html: t.raw('Gibraltar.premiumPromo') }} />
            </div>
          </div>
        </div>

        {/* Formulario Simplificado */}
        <div className="space-y-6">
          {/* Ingresos anuales */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('Common.annualIncome')}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={data.annualIncome ? formatNumber(data.annualIncome) : ''}
              onChange={(e) => setData((prev) => ({ ...prev, annualIncome: parseFormattedNumber(e.target.value) }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
              style={{ WebkitTextFillColor: '#111827' }}
              placeholder="Ej: 45,000"
            />
          </div>

          {/* Minimum Allowance (informativo, solo lectura) */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  {t('Gibraltar.minimumAllowanceTitle')}
                </label>
                <div className="text-2xl font-bold text-blue-900">£{PERSONAL_ALLOWANCE.toLocaleString()}</div>
                <p className="text-xs text-blue-700 mt-1">
                  {t('Gibraltar.minimumAllowanceDesc', { amount: PERSONAL_ALLOWANCE.toLocaleString() })}
                </p>
              </div>
            </div>
          </div>

          {/* Grid para Total Allowances y Tax Code */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Total Allowances */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('Gibraltar.totalAllowancesLabel')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={data.totalAllowances ? formatNumber(data.totalAllowances) : ''}
                onChange={(e) => handleAllowanceChange(parseFormattedNumber(e.target.value))}
                onFocus={() => setIsEditingAllowance(true)}
                onBlur={handleAllowanceBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                style={{ WebkitTextFillColor: '#111827' }}
                placeholder={`Mínimo: ${formatNumber(PERSONAL_ALLOWANCE)}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('Gibraltar.totalAllowancesDesc')}
              </p>
            </div>

            {/* Tax Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('Gibraltar.taxCodeLabel')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={data.taxCode || ''}
                onChange={(e) => handleTaxCodeChange(parseInt(e.target.value.replace(/\D/g, '')) || 1)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                style={{ WebkitTextFillColor: '#111827' }}
                placeholder={t('Gibraltar.taxCodePlaceholder')}
              />
              <p className="text-xs text-gray-500 mt-1">
                {taxCodeRange && t('Gibraltar.taxCodeRange', {
                  code: data.taxCode,
                  min: taxCodeRange.min.toLocaleString(),
                  maxOrOver: (taxCodeRange.max ? `£${taxCodeRange.max.toLocaleString()}` : 'OVER') as string
                })}
              </p>
            </div>
          </div>

          {/* Nota explicativa */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: t.raw('Gibraltar.taxCodeTip') }} />
          </div>

          {/* Botón calcular */}
          <button
            onClick={handleCalculate}
            disabled={data.annualIncome === 0}
            className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t('Common.calculate')}
          </button>
        </div>

        {/* Resultados */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('Common.results')}</h3>

              {/* Recomendación destacada */}
              <div className={`p-6 rounded-xl mb-6 ${result.system === 'ABS' ? 'bg-green-50 border-2 border-green-500' : 'bg-blue-50 border-2 border-blue-500'
                }`}>
                <div className="flex items-center space-x-3 mb-3">
                  {result.system === 'ABS' ? (
                    <TrendingDown className="h-8 w-8 text-green-600" />
                  ) : (
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  )}
                  <h4 className="text-xl font-bold">
                    {t('Common.recommendedSystem')}: <span className="text-2xl">{result.system}</span>
                  </h4>
                </div>
                <p className="text-gray-700">{result.recommendation}</p>
              </div>

              {/* Comparación lado a lado */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* ABS */}
                <div className={`p-6 rounded-xl border-2 ${result.system === 'ABS' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                  }`}>
                  <h4 className="text-lg font-bold mb-4 flex items-center justify-between">
                    <span>{t('Gibraltar.absTitle')}</span>
                    {result.system === 'ABS' && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">{t('Common.better')}</span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Common.tax')}:</span>
                      <span className="font-semibold">£{result.absCalculation?.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Common.effectiveRate')}:</span>
                      <span className="font-semibold">{result.absCalculation?.effectiveRate}%</span>
                    </div>
                  </div>
                </div>

                {/* GIBS */}
                <div className={`p-6 rounded-xl border-2 ${result.system === 'GIBS' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                  }`}>
                  <h4 className="text-lg font-bold mb-4 flex items-center justify-between">
                    <span>{t('Gibraltar.gibsTitle')}</span>
                    {result.system === 'GIBS' && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">{t('Common.better')}</span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Common.tax')}:</span>
                      <span className="font-semibold">£{result.gibsCalculation?.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Common.effectiveRate')}:</span>
                      <span className="font-semibold">{result.gibsCalculation?.effectiveRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen final */}
              <div className="bg-gray-100 p-6 rounded-xl mt-6">
                <h4 className="text-lg font-bold mb-4">{t('Gibraltar.summaryTitle', { system: result.system })}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('Common.annualIncome')}</p>
                    <p className="text-2xl font-bold">£{data.annualIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('Gibraltar.totalAllowancesLabel')}</p>
                    <p className="text-2xl font-bold">£{data.totalAllowances.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('Common.taxToPay')}</p>
                    <p className="text-2xl font-bold text-red-600">£{result.taxAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('Common.netIncome')}</p>
                    <p className="text-2xl font-bold text-green-600">£{result.netIncome.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Botón Comparar Detalles */}
              <div className="mt-6">
                <button
                  onClick={() => setShowDetailedComparison(!showDetailedComparison)}
                  className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>{showDetailedComparison ? t('Common.hideDetails') : t('Common.compareDetails')}</span>
                </button>
              </div>

              {/* Comparación Detallada */}
              {showDetailedComparison && (
                <div className="mt-6 bg-white border-2 border-gray-300 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Comparación Detallada de Impuestos</h4>

                  {/* Tablas lado a lado */}
                  <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Tabla ABS */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-bold text-gray-800">
                          {t('Gibraltar.absTitle')}
                        </h5>
                        {result.system === 'ABS' && (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {t('Common.better')}
                          </span>
                        )}
                      </div>

                      {/* Allowances Info */}
                      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('Gibraltar.grossIncome')}:</span>
                            <span className="font-semibold">£{data.annualIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('Gibraltar.totalAllowancesLabel')}:</span>
                            <span className="font-semibold">£{result.absCalculation?.totalAllowances?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-gray-600">{t('Gibraltar.taxableBase')}:</span>
                            <span className="font-semibold">
                              £{(data.annualIncome - (result.absCalculation?.totalAllowances || 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tabla de tramos ABS */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                              <th className="text-left py-2 px-2 font-semibold">{t('Common.table.bracket')}</th>
                              <th className="text-right py-2 px-2 font-semibold">{t('Common.table.rate')}</th>
                              <th className="text-right py-2 px-2 font-semibold">{t('Common.table.amount')}</th>
                              <th className="text-right py-2 px-2 font-semibold">{t('Common.table.tax')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.absCalculation?.breakdown?.map((bracket, idx) => (
                              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-2">{bracket.range}</td>
                                <td className="text-right py-2 px-2">{(bracket.rate * 100).toFixed(0)}%</td>
                                <td className="text-right py-2 px-2">£{bracket.taxableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="text-right py-2 px-2 font-semibold">£{bracket.taxOnBracket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            ))}
                            <tr className="border-t-2 border-gray-300 bg-gray-50">
                              <td className="py-2 px-2 font-semibold" colSpan={3}>{t('Common.table.subtotal')}</td>
                              <td className="text-right py-2 px-2 font-semibold">£{result.absCalculation?.taxBeforeCredit?.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-2 text-green-700" colSpan={3}>
                                {t('Gibraltar.taxCredit', { max: 300, percent: 2 })}
                              </td>
                              <td className="text-right py-2 px-2 text-green-700 font-semibold">
                                -£{result.absCalculation?.taxCredit?.toLocaleString()}
                              </td>
                            </tr>
                            <tr className="bg-green-50 border-t-2 border-green-500 font-bold">
                              <td className="py-2 px-2" colSpan={3}>{t('Common.table.total')} ABS</td>
                              <td className="text-right py-2 px-2">£{result.absCalculation?.taxAmount.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Tabla GIBS */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-bold text-gray-800">
                          {t('Gibraltar.gibsTitle')}
                        </h5>
                        {result.system === 'GIBS' && (
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {t('Common.better')}
                          </span>
                        )}
                      </div>

                      {/* Info GIBS */}
                      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('Gibraltar.grossIncome')}:</span>
                            <span className="font-semibold">£{data.annualIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-gray-600">{t('Gibraltar.taxableBase')}:</span>
                            <span className="font-semibold">£{data.annualIncome.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tabla de tramos GIBS */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                              <th className="text-left py-2 px-2 font-semibold">{t('Common.table.bracket')}</th>
                              <th className="text-right py-2 px-2 font-semibold">{t('Common.table.rate')}</th>
                              <th className="text-right py-2 px-2 font-semibold">{t('Common.table.amount')}</th>
                              <th className="text-right py-2 px-2 font-semibold">{t('Common.table.tax')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.gibsCalculation?.breakdown?.map((bracket, idx) => (
                              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-2">{bracket.range}</td>
                                <td className="text-right py-2 px-2">{(bracket.rate * 100).toFixed(0)}%</td>
                                <td className="text-right py-2 px-2">£{bracket.taxableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="text-right py-2 px-2 font-semibold">£{bracket.taxOnBracket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            ))}
                            <tr className="bg-blue-50 border-t-2 border-blue-500 font-bold">
                              <td className="py-2 px-2" colSpan={3}>{t('Common.table.total')} GIBS</td>
                              <td className="text-right py-2 px-2">£{result.gibsCalculation?.taxAmount.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Comparación Final */}
                  <div className={`p-6 rounded-xl ${result.system === 'ABS' ? 'bg-green-50 border-2 border-green-500' : 'bg-blue-50 border-2 border-blue-500'
                    }`}>
                    <h5 className="text-lg font-bold mb-4">{t('Common.difference')}</h5>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">ABS {t('Common.table.total')}</p>
                        <p className="text-xl font-bold">£{result.absCalculation?.taxAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">GIBS {t('Common.table.total')}</p>
                        <p className="text-xl font-bold">£{result.gibsCalculation?.taxAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          {result.system === 'ABS' ? `${t('Common.saving')} ABS` : `${t('Common.saving')} GIBS`}
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          £{Math.abs((result.absCalculation?.taxAmount || 0) - (result.gibsCalculation?.taxAmount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
