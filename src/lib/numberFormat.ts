/**
 * Formatea un número para mostrar con separadores de miles
 * @param value - El número a formatear
 * @returns String formateado con separadores de miles
 */
export function formatNumber(value: number | string): string {
  if (value === '' || value === null || value === undefined) return ''

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return ''

  return num.toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

/**
 * Parsea un string con formato de número a número
 * Elimina separadores de miles y convierte a número
 * @param value - String con formato de número
 * @returns Número parseado
 */
export function parseFormattedNumber(value: string): number {
  if (!value) return 0

  // Eliminar separadores de miles (puntos en español, comas en inglés)
  const cleaned = value.replace(/[.,\s]/g, '')
  const num = parseFloat(cleaned)

  return isNaN(num) ? 0 : num
}

/**
 * Formatea un input mientras el usuario escribe
 * Mantiene el cursor en la posición correcta
 * @param value - Valor actual del input
 * @returns Valor formateado
 */
export function formatInputValue(value: string): string {
  if (!value) return ''

  // Eliminar todo excepto dígitos y punto decimal
  const cleaned = value.replace(/[^\d.]/g, '')

  // Si hay punto decimal, mantenerlo
  const parts = cleaned.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]

  // Formatear la parte entera
  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Agregar parte decimal si existe
  return decimalPart !== undefined ? `${formatted},${decimalPart}` : formatted
}
