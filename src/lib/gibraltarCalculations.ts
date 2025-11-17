import { GibraltarData, GibraltarResult } from '@/types'

/**
 * Calcula el impuesto bajo el sistema ABS (Allowance Based System)
 * Sistema tradicional basado en allowances y tasas progresivas
 *
 * Referencias:
 * - Tax Codes 2024/2025: Allowances desde £4,000 hasta £11,100+
 * - Fuente: Gibraltar Income Tax Office
 */
export function calculateABS(data: GibraltarData): { taxAmount: number; effectiveRate: number } {
  const {
    annualIncome,
    allowances,
    maritalStatus,
    hasChildren,
    numberOfChildren,
    hasMortgage,
    mortgageInterest,
    otherDeductions,
  } = data

  // Allowances base (según documentación oficial 2024/25)
  let totalAllowances = allowances || 0

  // Personal allowance estándar (Tax Code aproximado 52 = £11,100+)
  // Para la mayoría de residentes está entre £4,000 - £11,100 según tax code
  const personalAllowance = 11100 // Allowance máximo estándar

  // Married Person's Allowance (adicional para casados)
  // Aproximadamente £3,200 adicional
  if (maritalStatus === 'married' || maritalStatus === 'civil_partnership') {
    totalAllowances += 3200
  }

  // Child Allowance (por cada hijo dependiente)
  // Aproximadamente £1,200 por hijo
  if (hasChildren && numberOfChildren > 0) {
    totalAllowances += numberOfChildren * 1200
  }

  // Deducción de intereses de hipoteca (Mortgage Interest Relief)
  // Limitado a £25,000 de intereses anuales
  const mortgageDeduction = hasMortgage ? Math.min(mortgageInterest, 25000) : 0

  // Total de deducciones
  const totalDeductions = totalAllowances + personalAllowance + mortgageDeduction + otherDeductions

  // Base imponible (Gross Income minus Allowances)
  const taxableIncome = Math.max(0, annualIncome - totalDeductions)

  // Tasas progresivas ABS (según normativa Gibraltar 2024/25)
  // Estas tasas son aproximadas y pueden variar según actualizaciones
  let tax = 0
  const brackets = [
    { limit: 4000, rate: 0.17 },    // Primeros £4,000 al 17%
    { limit: 16000, rate: 0.20 },   // £4,001 - £16,000 al 20%
    { limit: 25000, rate: 0.22 },   // £16,001 - £25,000 al 22%
    { limit: 40000, rate: 0.27 },   // £25,001 - £40,000 al 27%
    { limit: Infinity, rate: 0.28 }, // Más de £40,000 al 28%
  ]

  let remaining = taxableIncome
  let previousLimit = 0

  for (const bracket of brackets) {
    const bracketSize = bracket.limit - previousLimit
    const taxableInBracket = Math.min(remaining, bracketSize)

    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate
      remaining -= taxableInBracket
    }

    if (remaining <= 0) break
    previousLimit = bracket.limit
  }

  const effectiveRate = annualIncome > 0 ? (tax / annualIncome) * 100 : 0

  return {
    taxAmount: Math.round(tax * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  }
}

/**
 * Calcula el impuesto bajo el sistema GIBS (Gross Income Based System)
 * Sistema más simple basado en ingresos brutos con tasa fija
 *
 * Referencias:
 * - Tax Code "X" - Standard Rate 20% (según documentación oficial 2024/25)
 * - Fuente: Gibraltar Income Tax Office
 */
export function calculateGIBS(data: GibraltarData): { taxAmount: number; effectiveRate: number } {
  const { annualIncome, maritalStatus, hasChildren, numberOfChildren } = data

  // GIBS: tasa estándar del 20% sobre ingresos brutos (Tax Code "X")
  // Según documentación oficial: "CODE X STANDARD RATE 20%"
  let baseRate = 0.20

  // En GIBS existen pequeños ajustes por circunstancias personales
  // (aunque son mínimos comparados con ABS)

  // Reducción marginal para casados/pareja de hecho
  if (maritalStatus === 'married' || maritalStatus === 'civil_partnership') {
    baseRate -= 0.003 // Reducción aproximada del 0.3%
  }

  // Reducción marginal por hijos dependientes
  if (hasChildren && numberOfChildren > 0) {
    baseRate -= Math.min(numberOfChildren * 0.002, 0.007) // Máximo 0.7% adicional
  }

  // GIBS se calcula sobre ingresos brutos sin deducciones significativas
  const taxableIncome = annualIncome

  // Cálculo directo
  const tax = taxableIncome * baseRate

  const effectiveRate = annualIncome > 0 ? (tax / annualIncome) * 100 : 0

  return {
    taxAmount: Math.round(tax * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  }
}

/**
 * Función principal que calcula y compara ambos sistemas
 */
export function calculateGibraltarTax(data: GibraltarData): GibraltarResult {
  const absResult = calculateABS(data)
  const gibsResult = calculateGIBS(data)

  // Determinar cuál es mejor
  const bestSystem = absResult.taxAmount < gibsResult.taxAmount ? 'ABS' : 'GIBS'
  const bestTax = Math.min(absResult.taxAmount, gibsResult.taxAmount)
  const bestRate = bestSystem === 'ABS' ? absResult.effectiveRate : gibsResult.effectiveRate

  // Calcular ingreso neto
  const netIncome = data.annualIncome - bestTax

  // Generar recomendación
  const savings = Math.abs(absResult.taxAmount - gibsResult.taxAmount)
  const percentageSaved = (savings / data.annualIncome) * 100

  let recommendation = `El sistema ${bestSystem} es más beneficioso para ti. `
  recommendation += `Ahorrarás £${savings.toFixed(2)} al año (${percentageSaved.toFixed(2)}% de tus ingresos). `

  if (bestSystem === 'ABS') {
    recommendation += 'El sistema ABS te beneficia debido a las allowances y deducciones disponibles.'
  } else {
    recommendation += 'El sistema GIBS te beneficia por su simplicidad y tasa fija sobre ingresos brutos.'
  }

  return {
    system: bestSystem,
    taxableIncome: data.annualIncome,
    taxAmount: bestTax,
    effectiveRate: bestRate,
    netIncome: Math.round(netIncome * 100) / 100,
    recommendation,
    absCalculation: absResult,
    gibsCalculation: gibsResult,
  }
}
