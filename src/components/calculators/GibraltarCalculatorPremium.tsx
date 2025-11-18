'use client'

import { useState, useEffect } from 'react'
import { GibraltarData, GibraltarResult, GibraltarAllowances } from '@/types'
import { calculateGibraltarTax, PERSONAL_ALLOWANCE } from '@/lib/gibraltarCalculations'
import { allowanceToTaxCode } from '@/lib/taxCodeUtils'
import { Calculator, TrendingDown, TrendingUp, Info, Crown, Check, Save } from 'lucide-react'

// Valores oficiales de allowances 2024/2025
const ALLOWANCE_VALUES = {
  personal: 3455,
  spouse: 3455,
  child: 1190,
  childAbroad: 1375,
  dependentRelative: 400,
  disabled: 10000,
  singleParent: 5800,
  nurseryMax: 5480,
  homePurchase: 13000,
  homePurchaseAnnual: 1000,
  medicalMax: 5395,
  seniorUnmarried: 9055,
  seniorMarried: 5600,
}

interface Props {
  onSave?: (data: GibraltarData, result: GibraltarResult) => void
  isPremium?: boolean
}

export default function GibraltarCalculatorPremium({ onSave, isPremium = true }: Props) {
  // Estado básico
  const [annualIncome, setAnnualIncome] = useState(0)
  const [result, setResult] = useState<GibraltarResult | null>(null)
  const [showDetailedComparison, setShowDetailedComparison] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Estado de allowances detallados
  const [allowances, setAllowances] = useState<GibraltarAllowances>({
    personalAllowance: true,
    spouseAllowance: false,
    numberOfChildren: 0,
    childrenEducatedAbroad: 0,
    dependentRelatives: 0,
    disabledIndividual: false,
    singleParent: false,
    nurserySchool: 0,
    homePurchaseAllowance: false,
    homePurchaseYearsRemaining: 0,
    mortgagePrincipal: 0,
    medicalInsurance: 0,
    lifeAssurance: 0,
    pensionContributions: 0,
    isSeniorCitizen: false,
    seniorCitizenMarried: false,
  })

  // Calcular total de allowances
  const calculateTotalAllowances = (): number => {
    let total = 0

    // Personal
    if (allowances.personalAllowance) total += ALLOWANCE_VALUES.personal

    // Familia
    if (allowances.spouseAllowance) total += ALLOWANCE_VALUES.spouse
    total += allowances.numberOfChildren * ALLOWANCE_VALUES.child
    total += allowances.childrenEducatedAbroad * ALLOWANCE_VALUES.childAbroad
    total += Math.min(allowances.dependentRelatives * ALLOWANCE_VALUES.dependentRelative, 1200) // max 3 relatives
    if (allowances.disabledIndividual) total += ALLOWANCE_VALUES.disabled
    if (allowances.singleParent) total += ALLOWANCE_VALUES.singleParent
    total += Math.min(allowances.nurserySchool, ALLOWANCE_VALUES.nurseryMax)

    // Vivienda
    if (allowances.homePurchaseAllowance) total += ALLOWANCE_VALUES.homePurchase
    total += Math.min(allowances.homePurchaseYearsRemaining * ALLOWANCE_VALUES.homePurchaseAnnual, 4000)

    // Mortgage Interest (estimado como 3% del principal)
    const estimatedInterest = allowances.mortgagePrincipal * 0.03
    total += estimatedInterest

    // Seguros y pensiones
    total += Math.min(allowances.medicalInsurance, ALLOWANCE_VALUES.medicalMax)
    total += Math.min(allowances.lifeAssurance, annualIncome / 7)
    total += Math.min(allowances.pensionContributions, Math.min(annualIncome * 0.2, 35000))

    // Senior Citizens
    if (allowances.isSeniorCitizen) {
      total += allowances.seniorCitizenMarried ? ALLOWANCE_VALUES.seniorMarried : ALLOWANCE_VALUES.seniorUnmarried
    }

    // Aplicar mínimo garantizado
    return Math.max(total, PERSONAL_ALLOWANCE)
  }

  const totalAllowances = calculateTotalAllowances()
  const taxCode = allowanceToTaxCode(totalAllowances)

  const handleCalculate = () => {
    const data: GibraltarData = {
      annualIncome,
      totalAllowances,
      taxCode: taxCode || undefined,
    }

    const calculatedResult = calculateGibraltarTax(data)
    setResult(calculatedResult)

    // Guardar en localStorage
    localStorage.setItem('gibraltar-data-premium', JSON.stringify({ data, allowances }))
    localStorage.setItem('gibraltar-result', JSON.stringify(calculatedResult))
  }

  const handleSave = async () => {
    if (!result || !onSave) return

    setIsSaving(true)
    try {
      const data: GibraltarData = {
        annualIncome,
        totalAllowances,
        taxCode: taxCode || undefined,
      }
      await onSave(data, result)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-3 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Calculadora Gibraltar</h2>
          </div>
          {isPremium && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-full">
              <Crown className="w-4 h-4" />
              Premium
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-8">
          Selecciona tus allowances y deducciones para calcular automáticamente tu impuesto óptimo entre ABS y GIBS.
        </p>

        {/* Ingresos anuales */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ingresos Anuales Brutos (£) *
          </label>
          <input
            type="number"
            value={annualIncome || ''}
            onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            placeholder="Ej: 45000"
          />
        </div>

        {/* Allowances Section */}
        <div className="space-y-6">
          {/* Personal & Family */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Personal y Familia</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Personal Allowance */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <input
                  type="checkbox"
                  checked={allowances.personalAllowance}
                  onChange={(e) => setAllowances(prev => ({ ...prev, personalAllowance: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Personal Allowance</div>
                  <div className="text-sm text-gray-500">£{ALLOWANCE_VALUES.personal.toLocaleString()}</div>
                </div>
                {allowances.personalAllowance && <Check className="w-5 h-5 text-green-600" />}
              </label>

              {/* Spouse Allowance */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <input
                  type="checkbox"
                  checked={allowances.spouseAllowance}
                  onChange={(e) => setAllowances(prev => ({ ...prev, spouseAllowance: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Spouse / Civil Partner</div>
                  <div className="text-sm text-gray-500">£{ALLOWANCE_VALUES.spouse.toLocaleString()}</div>
                </div>
                {allowances.spouseAllowance && <Check className="w-5 h-5 text-green-600" />}
              </label>

              {/* Children */}
              <div className="p-3 bg-white rounded-lg">
                <label className="font-medium">Hijos (Child Allowance)</label>
                <div className="text-sm text-gray-500 mb-2">£{ALLOWANCE_VALUES.child.toLocaleString()} por hijo</div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={allowances.numberOfChildren}
                  onChange={(e) => setAllowances(prev => ({ ...prev, numberOfChildren: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Children Educated Abroad */}
              <div className="p-3 bg-white rounded-lg">
                <label className="font-medium">Hijos Educados en el Extranjero</label>
                <div className="text-sm text-gray-500 mb-2">£{ALLOWANCE_VALUES.childAbroad.toLocaleString()} por hijo</div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={allowances.childrenEducatedAbroad}
                  onChange={(e) => setAllowances(prev => ({ ...prev, childrenEducatedAbroad: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Single Parent */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <input
                  type="checkbox"
                  checked={allowances.singleParent}
                  onChange={(e) => setAllowances(prev => ({ ...prev, singleParent: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Single Parent Allowance</div>
                  <div className="text-sm text-gray-500">£{ALLOWANCE_VALUES.singleParent.toLocaleString()}</div>
                </div>
              </label>

              {/* Disabled */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <input
                  type="checkbox"
                  checked={allowances.disabledIndividual}
                  onChange={(e) => setAllowances(prev => ({ ...prev, disabledIndividual: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Disabled Individual</div>
                  <div className="text-sm text-gray-500">£{ALLOWANCE_VALUES.disabled.toLocaleString()}</div>
                </div>
              </label>

              {/* Nursery School */}
              <div className="p-3 bg-white rounded-lg">
                <label className="font-medium">Nursery School Allowance</label>
                <div className="text-sm text-gray-500 mb-2">Hasta £{ALLOWANCE_VALUES.nurseryMax.toLocaleString()}</div>
                <input
                  type="number"
                  min="0"
                  max={ALLOWANCE_VALUES.nurseryMax}
                  value={allowances.nurserySchool}
                  onChange={(e) => setAllowances(prev => ({ ...prev, nurserySchool: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              {/* Dependent Relatives */}
              <div className="p-3 bg-white rounded-lg">
                <label className="font-medium">Dependent Relatives</label>
                <div className="text-sm text-gray-500 mb-2">Hasta £{ALLOWANCE_VALUES.dependentRelative} c/u (max 3)</div>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={allowances.dependentRelatives}
                  onChange={(e) => setAllowances(prev => ({ ...prev, dependentRelatives: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Housing */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Vivienda</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Home Purchase Allowance */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-green-100 transition">
                <input
                  type="checkbox"
                  checked={allowances.homePurchaseAllowance}
                  onChange={(e) => setAllowances(prev => ({ ...prev, homePurchaseAllowance: e.target.checked }))}
                  className="w-5 h-5 text-green-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Home Purchase Allowance</div>
                  <div className="text-sm text-gray-500">£{ALLOWANCE_VALUES.homePurchase.toLocaleString()} (una vez)</div>
                </div>
              </label>

              {/* Home Purchase Annual */}
              <div className="p-3 bg-white rounded-lg">
                <label className="font-medium">Home Purchase (Anual)</label>
                <div className="text-sm text-gray-500 mb-2">£1,000/año (max 4 años = £4,000)</div>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={allowances.homePurchaseYearsRemaining}
                  onChange={(e) => setAllowances(prev => ({ ...prev, homePurchaseYearsRemaining: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Años restantes"
                />
              </div>

              {/* Mortgage Principal */}
              <div className="p-3 bg-white rounded-lg md:col-span-2">
                <label className="font-medium">Préstamo Hipotecario (Principal)</label>
                <div className="text-sm text-gray-500 mb-2">Intereses deducibles sobre máx £350,000 (estimamos 3% anual)</div>
                <input
                  type="number"
                  min="0"
                  max="350000"
                  value={allowances.mortgagePrincipal}
                  onChange={(e) => setAllowances(prev => ({ ...prev, mortgagePrincipal: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ej: 250000"
                />
                {allowances.mortgagePrincipal > 0 && (
                  <div className="mt-2 text-sm text-green-700">
                    Interés estimado deducible: £{(allowances.mortgagePrincipal * 0.03).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insurance & Pension */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Seguros y Pensiones</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Medical Insurance */}
              <div className="p-3 bg-white rounded-lg">
                <label className="font-medium">Medical Insurance</label>
                <div className="text-sm text-gray-500 mb-2">Hasta £{ALLOWANCE_VALUES.medicalMax.toLocaleString()}</div>
                <input
                  type="number"
                  min="0"
                  max={ALLOWANCE_VALUES.medicalMax}
                  value={allowances.medicalInsurance}
                  onChange={(e) => setAllowances(prev => ({ ...prev, medicalInsurance: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Prima anual"
                />
              </div>

              {/* Pension Contributions */}
              <div className="p-3 bg-white rounded-lg">
                <label className="font-medium">Pension Contributions</label>
                <div className="text-sm text-gray-500 mb-2">Hasta 20% ingresos o £35,000</div>
                <input
                  type="number"
                  min="0"
                  value={allowances.pensionContributions}
                  onChange={(e) => setAllowances(prev => ({ ...prev, pensionContributions: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Aportación anual"
                />
              </div>

              {/* Life Assurance */}
              <div className="p-3 bg-white rounded-lg md:col-span-2">
                <label className="font-medium">Life Assurance</label>
                <div className="text-sm text-gray-500 mb-2">Hasta 1/7 de tus ingresos (£{Math.round(annualIncome / 7).toLocaleString()})</div>
                <input
                  type="number"
                  min="0"
                  value={allowances.lifeAssurance}
                  onChange={(e) => setAllowances(prev => ({ ...prev, lifeAssurance: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Prima anual"
                />
              </div>
            </div>
          </div>

          {/* Senior Citizens */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">Senior Citizens (60+ mujeres, 65+ hombres)</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-orange-100 transition">
                <input
                  type="checkbox"
                  checked={allowances.isSeniorCitizen}
                  onChange={(e) => setAllowances(prev => ({ ...prev, isSeniorCitizen: e.target.checked }))}
                  className="w-5 h-5 text-orange-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Soy Senior Citizen</div>
                  <div className="text-sm text-gray-500">Allowance adicional disponible</div>
                </div>
              </label>

              {allowances.isSeniorCitizen && (
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-orange-100 transition">
                  <input
                    type="checkbox"
                    checked={allowances.seniorCitizenMarried}
                    onChange={(e) => setAllowances(prev => ({ ...prev, seniorCitizenMarried: e.target.checked }))}
                    className="w-5 h-5 text-orange-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Casado/a o Civil Partner</div>
                    <div className="text-sm text-gray-500">
                      {allowances.seniorCitizenMarried
                        ? `£${ALLOWANCE_VALUES.seniorMarried.toLocaleString()}`
                        : `Soltero/a: £${ALLOWANCE_VALUES.seniorUnmarried.toLocaleString()}`}
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Total Allowances Summary */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Allowances</h3>
              <p className="text-sm text-gray-600">
                Tax Code: {taxCode || '-'} | Mínimo garantizado: £{PERSONAL_ALLOWANCE.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              £{totalAllowances.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={annualIncome <= 0}
          className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calcular Impuesto
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Recommendation */}
            <div className={`p-6 rounded-lg ${result.system === 'ABS' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border`}>
              <div className="flex items-start gap-4">
                {result.system === 'ABS' ? (
                  <TrendingDown className="w-8 h-8 text-blue-600 flex-shrink-0" />
                ) : (
                  <TrendingUp className="w-8 h-8 text-green-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Sistema Recomendado: {result.system}
                  </h3>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Impuesto a Pagar</p>
                <p className="text-3xl font-bold text-gray-900">£{result.taxAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Tasa Efectiva</p>
                <p className="text-3xl font-bold text-gray-900">{result.effectiveRate}%</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Ingreso Neto</p>
                <p className="text-3xl font-bold text-green-600">£{result.netIncome.toLocaleString()}</p>
              </div>
            </div>

            {/* Save Button for Premium */}
            {isPremium && onSave && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Guardando...' : 'Guardar Declaración'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
