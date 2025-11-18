/**
 * Tax Code utilities for Gibraltar
 * Based on official Tax Codes 2024/2025 from Gibraltar Income Tax Office
 */

// Tax code table: Code -> Allowance Range
const TAX_CODE_TABLE: { code: number; min: number; max: number }[] = [
  { code: 1, min: 4000, max: 4099 },
  { code: 2, min: 4100, max: 4199 },
  { code: 3, min: 4200, max: 4299 },
  { code: 4, min: 4300, max: 4399 },
  { code: 5, min: 4400, max: 4499 },
  { code: 6, min: 4500, max: 4599 },
  { code: 7, min: 4600, max: 4699 },
  { code: 8, min: 4700, max: 4799 },
  { code: 9, min: 4800, max: 4899 },
  { code: 10, min: 4900, max: 4999 },
  { code: 11, min: 5000, max: 5099 },
  { code: 12, min: 5100, max: 5199 },
  { code: 13, min: 5200, max: 5299 },
  { code: 14, min: 5300, max: 5399 },
  { code: 15, min: 5400, max: 5499 },
  { code: 16, min: 5500, max: 5599 },
  { code: 17, min: 5600, max: 5699 },
  { code: 18, min: 5700, max: 5799 },
  { code: 19, min: 5800, max: 5899 },
  { code: 20, min: 5900, max: 5999 },
  { code: 21, min: 6000, max: 6099 },
  { code: 22, min: 6100, max: 6249 },
  { code: 23, min: 6250, max: 6399 },
  { code: 24, min: 6400, max: 6549 },
  { code: 25, min: 6550, max: 6699 },
  { code: 26, min: 6700, max: 6849 },
  { code: 27, min: 6850, max: 6999 },
  { code: 28, min: 7000, max: 7149 },
  { code: 29, min: 7150, max: 7299 },
  { code: 30, min: 7300, max: 7449 },
  { code: 31, min: 7450, max: 7599 },
  { code: 32, min: 7600, max: 7749 },
  { code: 33, min: 7750, max: 7899 },
  { code: 34, min: 7900, max: 8049 },
  { code: 35, min: 8050, max: 8199 },
  { code: 36, min: 8200, max: 8349 },
  { code: 37, min: 8350, max: 8499 },
  { code: 38, min: 8500, max: 8649 },
  { code: 39, min: 8650, max: 8799 },
  { code: 40, min: 8800, max: 8949 },
  { code: 41, min: 8950, max: 9099 },
  { code: 42, min: 9100, max: 9299 },
  { code: 43, min: 9300, max: 9499 },
  { code: 44, min: 9500, max: 9699 },
  { code: 45, min: 9700, max: 9899 },
  { code: 46, min: 9900, max: 10099 },
  { code: 47, min: 10100, max: 10299 },
  { code: 48, min: 10300, max: 10499 },
  { code: 49, min: 10500, max: 10699 },
  { code: 50, min: 10700, max: 10899 },
  { code: 51, min: 10900, max: 11099 },
  { code: 52, min: 11100, max: Infinity }, // 11100 - OVER
]

/**
 * Convert Total Allowances to Tax Code
 * @param allowance - Total allowances in £
 * @returns Tax code (1-52) or null if below minimum
 */
export function allowanceToTaxCode(allowance: number): number | null {
  // If below minimum range, return null
  if (allowance < 4000) {
    return null
  }

  // Find the appropriate tax code
  for (const entry of TAX_CODE_TABLE) {
    if (allowance >= entry.min && allowance <= entry.max) {
      return entry.code
    }
  }

  // If over maximum, return code 52
  return 52
}

/**
 * Convert Tax Code to approximate Total Allowances (midpoint of range)
 * @param code - Tax code (1-52)
 * @returns Approximate allowances in £ or null if invalid code
 */
export function taxCodeToAllowance(code: number): number | null {
  const entry = TAX_CODE_TABLE.find((e) => e.code === code)

  if (!entry) {
    return null
  }

  // For code 52 (11100 - OVER), return the minimum value
  if (code === 52) {
    return entry.min
  }

  // Return the midpoint of the range
  return Math.round((entry.min + entry.max) / 2)
}

/**
 * Get the allowance range for a given tax code
 * @param code - Tax code (1-52)
 * @returns Object with min and max allowance values, or null if invalid
 */
export function getTaxCodeRange(code: number): { min: number; max: number | null } | null {
  const entry = TAX_CODE_TABLE.find((e) => e.code === code)

  if (!entry) {
    return null
  }

  return {
    min: entry.min,
    max: entry.max === Infinity ? null : entry.max,
  }
}

/**
 * Validate if a tax code is valid
 * @param code - Tax code to validate
 * @returns true if valid (1-52), false otherwise
 */
export function isValidTaxCode(code: number): boolean {
  return code >= 1 && code <= 52
}

/**
 * Format tax code for display
 * @param code - Tax code (1-52)
 * @returns Formatted string like "Code 1" or "Code X" for standard rate
 */
export function formatTaxCode(code: number | null): string {
  if (code === null) {
    return 'N/A'
  }
  return `Code ${code}`
}
