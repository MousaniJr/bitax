import { SpainData, SpainResult } from '@/types'

/**
 * Mínimos personales y familiares por Comunidad Autónoma (2024)
 * Fuente: Agencia Tributaria + Normativas autonómicas
 */
const MINIMUM_PERSONAL_BY_CCAA: Record<string, {
  contribuyente: number
  mayores65: number
  mayores75: number
  descendientes: {
    primero: number
    segundo: number
    tercero: number
    cuartoYMas: number
    menores3: number
    discapacidad33: number
    discapacidad65: number
  }
  ascendientes: {
    mayores65: number
    mayores75Adicional: number
    discapacidad33: number
    discapacidad65: number
  }
}> = {
  // Andalucía - Valores oficiales 2024
  andalucia: {
    contribuyente: 5790,
    mayores65: 1200,
    mayores75: 1460,
    descendientes: {
      primero: 2510,
      segundo: 2822,
      tercero: 4180,
      cuartoYMas: 4700,
      menores3: 2925,
      discapacidad33: 3130,
      discapacidad65: 9400,
    },
    ascendientes: {
      mayores65: 1200,
      mayores75Adicional: 1460,
      discapacidad33: 3130,
      discapacidad65: 9400,
    },
  },
  // Madrid - Valores 2024
  madrid: {
    contribuyente: 5700,
    mayores65: 1150,
    mayores75: 1400,
    descendientes: {
      primero: 2460,
      segundo: 2760,
      tercero: 4100,
      cuartoYMas: 4600,
      menores3: 2860,
      discapacidad33: 3060,
      discapacidad65: 9180,
    },
    ascendientes: {
      mayores65: 1150,
      mayores75Adicional: 1400,
      discapacidad33: 3060,
      discapacidad65: 9180,
    },
  },
  // Cataluña - Valores 2024
  cataluna: {
    contribuyente: 5850,
    mayores65: 1225,
    mayores75: 1485,
    descendientes: {
      primero: 2550,
      segundo: 2865,
      tercero: 4240,
      cuartoYMas: 4770,
      menores3: 2970,
      discapacidad33: 3180,
      discapacidad65: 9540,
    },
    ascendientes: {
      mayores65: 1225,
      mayores75Adicional: 1485,
      discapacidad33: 3180,
      discapacidad65: 9540,
    },
  },
}

// Valores estatales estándar (aplicables a todas las CCAA para el cálculo estatal)
const MINIMUM_PERSONAL_STATE = {
  contribuyente: 5550,
  mayores65: 1150,
  mayores75: 1400,
  descendientes: {
    primero: 2400,
    segundo: 2700,
    tercero: 4000,
    cuartoYMas: 4500,
    menores3: 2800,
    discapacidad33: 3000,
    discapacidad65: 9000,
  },
  ascendientes: {
    mayores65: 1150,
    mayores75Adicional: 1400,
    discapacidad33: 3000,
    discapacidad65: 9000,
  },
}

/**
 * Calcula el IRPF en España considerando ingresos en Gibraltar
 * Aplica el convenio de doble imposición entre España y Gibraltar
 *
 * ALGORITMO OFICIAL AEAT 2024:
 * 1. Calcular Base Liquidable General
 * 2. Calcular Mínimo Personal y Familiar
 * 3. Cuota Íntegra = Aplicar escala a Base Liquidable
 * 4. Cuota sobre Mínimo = Aplicar escala a Mínimo
 * 5. Cuota Líquida = Cuota Íntegra - Cuota sobre Mínimo
 * 6. Aplicar deducciones
 * 7. Aplicar crédito por doble imposición (Gibraltar)
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
  // Gastos deducibles: mínimo 2.000€ según normativa
  const workExpenses = 2000

  // Cotizaciones a la Seguridad Social son deducibles (España + Gibraltar)
  const deductibleSocialSecurity = socialSecurityContributions + (gibraltarSocialSecurity || 0)

  // Rendimiento neto previo
  const netWorkIncomeBeforeReduction = grossIncome - deductibleSocialSecurity - workExpenses

  // 3. REDUCCIÓN POR OBTENCIÓN DE RENDIMIENTOS DEL TRABAJO (2024)
  // Fuente: Artículo 20 Ley IRPF
  let workReduction = 0
  if (netWorkIncomeBeforeReduction <= 14000) {
    workReduction = 6498
  } else if (netWorkIncomeBeforeReduction <= 19000) {
    // Reducción decreciente
    workReduction = 6498 - (1.299 * (netWorkIncomeBeforeReduction - 14000))
  } else if (netWorkIncomeBeforeReduction <= 21000) {
    // Cantidad fija
    workReduction = 1245
  }
  // Si > 21.000€, reducción = 0

  // Rendimiento neto del trabajo (Base imponible general)
  const generalBase = Math.max(0, netWorkIncomeBeforeReduction - workReduction)
  const savingsBase = 0 // Asumimos sin rentas del ahorro para simplificar

  // 4. MÍNIMO PERSONAL Y FAMILIAR
  const ccaa = autonomousCommunity || 'andalucia'
  const regionalMinimums = MINIMUM_PERSONAL_BY_CCAA[ccaa] || MINIMUM_PERSONAL_BY_CCAA['andalucia']

  // Mínimo del contribuyente ESTATAL
  let statePersonalMinimum = MINIMUM_PERSONAL_STATE.contribuyente
  // TODO: Añadir edad del contribuyente para mayores de 65/75

  // Mínimo del contribuyente AUTONÓMICO
  let regionalPersonalMinimum = regionalMinimums.contribuyente

  // Mínimo por descendientes ESTATAL
  let stateChildrenMinimum = 0
  if (hasChildren && numberOfChildren > 0) {
    const stateChildValues = [
      MINIMUM_PERSONAL_STATE.descendientes.primero,
      MINIMUM_PERSONAL_STATE.descendientes.segundo,
      MINIMUM_PERSONAL_STATE.descendientes.tercero,
      MINIMUM_PERSONAL_STATE.descendientes.cuartoYMas,
    ]
    for (let i = 0; i < numberOfChildren; i++) {
      stateChildrenMinimum += stateChildValues[Math.min(i, 3)]
    }
  }
  stateChildrenMinimum += (childrenUnder3 || 0) * MINIMUM_PERSONAL_STATE.descendientes.menores3

  // Mínimo por descendientes AUTONÓMICO
  let regionalChildrenMinimum = 0
  if (hasChildren && numberOfChildren > 0) {
    const regionalChildValues = [
      regionalMinimums.descendientes.primero,
      regionalMinimums.descendientes.segundo,
      regionalMinimums.descendientes.tercero,
      regionalMinimums.descendientes.cuartoYMas,
    ]
    for (let i = 0; i < numberOfChildren; i++) {
      regionalChildrenMinimum += regionalChildValues[Math.min(i, 3)]
    }
  }
  regionalChildrenMinimum += (childrenUnder3 || 0) * regionalMinimums.descendientes.menores3

  // Total mínimos
  const stateMinimumTotal = statePersonalMinimum + stateChildrenMinimum
  const regionalMinimumTotal = regionalPersonalMinimum + regionalChildrenMinimum

  // 5. CUOTA ÍNTEGRA (sobre base liquidable general)
  const stateQuotaOnBase = calculateProgressiveTax(generalBase, 'state')
  const regionalQuotaOnBase = calculateProgressiveTax(generalBase, ccaa)

  // 6. CUOTA SOBRE MÍNIMO PERSONAL Y FAMILIAR
  const stateQuotaOnMinimum = calculateProgressiveTax(stateMinimumTotal, 'state')
  const regionalQuotaOnMinimum = calculateProgressiveTax(regionalMinimumTotal, ccaa)

  // 7. CUOTA LÍQUIDA = Cuota(Base) - Cuota(Mínimo)
  // Esta es la clave del cálculo oficial!
  const stateTax = Math.max(0, stateQuotaOnBase - stateQuotaOnMinimum)
  const regionalTax = Math.max(0, regionalQuotaOnBase - regionalQuotaOnMinimum)

  // 8. TOTAL ANTES DE DEDUCCIONES
  const totalTax = stateTax + regionalTax

  // 9. TIPOS MEDIOS (para informar al usuario)
  const stateEffectiveRate = generalBase > 0 ? (stateTax / generalBase) * 100 : 0
  const regionalEffectiveRate = generalBase > 0 ? (regionalTax / generalBase) * 100 : 0

  // 10. DEDUCCIONES
  let totalDeductions = 0

  // Deducción por maternidad/paternidad
  totalDeductions += data.maternityPaternity || 0

  // Deducción por vivienda habitual (solo si compra antes de 2013)
  if (hasMortgage && isPrimaryResidence && purchaseYear < 2013) {
    totalDeductions += Math.min(mortgageAmount * 0.15, 9040)
  }

  // Deducciones autonómicas adicionales
  totalDeductions += regionalDeductions || 0

  // 11. CRÉDITO POR DOBLE IMPOSICIÓN (Gibraltar)
  // Artículo 80 Ley IRPF - Convenio España-Gibraltar
  // CASILLA MODELO 100: 0588
  //
  // ⚠️ IMPORTANTE: Este NO es el mismo concepto que "retenciones"
  // - Este es el impuesto PAGADO EN GIBRALTAR
  // - Se aplica como deducción por doble imposición ANTES que las retenciones
  // - Solo aplica si trabajaste en Gibraltar (incomeGibraltar > 0)
  //
  // El crédito es el menor entre:
  // a) Impuesto efectivamente pagado en Gibraltar (gibraltarTaxPaid)
  // b) Impuesto que correspondería en España por esas rentas (proporción)
  const gibraltarProportion = grossIncome > 0 ? incomeGibraltar / grossIncome : 0
  const theoreticalSpainTaxOnGibraltarIncome = totalTax * gibraltarProportion
  const actualGibraltarTax = gibraltarTaxPaid || 0

  // El crédito es el menor de los dos
  const doubleTaxationRelief = Math.min(theoreticalSpainTaxOnGibraltarIncome, actualGibraltarTax)

  // 12. CUOTA DIFERENCIAL (Resultado final)
  // ORDEN OFICIAL según Modelo 100 - Ejercicio 2024:
  //
  // 1. Cuota líquida (totalTax)
  // 2. - Deducciones (totalDeductions) [vivienda, maternidad, etc.]
  // 3. = Cuota resultante de la autoliquidación
  // 4. - Deducción doble imposición (doubleTaxationRelief) [CASILLA 0588] ← Gibraltar AQUÍ
  // 5. = Cuota después doble imposición
  // 6. - Retenciones y pagos a cuenta (retentions) [CASILLA 0597] ← Retenciones IRPF España AQUÍ
  // 7. = Resultado final (a pagar o a devolver) [CASILLA 0610]
  //
  // ⚠️ CRÍTICO: El orden NO es intercambiable
  // - Gibraltar se aplica ANTES que las retenciones
  // - "retentions" = SOLO retenciones IRPF practicadas en ESPAÑA
  // - "gibraltarTaxPaid" ya se usó arriba para calcular doubleTaxationRelief
  //
  // CASOS DE USO:
  // - Trabajador solo España: retentions > 0, gibraltarTaxPaid = 0
  // - Trabajador solo Gibraltar: retentions = 0, gibraltarTaxPaid > 0
  // - Trabajador ambos países: retentions > 0, gibraltarTaxPaid > 0
  const finalTax = Math.max(0, totalTax - totalDeductions - doubleTaxationRelief - retentions)

  // 13. TIPO EFECTIVO GLOBAL
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0

  // 14. INGRESO NETO ESTIMADO
  const netIncome = grossIncome - finalTax

  return {
    grossIncome: Math.round(grossIncome * 100) / 100,
    taxableBase: Math.round(netWorkIncomeBeforeReduction * 100) / 100,
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
    gibraltarTaxCredit: Math.round(theoreticalSpainTaxOnGibraltarIncome * 100) / 100,
    // Nuevos campos para debugging y transparencia
    stateQuotaOnBase: Math.round(stateQuotaOnBase * 100) / 100,
    regionalQuotaOnBase: Math.round(regionalQuotaOnBase * 100) / 100,
    stateQuotaOnMinimum: Math.round(stateQuotaOnMinimum * 100) / 100,
    regionalQuotaOnMinimum: Math.round(regionalQuotaOnMinimum * 100) / 100,
    stateMinimumTotal: Math.round(stateMinimumTotal * 100) / 100,
    regionalMinimumTotal: Math.round(regionalMinimumTotal * 100) / 100,
    stateEffectiveRate: Math.round(stateEffectiveRate * 100) / 100,
    regionalEffectiveRate: Math.round(regionalEffectiveRate * 100) / 100,
  }
}

/**
 * Calcula el impuesto según las escalas progresivas oficiales 2024
 * Fuente: Ley 35/2006 (IRPF) + Normativas autonómicas
 */
function calculateProgressiveTax(base: number, jurisdiction: string): number {
  let tax = 0

  // Escalas estatales (2024) - BOE
  // Estas son SOLO la parte estatal, no el total
  const stateBrackets = [
    { limit: 12450, rate: 0.095 },   // 9.5%
    { limit: 20200, rate: 0.12 },    // 12%
    { limit: 35200, rate: 0.15 },    // 15%
    { limit: 60000, rate: 0.185 },   // 18.5%
    { limit: 300000, rate: 0.225 },  // 22.5%
    { limit: Infinity, rate: 0.245 }, // 24.5%
  ]

  // Escalas autonómicas por CCAA (2024)
  // Estas son SOLO la parte autonómica
  const regionalBracketsMap: Record<string, Array<{ limit: number; rate: number }>> = {
    // Andalucía - Según Decreto-Ley 2024
    andalucia: [
      { limit: 12450, rate: 0.0948 },   // 9.48%
      { limit: 20200, rate: 0.12 },     // 12%
      { limit: 35200, rate: 0.15 },     // 15%
      { limit: 60000, rate: 0.185 },    // 18.5%
      { limit: 300000, rate: 0.225 },   // 22.5%
      { limit: Infinity, rate: 0.235 }, // 23.5%
    ],
    // Madrid - Tiene deflactación, tipos algo menores
    madrid: [
      { limit: 12450, rate: 0.09 },
      { limit: 20200, rate: 0.112 },
      { limit: 35200, rate: 0.141 },
      { limit: 60000, rate: 0.175 },
      { limit: 300000, rate: 0.208 },
      { limit: Infinity, rate: 0.225 },
    ],
    // Cataluña - Tipos más altos
    cataluna: [
      { limit: 12450, rate: 0.10 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.155 },
      { limit: 60000, rate: 0.193 },
      { limit: 300000, rate: 0.235 },
      { limit: Infinity, rate: 0.255 },
    ],
    // Resto de CCAA (usando valores similares a Andalucía)
    aragon: [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.255 },
    ],
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
      { limit: Infinity, rate: 0.215 },
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
    // País Vasco y Navarra tienen sistemas forales propios
    'pais-vasco': [
      { limit: 12450, rate: 0.095 },
      { limit: 20200, rate: 0.12 },
      { limit: 35200, rate: 0.15 },
      { limit: 60000, rate: 0.185 },
      { limit: 300000, rate: 0.225 },
      { limit: Infinity, rate: 0.27 },
    ],
    navarra: [
      { limit: 12450, rate: 0.10 },
      { limit: 20200, rate: 0.13 },
      { limit: 35200, rate: 0.165 },
      { limit: 60000, rate: 0.20 },
      { limit: 300000, rate: 0.245 },
      { limit: Infinity, rate: 0.275 },
    ],
  }

  // Seleccionar la escala correcta
  const brackets = jurisdiction === 'state'
    ? stateBrackets
    : (regionalBracketsMap[jurisdiction] || regionalBracketsMap['andalucia'])

  // Cálculo progresivo por tramos
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
