// Tipos para Gibraltar (Versión Simplificada - Free Tier)
export interface GibraltarData {
  annualIncome: number
  totalAllowances: number
  taxCode?: number // Optional: calculated from totalAllowances or vice versa
}

// Extended version for premium features (backward compatibility)
export interface GibraltarDataExtended extends GibraltarData {
  maritalStatus?: 'single' | 'married' | 'civil_partnership'
  hasChildren?: boolean
  numberOfChildren?: number
  hasMortgage?: boolean
  mortgageInterest?: number
  otherDeductions?: number
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
  }
  gibsCalculation?: {
    taxAmount: number
    effectiveRate: number
  }
}

// Tipos para España
export interface SpainData {
  incomeSpain: number
  incomeGibraltar: number
  socialSecurityContributions: number
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
  gibraltarData?: GibraltarData
  spainData?: SpainData
  gibraltarResult?: GibraltarResult
  spainResult?: SpainResult
}
