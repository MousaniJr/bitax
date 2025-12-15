'use client'

import { useState } from 'react'
import { SpainData, SpainResult } from '@/types'
import { calculateSpainTax } from '@/lib/spainCalculations'
import { formatNumber, parseFormattedNumber } from '@/lib/numberFormat'
import { Calculator, FileText, AlertCircle, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'

type IncomeSource = 'gibraltar' | 'spain' | 'both'

export default function SpainCalculator() {
  const t = useTranslations('Calculator')
  const [incomeSource, setIncomeSource] = useState<IncomeSource | null>(null)

  const [data, setData] = useState<SpainData>({
    incomeSpain: 0,
    incomeGibraltar: 0,
    socialSecurityContributions: 0,
    gibraltarTaxPaid: 0,
    gibraltarSocialSecurity: 0,
    maritalStatus: 'single',
    hasChildren: false,
    numberOfChildren: 0,
    shareChildrenMinimumWithSpouse: false,
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
      setData((prev) => ({ ...prev, incomeGibraltar: 0, gibraltarTaxPaid: 0, gibraltarSocialSecurity: 0 }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t('Spain.title')}</h2>
        </div>

        <p className="text-gray-600 mb-6">
          {t('Spain.description')}
        </p>

        {/* Alerta de limitaciones versión gratis */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-amber-800 mb-1">
                {t('Spain.freeLimitTitle')}
              </h4>
              <p className="text-sm text-amber-700 mb-2" dangerouslySetInnerHTML={{ __html: t.raw('Spain.freeLimitDesc1') }} />
              <p className="text-sm text-amber-700 mb-2" dangerouslySetInnerHTML={{ __html: t.raw('Spain.freeLimitDesc2') }} />
              <ul className="text-sm text-amber-700 list-disc list-inside ml-2 space-y-1">
                {(t.raw('Spain.freeLimitList') as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="text-sm text-amber-700 mt-3" dangerouslySetInnerHTML={{ __html: t.raw('Spain.premiumPromo') }} />
            </div>
          </div>
        </div>

        {/* Selector de origen de ingresos */}
        {!incomeSource && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('Spain.incomeSourceTitle')}
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
                  <h4 className="font-bold text-gray-900">{t('Spain.sources.gibraltar')}</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {t('Spain.sources.gibraltarDesc')}
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
                  <h4 className="font-bold text-gray-900">{t('Spain.sources.spain')}</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {t('Spain.sources.spainDesc')}
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
                  <h4 className="font-bold text-gray-900">{t('Spain.sources.both')}</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {t('Spain.sources.bothDesc')}
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
                <MapPin className={`h-5 w-5 ${incomeSource === 'gibraltar' ? 'text-red-600' :
                  incomeSource === 'spain' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                <span className="font-semibold text-gray-900">
                  {incomeSource === 'gibraltar' && t('Spain.currentSource.gibraltar')}
                  {incomeSource === 'spain' && t('Spain.currentSource.spain')}
                  {incomeSource === 'both' && t('Spain.currentSource.both')}
                </span>
              </div>
              <button
                onClick={() => {
                  setIncomeSource(null)
                  setResult(null)
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
              >
                {t('Spain.changeSource')}
              </button>
            </div>

            {/* Aviso según origen */}
            {(incomeSource === 'gibraltar' || incomeSource === 'both') && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700" dangerouslySetInnerHTML={{ __html: t.raw('Spain.dtaWarning') }} />
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
                    {t('Spain.inputs.incomeSpain')}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.incomeSpain ? formatNumber(data.incomeSpain) : ''}
                    onChange={(e) => handleInputChange('incomeSpain', parseFormattedNumber(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    style={{ WebkitTextFillColor: '#111827' }}
                    placeholder="Ej: 25.000"
                  />
                </div>
              )}

              {/* Ingresos de Gibraltar */}
              {(incomeSource === 'gibraltar' || incomeSource === 'both') && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Spain.inputs.incomeGibraltar')}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={data.incomeGibraltar ? formatNumber(data.incomeGibraltar) : ''}
                      onChange={(e) => handleInputChange('incomeGibraltar', parseFormattedNumber(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      style={{ WebkitTextFillColor: '#111827' }}
                      placeholder="Ej: 35.000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('Spain.inputs.convertTip')}
                    </p>
                  </div>

                  {/* Seguridad Social Gibraltar */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Spain.inputs.socialSecurityGib')}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={data.gibraltarSocialSecurity ? formatNumber(data.gibraltarSocialSecurity) : ''}
                      onChange={(e) => handleInputChange('gibraltarSocialSecurity', parseFormattedNumber(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      style={{ WebkitTextFillColor: '#111827' }}
                      placeholder="Ej: 2.500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('Spain.inputs.socialSecurityGibDesc')}
                    </p>
                  </div>

                  {/* Impuesto pagado en Gibraltar */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Spain.inputs.taxPaidGib')}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={data.gibraltarTaxPaid ? formatNumber(data.gibraltarTaxPaid) : ''}
                      onChange={(e) => handleInputChange('gibraltarTaxPaid', parseFormattedNumber(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      style={{ WebkitTextFillColor: '#111827' }}
                      placeholder="Ej: 4.200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('Spain.inputs.taxPaidGibDesc')}
                    </p>
                  </div>
                </>
              )}

              {/* Comunidad Autónoma */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Spain.inputs.autonomousCommunity')}
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
                    {t('Spain.inputs.socialSecurity')}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.socialSecurityContributions ? formatNumber(data.socialSecurityContributions) : ''}
                    onChange={(e) => handleInputChange('socialSecurityContributions', parseFormattedNumber(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    style={{ WebkitTextFillColor: '#111827' }}
                    placeholder="Ej: 3.000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('Spain.inputs.socialSecurityDesc')}
                  </p>
                </div>
              )}

              {/* Retenciones (solo si tiene ingresos en España) */}
              {(incomeSource === 'spain' || incomeSource === 'both') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('Spain.inputs.retentions')}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.retentions ? formatNumber(data.retentions) : ''}
                    onChange={(e) => handleInputChange('retentions', parseFormattedNumber(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    style={{ WebkitTextFillColor: '#111827' }}
                    placeholder="Ej: 5.000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('Spain.inputs.retentionsDesc')}
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
              {t('Spain.inputs.calculate')}
            </button>
          </div>
        )}

        {/* Resultados */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('Spain.results.title')}</h3>

              {/* Resultado final destacado */}
              <div className={`p-6 rounded-xl mb-6 ${result.finalTax > 0
                ? 'bg-red-50 border-2 border-red-500'
                : 'bg-green-50 border-2 border-green-500'
                }`}>
                <h4 className="text-xl font-bold mb-2">
                  {result.finalTax > 0 ? t('Spain.results.toPay') : t('Spain.results.toReturn')}
                </h4>
                <p className="text-4xl font-bold">
                  {result.finalTax > 0 ? '+' : ''}{result.finalTax.toLocaleString()}€
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {t('Spain.results.finalDesc')}
                </p>
              </div>

              {/* Desglose detallado */}
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h4 className="text-lg font-bold mb-4">{t('Spain.results.breakdown')}</h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('Spain.results.grossIncome')}</p>
                    <p className="text-2xl font-bold">{result.grossIncome.toLocaleString()}€</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('Spain.results.grossIncomeDesc', { spain: data.incomeSpain.toLocaleString(), gibraltar: data.incomeGibraltar.toLocaleString() })}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('Spain.results.generalBase')}</p>
                    <p className="text-2xl font-bold">{result.generalBase.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('Spain.results.stateTax')}</p>
                    <p className="text-xl font-semibold text-blue-600">{result.stateTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('Spain.results.regionalTax')}</p>
                    <p className="text-xl font-semibold text-blue-600">{result.regionalTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('Spain.results.totalTax')}</p>
                    <p className="text-xl font-semibold">{result.totalTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('Spain.results.effectiveRate')}</p>
                    <p className="text-xl font-semibold">{result.effectiveRate}%</p>
                  </div>

                  {result.doubleTaxationRelief > 0 && (
                    <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                      <p className="text-sm text-green-700 font-semibold">{t('Spain.results.dtrTitle')}</p>
                      <p className="text-xl font-bold text-green-700">-{result.doubleTaxationRelief.toLocaleString()}€</p>
                      <p className="text-xs text-green-600 mt-1">
                        {t('Spain.results.dtrDesc')}
                      </p>
                    </div>
                  )}

                  {result.deductions > 0 && (
                    <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                      <p className="text-sm text-blue-700 font-semibold">{t('Spain.results.deductions')}</p>
                      <p className="text-xl font-bold text-blue-700">-{result.deductions.toLocaleString()}€</p>
                    </div>
                  )}

                  <div className="bg-gray-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('Spain.results.retentions')}</p>
                    <p className="text-xl font-semibold">-{data.retentions.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('Spain.results.netIncome')}</p>
                    <p className="text-2xl font-bold text-green-600">{result.netIncome.toLocaleString()}€</p>
                  </div>
                </div>
              </div>

              {/* Explicación convenio */}
              {result.doubleTaxationRelief > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                  <p className="text-sm text-blue-700" dangerouslySetInnerHTML={{ __html: (t.raw('Spain.results.dtrExplanation') as string).replace('{amount}', result.doubleTaxationRelief.toLocaleString()) }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
