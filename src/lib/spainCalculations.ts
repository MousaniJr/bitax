import { SpainData, SpainResult } from '@/types'

/**
 * Calcula el IRPF en España considerando ingresos en Gibraltar
 * Aplica el convenio de doble imposición entre España y Gibraltar
 */
export function calculateSpainTax(data: SpainData): SpainResult {
  const {
    incomeSpain,
    incomeGibraltar,
    socialSecurityContributions,
    gibraltarTaxPaid,
    gibraltarSocialSecurity,
    maritalStatus,
    hasChildren,
    numberOfChildren,
    childrenUnder3,
    hasMortgage,
    mortgageAmount,
    isPrimaryResidence,
    purchaseYear,
    regionalDeductions,
    retentions,
    autonomousCommunity,
  } = data

  // 1. INGRESOS BRUTOS TOTALES
  const grossIncome = incomeSpain + incomeGibraltar

  // 2. RENDIMIENTOS NETOS DEL TRABAJO
  // Gastos deducibles (mínimo 2.000€)
  const workExpenses = Math.max(2000, grossIncome * 0.02)

  // Cotizaciones a la Seguridad Social son deducibles (España + Gibraltar)
  const deductibleSocialSecurity = socialSecurityContributions + (gibraltarSocialSecurity || 0)

  // Rendimiento neto
  const netWorkIncome = grossIncome - workExpenses - deductibleSocialSecurity

  // 3. BASE IMPONIBLE GENERAL
  // Reducción por obtención de rendimientos del trabajo
  let workReduction = 0
  if (netWorkIncome <= 14000) {
    workReduction = 6498
  } else if (netWorkIncome <= 19000) {
    workReduction = 6498 - (1.0494 * (netWorkIncome - 14000))
  } else if (netWorkIncome <= 21000) {
    workReduction = 1245
  }

  const generalBase = Math.max(0, netWorkIncome - workReduction)
  const savingsBase = 0 // Asumimos sin rentas del ahorro

  // 4. MÍNIMO PERSONAL Y FAMILIAR
  let personalMinimum = 5550 // Mínimo del contribuyente

  // Mínimo por descendientes
  let childrenMinimum = 0
  if (hasChildren && numberOfChildren > 0) {
    const childMinimums = [2400, 2700, 4000, 4500] // Por 1º, 2º, 3º, 4º+ hijo
    for (let i = 0; i < numberOfChildren; i++) {
      childrenMinimum += childMinimums[Math.min(i, 3)]
    }
  }

  // Mínimo adicional por hijos menores de 3 años
  const under3Minimum = childrenUnder3 * 2800

  const totalMinimum = personalMinimum + childrenMinimum + under3Minimum

  // 5. CUOTA ÍNTEGRA ESTATAL (Base general)
  const stateTax = calculateProgressiveTax(generalBase, 'state')

  // 6. CUOTA ÍNTEGRA AUTONÓMICA
  const regionalTax = calculateProgressiveTax(generalBase, autonomousCommunity || 'andalucia')

  // 7. TOTAL ANTES DE DEDUCCIONES
  const totalTax = stateTax + regionalTax

  // 8. DEDUCCIONES
  let totalDeductions = 0

  // Deducción por maternidad/paternidad
  totalDeductions += data.maternityPaternity || 0

  // Deducción por vivienda habitual (solo si compra antes de 2013)
  if (hasMortgage && isPrimaryResidence && purchaseYear < 2013) {
    totalDeductions += Math.min(mortgageAmount * 0.15, 9040)
  }

  // Deducciones autonómicas adicionales
  totalDeductions += regionalDeductions || 0

  // 9. CRÉDITO POR DOBLE IMPOSICIÓN (Gibraltar)
  // Para trabajadores transfronterizos, España permite deducir el impuesto pagado en Gibraltar
  // Según el tratado España-UK sobre Gibraltar (2021)
  // Se calcula como el menor entre:
  // - Impuesto efectivamente pagado en Gibraltar
  // - Impuesto que correspondería pagar en España por esa renta
  const gibraltarProportion = grossIncome > 0 ? incomeGibraltar / grossIncome : 0
  const gibraltarTaxCredit = totalTax * gibraltarProportion

  // Usamos el impuesto real pagado en Gibraltar (introducido por el usuario)
  const actualGibraltarTax = gibraltarTaxPaid || 0

  // El crédito es el menor de los dos
  const doubleTaxationRelief = Math.min(gibraltarTaxCredit, actualGibraltarTax)

  // 10. CUOTA DIFERENCIAL (Resultado final)
  const finalTax = Math.max(0, totalTax - totalDeductions - doubleTaxationRelief - retentions)

  // 11. TIPO EFECTIVO
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0

  // 12. INGRESO NETO ESTIMADO
  const netIncome = grossIncome - totalTax + totalDeductions + doubleTaxationRelief

  return {
    grossIncome: Math.round(grossIncome * 100) / 100,
    taxableBase: Math.round(generalBase * 100) / 100,
    generalBase: Math.round(generalBase * 100) / 100,
    savingsBase: Math.round(savingsBase * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    regionalTax: Math.round(regionalTax * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    deductions: Math.round(totalDeductions * 100) / 100,
    finalTax: Math.round(finalTax * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    doubleTaxationRelief: Math.round(doubleTaxationRelief * 100) / 100,
    gibraltarTaxCredit: Math.round(gibraltarTaxCredit * 100) / 100,
  }
}

/**
 * Calcula el impuesto según las escalas progresivas
 * Fuente: Agencia Tributaria Española - IRPF 2024-2025
 */
function calculateProgressiveTax(base: number, jurisdiction: string): number {
  let tax = 0

  // Escalas estatales (2024-2025) - Oficiales AEAT
  // Suma total con autonómicas: 19%, 24%, 30%, 37%, 45%, 47%
  const stateBrackets = [
    { limit: 12450, rate: 0.095 },   // 9.5%
    { limit: 20200, rate: 0.12 },    // 12%
    { limit: 35200, rate: 0.15 },    // 15%
    { limit: 60000, rate: 0.185 },   // 18.5%
    { limit: 300000, rate: 0.225 },  // 22.5%
    { limit: Infinity, rate: 0.245 }, // 24.5%
  ]

  // Escalas autonómicas por CCAA (2024-2025)
  const regionalBracketsMap: Record<string, Array<{ limit: number; rate: number }>> = {
    // Andalucía
    andalucia: [
      { limit: 12450, rate: 0.095 },   // 9.5% = Total 19%
      { limit: 20200, rate: 0.12 },    // 12% = Total 24%
      { limit: 35200, rate: 0.15 },    // 15% = Total 30%
      { limit: 60000, rate: 0.185 },   // 18.5% = Total 37%
      { limit: 300000, rate: 0.225 },  // 22.5% = Total 45%
      { limit: Infinity, rate: 0.225 }, // 22.5% = Total 47%
    ],
    // Madrid (tiene los tipos más bajos)
    madrid: [
      { limit: 12450, rate: 0.09 },
      { limit: 20200, rate: 0.112 },
      { limit: 35200, rate: 0.141 },
      { limit: 60000, rate: 0.175 },
      { limit: 300000, rate: 0.208 },
      { limit: Infinity, rate: 0.225 }, // Total máximo: 45%
    ],
    // Cataluña (tiene los tipos más altos)
    cataluna: [
      { limit: 12450, rate: 0.10 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.155 },
      { limit: 60000, rate: 0.193 },
      { limit: 300000, rate: 0.235 },
      { limit: Infinity, rate: 0.255 }, // Total máximo: 50%
    ],
    // Aragón
    aragon: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.255 }, // Total máximo: 50%
    ],
    // Resto de CCAA (usando Andalucía como base - 47% máximo)
    asturias: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    baleares: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    canarias: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    cantabria: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    'castilla-leon': [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.21 },
      { limit: Infinity, rate: 0.215 }, // Total máximo: 46%
    ],
    'castilla-mancha': [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    extremadura: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    galicia: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    murcia: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    rioja: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    valencia: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.225 },
    ],
    // País Vasco y Navarra tienen sistemas forales propios (mayor complejidad)
    'pais-vasco': [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.27 }, // Total máximo: ~51.5%
    ],
    navarra: [
      { limit: 12450, rate: 0.10 },
      { limit: 20200, rate: 0.13 },
      { limit: 35200, rate: 0.165 },
      { limit: 60000, rate: 0.20 },
      { limit: 300000, rate: 0.245 },
      { limit: Infinity, rate: 0.275 }, // Total máximo: 52%
    ],
  }

  // Default a Andalucía si la CCAA no está en el mapa
  const regionalBrackets = jurisdiction === 'state'
    ? stateBrackets
    : (regionalBracketsMap[jurisdiction] || regionalBracketsMap['andalucia'])

  const brackets = jurisdiction === 'state' ? stateBrackets : regionalBrackets

  let remaining = base
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

  return tax
}
