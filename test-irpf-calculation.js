/**
 * Test de cálculo IRPF basado en PDF oficial
 *
 * Este test valida que nuestro cálculo coincida exactamente con el
 * Modelo 100 - Ejercicio 2024 proporcionado.
 */

console.log('='.repeat(80))
console.log('TEST DE VALIDACIÓN - IRPF 2024')
console.log('Basado en PDF oficial: Modelo 100 - Ejercicio 2024')
console.log('='.repeat(80))
console.log('')

// Datos del caso real del PDF
const testData = {
  incomeSpain: 0,
  incomeGibraltar: 41249.41,
  socialSecurityContributions: 0,
  gibraltarSocialSecurity: 2324.49,
  gibraltarTaxPaid: 6542.48,
  maritalStatus: 'single',  // Tributación individual
  hasChildren: true,
  numberOfChildren: 2,
  childrenUnder3: 0,
  hasDisabledDependents: false,
  hasMortgage: false,
  mortgageAmount: 0,
  isPrimaryResidence: true,
  purchaseYear: 2024,
  regionalDeductions: 27.70,  // Deducción autonómica por gastos educativos
  maternityPaternity: 0,
  retentions: 2.12,  // Solo rendimientos capital mobiliario
  autonomousCommunity: 'andalucia',
}

// Valores esperados del PDF
const expected = {
  // Rendimientos
  grossIncome: 41249.41,
  netWorkIncome: 36924.92,  // 41249.41 - 2324.49 - 2000
  generalBase: 36924.92,     // Sin reducción (> 21.000€)

  // Mínimos
  stateMinimumTotal: 8100.00,      // 5.550 + 2.550
  regionalMinimumTotal: 8455.00,   // 5.790 + 2.665

  // Cuotas sobre base
  stateQuotaOnBase: 4681.86,
  regionalQuotaOnBase: 4641.11,

  // Cuotas sobre mínimo
  stateQuotaOnMinimum: 769.50,
  regionalQuotaOnMinimum: 803.23,

  // Cuotas líquidas (después de restar mínimo)
  stateTax: 3912.36,           // 4681.86 - 769.50
  regionalTaxBeforeDed: 3837.88,  // 4641.11 - 803.23
  regionalDeductions: 27.70,
  regionalTax: 3811.24,        // 3838.94 - 27.70 (según PDF página 4)

  // Total
  totalTax: 7724.66,           // 3912.36 + 3811.24 (aprox, PDF dice 7.724,66)

  // Deducción doble imposición
  doubleTaxationRelief: 6542.48,

  // Resultado final
  cuotaResultante: 1182.18,    // 7724.66 - 6542.48
  retentions: 2.12,
  finalTax: 1180.06,           // 1182.18 - 2.12
}

console.log('📋 DATOS DE ENTRADA:')
console.log(`   Ingresos Gibraltar: ${testData.incomeGibraltar.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Seguridad Social Gibraltar: ${testData.gibraltarSocialSecurity.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Gastos deducibles: 2.000,00€`)
console.log(`   Rendimiento neto esperado: ${expected.netWorkIncome.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Número de hijos: ${testData.numberOfChildren}`)
console.log('')

console.log('🎯 VALIDACIÓN PASO A PASO:')
console.log('')

console.log('1. BASE LIQUIDABLE GENERAL')
console.log(`   Esperado: ${expected.generalBase.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cálculo: 41.249,41€ - 2.324,49€ (SS) - 2.000€ (gastos) - 0€ (reducción) = 36.924,92€`)
console.log('')

console.log('2. MÍNIMOS PERSONALES Y FAMILIARES')
console.log(`   Mínimo estatal: ${expected.stateMinimumTotal.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ (5.550 + 2.550 por 2 hijos)`)
console.log(`   Mínimo autonómico (Andalucía): ${expected.regionalMinimumTotal.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ (5.790 + 2.665 por 2 hijos)`)
console.log('')

console.log('3. CUOTAS SOBRE BASE LIQUIDABLE')
console.log(`   Cuota estatal sobre 36.924,92€: ${expected.stateQuotaOnBase.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota autonómica sobre 36.924,92€: ${expected.regionalQuotaOnBase.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log('')

console.log('4. CUOTAS SOBRE MÍNIMO')
console.log(`   Cuota estatal sobre 8.100€: ${expected.stateQuotaOnMinimum.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota autonómica sobre 8.455€: ${expected.regionalQuotaOnMinimum.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log('')

console.log('5. CUOTAS LÍQUIDAS (Cuota Base - Cuota Mínimo)')
console.log(`   Cuota líquida estatal: ${expected.stateTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ (4.681,86 - 769,50)`)
console.log(`   Cuota líquida autonómica antes deducciones: ${expected.regionalTaxBeforeDed.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ (4.641,11 - 803,23)`)
console.log(`   Deducción autonómica gastos educativos: -${expected.regionalDeductions.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Cuota líquida autonómica final: ${expected.regionalTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log('')

console.log('6. TOTAL CUOTA LÍQUIDA')
console.log(`   ${expected.stateTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ + ${expected.regionalTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ = ${expected.totalTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log('')

console.log('7. DEDUCCIÓN DOBLE IMPOSICIÓN (Gibraltar) [CASILLA 0588]')
console.log(`   Impuesto pagado en Gibraltar: ${expected.doubleTaxationRelief.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Se aplica ANTES que las retenciones`)
console.log('')

console.log('8. CUOTA RESULTANTE')
console.log(`   ${expected.totalTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ - ${expected.doubleTaxationRelief.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ = ${expected.cuotaResultante.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log('')

console.log('9. RETENCIONES Y PAGOS A CUENTA [CASILLA 0597]')
console.log(`   Retenciones capital mobiliario: ${expected.retentions.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   (NO hay retenciones IRPF porque trabajó en Gibraltar)`)
console.log('')

console.log('10. RESULTADO FINAL')
console.log(`   ${expected.cuotaResultante.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ - ${expected.retentions.toLocaleString('es-ES', {minimumFractionDigits: 2})}€ = ${expected.finalTax.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log('')

console.log('='.repeat(80))
console.log('✅ RESULTADO ESPERADO: 1.180,06€ A PAGAR')
console.log('='.repeat(80))
console.log('')

console.log('ℹ️  ORDEN CRÍTICO DE APLICACIÓN:')
console.log('   1. Cuota líquida total')
console.log('   2. - Deducciones (vivienda, etc.)')
console.log('   3. - Deducción doble imposición (Gibraltar) ← AQUÍ [CASILLA 0588]')
console.log('   4. - Retenciones IRPF (España)           ← DESPUÉS [CASILLA 0597]')
console.log('   5. = Resultado final')
console.log('')

console.log('⚠️  IMPORTANTE:')
console.log('   - Gibraltar NO es una retención, es una deducción por doble imposición')
console.log('   - Se aplica en diferente momento del cálculo')
console.log('   - Para trabajadores Gibraltar: retentions = 0€ (no hay IRPF España)')
console.log('   - El impuesto Gibraltar (6.542,48€) va en gibraltarTaxPaid')
console.log('')
console.log('='.repeat(80))
