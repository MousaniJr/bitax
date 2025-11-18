import { GibraltarData, GibraltarResult } from '@/types'

/**
 * Minimum Allowance garantizado por Gibraltar (2025/26)
 * Gibraltar aplica automáticamente un top-up si tus allowances son menores a £4,343
 * Fuente: Gibraltar Income Tax Office - Applied automatically to any individual
 */
export const PERSONAL_ALLOWANCE = 4343

/**
 * Calcula el impuesto bajo el sistema ABS (Allowance Based System)
 * Sistema tradicional basado en allowances y tasas progresivas
 *
 * Versión simplificada: el usuario proporciona directamente el Total Allowances
 *
 * Referencias:
 * - Gibraltar Income Tax Office 2025/26
 * - Fuente: https://www.gibraltar.gov.gi/income-tax-office
 */
export function calculateABS(data: GibraltarData): { taxAmount: number; effectiveRate: number } {
  const { annualIncome, totalAllowances } = data

  // El totalAllowances ya incluye todo (personal + spouse + children + mortgage + otros)
  // El usuario lo introduce manualmente o se calcula desde el Tax Code

  // Base imponible (Gross Income minus Total Allowances)
  const taxableIncome = Math.max(0, annualIncome - totalAllowances)

  // Tasas progresivas ABS OFICIALES (2025/26):
  // - Primeros £4,000 al 14%
  // - Siguientes £12,000 al 17%
  // - Resto al 39%
  let tax = 0
  const brackets = [
    { limit: 4000, rate: 0.14 },     // Primeros £4,000 al 14%
    { limit: 16000, rate: 0.17 },    // £4,001 - £16,000 al 17%
    { limit: Infinity, rate: 0.39 }, // Más de £16,000 al 39%
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
 * Sistema con tasas progresivas sobre ingresos brutos
 *
 * Referencias:
 * - Gibraltar Income Tax Office 2025/26
 * - Fuente: https://www.gibraltar.gov.gi/income-tax-office
 * - GIBS tiene dos estructuras según nivel de ingresos
 */
export function calculateGIBS(data: GibraltarData): { taxAmount: number; effectiveRate: number } {
  const { annualIncome } = data

  let tax = 0

  // GIBS tiene dos estructuras de tasas según el nivel de ingresos

  if (annualIncome <= 25000) {
    // Para ingresos hasta £25,000:
    // - Primeros £10,000 @ 6%
    // - Siguientes £7,000 @ 20%
    // - Resto @ 28%

    const brackets = [
      { limit: 10000, rate: 0.06 },    // Primeros £10,000 al 6%
      { limit: 17000, rate: 0.20 },    // £10,001 - £17,000 al 20%
      { limit: Infinity, rate: 0.28 }, // Más de £17,000 al 28%
    ]

    let remaining = annualIncome
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

  } else {
    // Para ingresos superiores a £25,000:
    // - Primeros £17,000 @ 16%
    // - Siguientes £8,000 @ 19%
    // - Siguientes £15,000 @ 25%
    // - Siguientes £65,000 @ 28%
    // - Resto @ 25%

    const brackets = [
      { limit: 17000, rate: 0.16 },     // Primeros £17,000 al 16%
      { limit: 25000, rate: 0.19 },     // £17,001 - £25,000 al 19%
      { limit: 40000, rate: 0.25 },     // £25,001 - £40,000 al 25%
      { limit: 105000, rate: 0.28 },    // £40,001 - £105,000 al 28%
      { limit: Infinity, rate: 0.25 },  // Más de £105,000 al 25%
    ]

    let remaining = annualIncome
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
  }

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
