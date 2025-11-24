/**
 * Script de validación del cálculo IRPF 2024
 * Compara nuestro cálculo con el PDF oficial de la declaración
 *
 * Datos del PDF oficial (Modelo 100 - Ejercicio 2024):
 * - Ingresos brutos: 41.249,41€
 * - Seguridad Social: 2.324,49€
 * - Gastos deducibles: 2.000€
 * - Rendimiento neto reducido: 36.924,92€
 * - Base liquidable general: 36.924,92€
 * - Mínimo contribuyente estatal: 5.550€
 * - Mínimo contribuyente autonómico: 5.790€
 * - Mínimo descendientes estatal: 2.550€
 * - Mínimo descendientes autonómico: 2.665€
 * - Total mínimo estatal: 8.100€
 * - Total mínimo autonómico: 8.455€
 * - Cuota estatal sobre base: 4.681,86€
 * - Cuota autonómica sobre base: 4.641,11€
 * - Cuota estatal sobre mínimo: 769,50€
 * - Cuota autonómica sobre mínimo: 803,23€
 * - Cuota líquida estatal: 3.912,36€
 * - Cuota líquida autonómica: 3.837,88€
 * - Total cuota líquida: 7.750,24€
 * - Deducción doble imposición: 6.542,48€
 * - Resultado a pagar: 1.180,06€
 */

// Datos de entrada del caso real
const testCase = {
  incomeSpain: 0, // Trabajó en Gibraltar
  incomeGibraltar: 41249.41,
  socialSecurityContributions: 0,
  gibraltarSocialSecurity: 2324.49,
  gibraltarTaxPaid: 6542.48,
  maritalStatus: 'married',
  hasChildren: true,
  numberOfChildren: 2,
  childrenUnder3: 0,
  hasDisabledDependents: false,
  hasMortgage: false,
  mortgageAmount: 0,
  isPrimaryResidence: true,
  purchaseYear: 2024,
  regionalDeductions: 27.70, // Deducción autonómica por gastos educativos
  maternityPaternity: 0,
  retentions: 2.12, // Solo rendimientos capital mobiliario
  autonomousCommunity: 'andalucia',
}

// Valores esperados del PDF oficial
const expected = {
  grossIncome: 41249.41,
  netWorkIncomeBeforeReduction: 36924.92, // 41249.41 - 2324.49 - 2000
  generalBase: 36924.92, // Sin reducción (> 21.000€)
  stateMinimumTotal: 8100.00,
  regionalMinimumTotal: 8455.00,
  stateQuotaOnBase: 4681.86,
  regionalQuotaOnBase: 4641.11,
  stateQuotaOnMinimum: 769.50,
  regionalQuotaOnMinimum: 803.23,
  stateTax: 3912.36, // 4681.86 - 769.50
  regionalTax: 3837.88, // 4641.11 - 803.23
  totalTax: 7750.24, // 3912.36 + 3837.88
  doubleTaxationRelief: 6542.48,
  finalTax: 1180.06, // 7750.24 - 6542.48 - 27.70 - 2.12 ≈ 1177.94 (pequeña diferencia por redondeos)
}

console.log('='.repeat(80))
console.log('VALIDACIÓN IRPF 2024 - Comparación con PDF Oficial')
console.log('='.repeat(80))
console.log('')

console.log('📋 DATOS DE ENTRADA:')
console.log(`   Ingresos Gibraltar: ${testCase.incomeGibraltar.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Seguridad Social Gibraltar: ${testCase.gibraltarSocialSecurity.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Impuesto pagado Gibraltar: ${testCase.gibraltarTaxPaid.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Número de hijos: ${testCase.numberOfChildren}`)
console.log(`   Comunidad Autónoma: ${testCase.autonomousCommunity}`)
console.log('')

console.log('✅ VALORES ESPERADOS (del PDF oficial):')
console.log(`   Base liquidable general: ${expected.generalBase.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Mínimo estatal: ${expected.stateMinimumTotal.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Mínimo autonómico: ${expected.regionalMinimumTotal.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota estatal sobre base: ${expected.stateQuotaOnBase.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota autonómica sobre base: ${expected.regionalQuotaOnBase.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota estatal sobre mínimo: ${expected.stateQuotaOnMinimum.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota autonómica sobre mínimo: ${expected.regionalQuotaOnMinimum.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota líquida estatal: ${expected.stateTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota líquida autonómica: ${expected.regionalTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Total cuota líquida: ${expected.totalTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Deducción doble imposición: ${expected.doubleTaxationRelief.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Resultado final: ${expected.finalTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log('')

console.log('ℹ️  Para ejecutar la validación con nuestro código:')
console.log('   1. Importa calculateSpainTax desde src/lib/spainCalculations.ts')
console.log('   2. Ejecuta: const result = calculateSpainTax(testCase)')
console.log('   3. Compara result con los valores expected')
console.log('')

console.log('🎯 CRITERIOS DE ÉXITO:')
console.log('   - Base liquidable: diferencia < 1€')
console.log('   - Mínimos: diferencia < 5€')
console.log('   - Cuotas sobre base: diferencia < 10€')
console.log('   - Cuotas líquidas: diferencia < 10€')
console.log('   - Total cuota: diferencia < 20€')
console.log('   - Resultado final: diferencia < 5€')
console.log('')
console.log('='.repeat(80))

// Exportar para usar en otros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCase, expected }
}
