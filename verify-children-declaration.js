/**
 * VERIFICACIÓN DE HIJOS EN DECLARACIÓN IRPF 2024
 * Comprobación de que los 2 hijos están correctamente declarados
 */

console.log('='.repeat(80))
console.log('VERIFICACIÓN DE HIJOS EN DECLARACIÓN IRPF 2024')
console.log('='.repeat(80))
console.log('')

// ===============================================================================
// DATOS DE LOS HIJOS SEGÚN PDF (Página 2)
// ===============================================================================
console.log('📋 HIJOS DECLARADOS EN EL MODELO 100:')
console.log('-'.repeat(80))
console.log('')

const hijo1 = {
  nombre: 'CARDOSO MENDES AINHOA',
  nif: '77049264T',
  fechaNacimiento: '06/12/2013',
  edadEn2024: 10, // Cumplió 11 en diciembre 2024
  edadActual2025: 11 // Cumplirá 12 en diciembre 2025
}

const hijo2 = {
  nombre: 'CARDOSO MENDES HECTOR',
  nif: '78231749D',
  fechaNacimiento: '17/08/2017',
  edadEn2024: 7, // Cumplió 7 en agosto 2024
  edadActual2025: 8 // Cumplió 8 en agosto 2025
}

console.log('   HIJO 1:')
console.log(`   Nombre: ${hijo1.nombre}`)
console.log(`   NIF: ${hijo1.nif}`)
console.log(`   Fecha nacimiento: ${hijo1.fechaNacimiento}`)
console.log(`   Edad durante ejercicio 2024: ${hijo1.edadEn2024}-11 años`)
console.log(`   Edad actual (2025): ${hijo1.edadActual2025}-12 años`)
console.log('')

console.log('   HIJO 2:')
console.log(`   Nombre: ${hijo2.nombre}`)
console.log(`   NIF: ${hijo2.nif}`)
console.log(`   Fecha nacimiento: ${hijo2.fechaNacimiento}`)
console.log(`   Edad durante ejercicio 2024: ${hijo2.edadEn2024} años`)
console.log(`   Edad actual (2025): ${hijo2.edadActual2025} años`)
console.log('')

// ===============================================================================
// VERIFICACIÓN DE REQUISITOS
// ===============================================================================
console.log('✅ VERIFICACIÓN DE REQUISITOS PARA MÍNIMO POR DESCENDIENTES:')
console.log('-'.repeat(80))
console.log('')

const requisitos = {
  menoresDe25: hijo1.edadEn2024 < 25 && hijo2.edadEn2024 < 25,
  conviven: true, // Según declaración
  dependencia: true, // Se presume para menores de edad
}

console.log(`   ¿Menores de 25 años? ${requisitos.menoresDe25 ? '✅ SÍ' : '❌ NO'}`)
console.log(`      - ${hijo1.nombre}: ${hijo1.edadEn2024} años ✅`)
console.log(`      - ${hijo2.nombre}: ${hijo2.edadEn2024} años ✅`)
console.log('')

console.log(`   ¿Conviven con el contribuyente? ${requisitos.conviven ? '✅ SÍ' : '❌ NO'}`)
console.log(`   ¿Dependen económicamente? ${requisitos.dependencia ? '✅ SÍ' : '❌ NO'}`)
console.log('')

// ===============================================================================
// MÍNIMOS APLICADOS EN LA DECLARACIÓN
// ===============================================================================
console.log('💰 MÍNIMOS POR DESCENDIENTES APLICADOS:')
console.log('-'.repeat(80))
console.log('')

const minimosOficiales = {
  estatal: {
    hijo1: 2400, // Primer hijo
    hijo2: 2700, // Segundo hijo (NO, segundo hijo es 2.700)
    // Pero el PDF dice 2.550 total... esto es raro
  },
  autonomico: {
    andalucia: {
      hijo1: 2510,
      hijo2: 2822,
      // PDF dice 2.665 total
    }
  }
}

// Del PDF oficial (página 3):
const minimosPDF = {
  estatal: 2550.00,
  autonomico: 2665.00
}

console.log('   SEGÚN PDF OFICIAL (Página 3, casillas 0513/0514):')
console.log(`   Mínimo estatal: ${minimosPDF.estatal.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log(`   Mínimo autonómico (Andalucía): ${minimosPDF.autonomico.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`)
console.log('')

console.log('   VALORES OFICIALES POR HIJO (2024):')
console.log('   Estatal:')
console.log(`   - 1º hijo: 2.400,00€`)
console.log(`   - 2º hijo: 2.700,00€`)
console.log(`   - TOTAL: 5.100,00€`)
console.log('')
console.log('   Autonómico (Andalucía):')
console.log(`   - 1º hijo: 2.510,00€`)
console.log(`   - 2º hijo: 2.822,00€`)
console.log(`   - TOTAL: 5.332,00€`)
console.log('')

console.log('   ⚠️  DISCREPANCIA DETECTADA:')
console.log(`   El PDF muestra ${minimosPDF.estatal}€ (estatal) y ${minimosPDF.autonomico}€ (autonómico)`)
console.log(`   pero debería ser 5.100€ y 5.332€ respectivamente si son 2 hijos completos.`)
console.log('')
console.log('   🔍 POSIBLES EXPLICACIONES:')
console.log('   1. Los valores en el PDF están prorrateados por algún motivo')
console.log('   2. Uno de los hijos no cumple algún requisito (custodia compartida, etc.)')
console.log('   3. Error en la transcripción del PDF')
console.log('   4. Los hijos están declarados en otra sección no visible')
console.log('')

// ===============================================================================
// CONFIRMACIÓN
// ===============================================================================
console.log('📊 RESUMEN:')
console.log('-'.repeat(80))
console.log('')
console.log('   ✅ AMBOS HIJOS ESTÁN IDENTIFICADOS EN LA DECLARACIÓN')
console.log(`      - ${hijo1.nombre} (${hijo1.fechaNacimiento})`)
console.log(`      - ${hijo2.nombre} (${hijo2.fechaNacimiento})`)
console.log('')
console.log('   ✅ AMBOS CUMPLEN REQUISITOS PARA MÍNIMO POR DESCENDIENTES')
console.log('      - Menores de 25 años')
console.log('      - Conviven con el contribuyente')
console.log('      - Dependencia económica')
console.log('')
console.log('   ⚠️  VERIFICAR: Los mínimos aplicados son menores de lo esperado')
console.log(`      - Esperado estatal: 5.100€ → Aplicado: ${minimosPDF.estatal}€`)
console.log(`      - Esperado autonómico: 5.332€ → Aplicado: ${minimosPDF.autonomico}€`)
console.log('')

console.log('='.repeat(80))
console.log('💡 RECOMENDACIÓN:')
console.log('='.repeat(80))
console.log('')
console.log('Los 2 hijos SÍ aparecen en la declaración (página 2, sección "Situación familiar")')
console.log('con sus NIFs y fechas de nacimiento completas.')
console.log('')
console.log('Sin embargo, los mínimos por descendientes aplicados parecen corresponder')
console.log('a SOLO 1 HIJO en lugar de 2, o están prorrateados al 50%.')
console.log('')
console.log('Esto podría deberse a:')
console.log('- Custodia compartida (cada progenitor aplica 50% del mínimo)')
console.log('- Tributación individual en matrimonio (cada uno declara diferentes hijos)')
console.log('- Otro motivo específico de tu situación familiar')
console.log('')
console.log('⚠️  ACCIÓN RECOMENDADA:')
console.log('Verificar con tu asesor fiscal si los mínimos por descendientes están')
console.log('correctamente aplicados según tu situación de custodia/tributación.')
console.log('')
console.log('='.repeat(80))
