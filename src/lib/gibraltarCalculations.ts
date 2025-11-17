import { GibraltarData, GibraltarResult } from '@/types'

/**
 * Calcula el impuesto bajo el sistema ABS (Allowance Based System)
 * Sistema tradicional basado en allowances y tasas progresivas
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

  // Allowances base (aproximados para 2024/25)
  let totalAllowances = allowances || 0

  // Personal allowance estándar
  const personalAllowance = 12000 // Aproximado

  // Allowance adicional si está casado
  if (maritalStatus === 'married' || maritalStatus === 'civil_partnership') {
    totalAllowances += 3000
  }

  // Allowance por hijos
  if (hasChildren && numberOfChildren > 0) {
    totalAllowances += numberOfChildren * 1200
  }

  // Deducción de intereses de hipoteca (limitado)
  const mortgageDeduction = hasMortgage ? Math.min(mortgageInterest, 25000) : 0

  // Total de deducciones
  const totalDeductions = totalAllowances + personalAllowance + mortgageDeduction + otherDeductions

  // Base imponible
  const taxableIncome = Math.max(0, annualIncome - totalDeductions)

  // Tasas progresivas ABS (aproximadas para 2024/25)
  let tax = 0
  const brackets = [
    { limit: 4000, rate: 0.17 },
    { limit: 12000, rate: 0.20 },
    { limit: 16000, rate: 0.21 },
    { limit: 25000, rate: 0.23 },
    { limit: Infinity, rate: 0.28 },
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
 */
export function calculateGIBS(data: GibraltarData): { taxAmount: number; effectiveRate: number } {
  const { annualIncome, maritalStatus, hasChildren, numberOfChildren } = data

  // GIBS: tasa base del 20% sobre ingresos brutos
  // Con ajustes según circunstancias personales
  let baseRate = 0.20

  // Reducción de tasa por circunstancias familiares (aproximado)
  if (maritalStatus === 'married' || maritalStatus === 'civil_partnership') {
    baseRate -= 0.005 // 0.5% reducción
  }

  if (hasChildren && numberOfChildren > 0) {
    baseRate -= Math.min(numberOfChildren * 0.0025, 0.01) // hasta 1% adicional
  }

  // No hay deducciones significativas en GIBS
  const taxableIncome = annualIncome

  // Cálculo simple
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
