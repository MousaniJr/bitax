import { z } from 'zod'

/**
 * Schemas de validación para declaraciones fiscales
 */

export const gibraltarDataSchema = z.object({
  annualIncome: z.number().min(0),
  totalAllowances: z.number().min(0),
  taxCode: z.number().optional(),
  // Campos extendidos (premium)
  maritalStatus: z.enum(['single', 'married', 'civil_partnership']).optional(),
  hasChildren: z.boolean().optional(),
  numberOfChildren: z.number().min(0).optional(),
  hasMortgage: z.boolean().optional(),
  mortgageInterest: z.number().min(0).optional(),
  otherDeductions: z.number().min(0).optional(),
})

export const spainDataSchema = z.object({
  incomeSpain: z.number().min(0),
  incomeGibraltar: z.number().min(0),
  socialSecurityContributions: z.number().min(0),
  gibraltarTaxPaid: z.number().min(0),
  gibraltarSocialSecurity: z.number().min(0),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
  hasChildren: z.boolean(),
  numberOfChildren: z.number().min(0),
  childrenUnder3: z.number().min(0),
  hasDisabledDependents: z.boolean(),
  hasMortgage: z.boolean(),
  mortgageAmount: z.number().min(0),
  isPrimaryResidence: z.boolean(),
  purchaseYear: z.number().min(1900),
  regionalDeductions: z.number().min(0),
  maternityPaternity: z.number().min(0),
  retentions: z.number().min(0),
  autonomousCommunity: z.string(),
})

export const createDeclarationSchema = z.object({
  year: z.number().min(2020).max(2100),
  type: z.enum(['GIBRALTAR', 'SPAIN', 'BOTH']),
  status: z.enum(['draft', 'completed', 'filed']).default('draft'),
  gibraltarData: z.any().optional(), // JSON
  gibraltarResult: z.any().optional(), // JSON
  spainData: z.any().optional(), // JSON
  spainResult: z.any().optional(), // JSON
  notes: z.string().optional(),
})

export const updateDeclarationSchema = createDeclarationSchema.partial()
