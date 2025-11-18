// Tipos para Gibraltar (Versión Simplificada - Free Tier)
export interface GibraltarData {
  annualIncome: number
  totalAllowances: number
  taxCode?: number // Optional: calculated from totalAllowances or vice versa
}

// Gibraltar Allowances detallados (Premium)
// Valores oficiales 2024/2025 - Gibraltar Income Tax Office
export interface GibraltarAllowances {
  // Personal
  personalAllowance: boolean // £3,455

  // Familia
  spouseAllowance: boolean // £3,455
  numberOfChildren: number // £1,190 por hijo
  childrenEducatedAbroad: number // £1,375 por hijo
  dependentRelatives: number // hasta £400 por relativo
  disabledIndividual: boolean // £10,000
  singleParent: boolean // £5,800
  nurserySchool: number // hasta £5,480

  // Vivienda
  homePurchaseAllowance: boolean // £13,000 (una vez)
  homePurchaseYearsRemaining: number // Años restantes de £1,000/año
  mortgagePrincipal: number // Intereses sobre préstamo hasta £350,000

  // Seguros y pensiones
  medicalInsurance: number // hasta £5,395
  lifeAssurance: number // hasta 1/7 del assessable income
  pensionContributions: number // hasta 20% o £35,000

  // Senior Citizens (60+ mujeres, 65+ hombres)
  isSeniorCitizen: boolean
  seniorCitizenMarried: boolean // £5,600 vs £9,055 unmarried
}

// Extended version for premium features
export interface GibraltarDataPremium extends GibraltarData {
  // Datos básicos
  maritalStatus: 'single' | 'married' | 'civil_partnership'
  gender: 'male' | 'female'
  age: number

  // Allowances detallados
  allowances: GibraltarAllowances

  // Para GIBS
  gibsDeductions: {
    mortgageInterest: number // max £1,500
    homePurchase: number // max £7,500
    pensionContributions: number // max £1,500
    medicalInsurance: number // max £3,000
  }
}

// Tax bracket breakdown for detailed comparison
export interface TaxBracket {
  range: string // e.g., "First £4,000" or "£4,001 - £16,000"
  rate: number // e.g., 0.14 for 14%
  taxableAmount: number // Amount in this bracket
  taxOnBracket: number // Tax calculated on this bracket
}

export interface GibraltarResult {
  system: 'ABS' | 'GIBS'
  taxableIncome: number
  taxAmount: number
  effectiveRate: number
  netIncome: number
  recommendation: string
  absCalculation?: {
    taxAmount: number
    effectiveRate: number
    breakdown?: TaxBracket[] // Detailed bracket breakdown
    totalAllowances?: number // For display purposes
    taxCredit?: number // Tax credit applied (max of £300 or 2%)
    taxBeforeCredit?: number // Tax before applying credit
  }
  gibsCalculation?: {
    taxAmount: number
    effectiveRate: number
    breakdown?: TaxBracket[] // Detailed bracket breakdown
  }
}

// Tipos para España
export interface SpainData {
  incomeSpain: number
  incomeGibraltar: number
  socialSecurityContributions: number
  gibraltarTaxPaid: number // Tax paid in Gibraltar (can be auto-calculated or manual)
  gibraltarSocialSecurity: number // Social Security paid in Gibraltar (manual only)
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
  hasChildren: boolean
  numberOfChildren: number
  childrenUnder3: number
  hasDisabledDependents: boolean
  hasMortgage: boolean
  mortgageAmount: number
  isPrimaryResidence: boolean
  purchaseYear: number
  regionalDeductions: number
  maternityPaternity: number
  retentions: number
  autonomousCommunity: string
}

// Spain Data Premium - Deducciones detalladas
export interface SpainDataPremium extends SpainData {
  // Datos adicionales del contribuyente
  age: number
  disability: number // Porcentaje de discapacidad

  // Rendimientos del trabajo detallados
  rendimientosTrabajo: {
    sueldoSalarios: number
    valoracionEspecie: number
    dietasExentas: number
    indemnizaciones: number
  }

  // Reducciones por rendimientos del trabajo
  gastosDeducibles: {
    seguridadSocial: number
    cuotasSindicales: number
    colegiosProfesionales: number // max 500€
    gastosDefensaJuridica: number // max 300€
    movilidadGeografica: boolean // 2.000€ adicionales
  }

  // Reducciones base imponible
  reduccionesBI: {
    aportacionesPlanesPrivados: number // max 1.500€
    aportacionesPlanesEmpresa: number // max 8.500€
    pensionesCompensatorias: number
    anualidadesAlimentos: number
  }

  // Mínimos personales y familiares
  minimos: {
    contribuyente: number // 5.550€ base
    mayores65: boolean // +1.150€
    mayores75: boolean // +1.400€ adicionales
    descendientes: {
      menores25: number
      menores3: number
      discapacidad33: number
      discapacidad65: number
    }
    ascendientes: {
      mayores65: number
      mayores75: number
      discapacidad33: number
      discapacidad65: number
    }
  }

  // Deducciones estatales
  deduccionesEstatales: {
    inversionVivienda: number // Solo si compró antes 2013
    donativosONG: number // 80% primeros 150€, 35% resto
    donativosPartidos: number
    actuacionesMedioambiente: number
  }

  // Deducciones autonómicas específicas
  deduccionesAutonomicas: {
    porNacimiento: number
    porAdopcion: number
    porFamiliaNumerosa: number
    porAlquilerVivienda: number
    porGastosEducativos: number
    porCuidadoPersonas: number
    otras: number
  }
}

export interface SpainResult {
  grossIncome: number
  taxableBase: number
  generalBase: number
  savingsBase: number
  stateTax: number
  regionalTax: number
  totalTax: number
  deductions: number
  finalTax: number
  effectiveRate: number
  netIncome: number
  doubleTaxationRelief: number
  gibraltarTaxCredit: number
}

// Tipos para almacenamiento local
export interface SavedData {
  id: string
  year: number
  timestamp: number
  gibraltarData?: GibraltarData | GibraltarDataPremium
  spainData?: SpainData | SpainDataPremium
  gibraltarResult?: GibraltarResult
  spainResult?: SpainResult
}
