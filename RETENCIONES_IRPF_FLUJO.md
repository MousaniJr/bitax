/**
 * ANÁLISIS DEL FLUJO DE RETENCIONES EN MODELO 100 - EJERCICIO 2024
 *
 * Este documento explica cómo se manejan las retenciones según el origen del trabajo
 * basado en el PDF oficial de la declaración.
 *
 * ===============================================================================
 * CASO 1: TRABAJADOR SOLO EN ESPAÑA
 * ===============================================================================
 *
 * Ingresos: 40.000€ (España)
 * Retenciones IRPF practicadas: 5.000€
 *
 * FLUJO OFICIAL:
 * 1. Rendimientos del trabajo: 40.000€
 * 2. - Seguridad Social: 2.500€
 * 3. - Gastos deducibles: 2.000€
 * 4. = Rendimiento neto: 35.500€
 * 5. - Reducción rendimientos: 0€ (>21.000€)
 * 6. = Base liquidable general: 35.500€
 *
 * 7. Cuota íntegra (estatal + autonómica): ~7.500€
 * 8. - Cuota sobre mínimo: ~750€
 * 9. = Cuota líquida: ~6.750€
 *
 * 10. - Deducciones: ~100€
 * 11. = Cuota resultante: ~6.650€
 *
 * 12. - Retenciones IRPF [CASILLA 0597]: -5.000€ ← AQUÍ
 * 13. = Resultado: 1.650€ (A PAGAR)
 *
 * CAMPOS A USAR:
 * - incomeSpain: 40.000€
 * - retentions: 5.000€ ← Retenciones IRPF españolas
 * - gibraltarTaxPaid: 0€ (no aplica)
 *
 * ===============================================================================
 * CASO 2: TRABAJADOR SOLO EN GIBRALTAR (DEL PDF OFICIAL)
 * ===============================================================================
 *
 * Ingresos: 41.249,41€ (Gibraltar)
 * Impuesto pagado Gibraltar: 6.542,48€
 * Retenciones capital mobiliario: 2,12€
 *
 * FLUJO OFICIAL (del PDF):
 * 1. Rendimientos del trabajo: 41.249,41€
 * 2. - Seguridad Social Gibraltar: 2.324,49€
 * 3. - Gastos deducibles: 2.000€
 * 4. = Rendimiento neto: 36.924,92€
 * 5. - Reducción rendimientos: 0€ (>21.000€)
 * 6. = Base liquidable general: 36.924,92€
 *
 * 7. Cuota íntegra (estatal + autonómica): 9.322,97€
 * 8. - Cuota sobre mínimo: 1.572,73€
 * 9. = Cuota líquida: 7.750,24€
 *
 * 10. - Deducciones autonómicas: 27,70€
 * 11. = Cuota resultante: 7.722,54€
 *
 * 12. - Deducción doble imposición [CASILLA 0588]: -6.542,48€ ← AQUÍ (Gibraltar)
 * 13. = Cuota después doble imposición: 1.180,06€
 *
 * 14. - Retenciones capital mobiliario [CASILLA 0597]: -2,12€
 * 15. = Resultado: 1.177,94€ ≈ 1.180,06€ (A PAGAR)
 *
 * CAMPOS A USAR:
 * - incomeGibraltar: 41.249,41€
 * - gibraltarTaxPaid: 6.542,48€ ← Impuesto Gibraltar (deducción doble imposición)
 * - retentions: 2,12€ ← SOLO retenciones capital mobiliario (NO trabajo)
 *
 * ⚠️ IMPORTANTE: Para trabajadores en Gibraltar:
 * - NO hay retenciones IRPF sobre trabajo
 * - El impuesto de Gibraltar NO va en "retentions"
 * - Gibraltar va en "gibraltarTaxPaid" (deducción doble imposición)
 *
 * ===============================================================================
 * CASO 3: TRABAJADOR EN AMBOS PAÍSES
 * ===============================================================================
 *
 * Ingresos España: 20.000€
 * Retenciones IRPF España: 2.500€
 * Ingresos Gibraltar: 20.000€
 * Impuesto pagado Gibraltar: 3.000€
 *
 * FLUJO OFICIAL:
 * 1. Total ingresos: 40.000€
 * 2. Base liquidable: ~35.500€
 * 3. Cuota líquida total: ~6.750€
 *
 * 4. Proporción Gibraltar: 20.000/40.000 = 50%
 * 5. Cuota teórica sobre ingresos Gibraltar: 6.750€ × 50% = 3.375€
 * 6. Deducción doble imposición: min(3.000€, 3.375€) = 3.000€
 *
 * 7. Cuota después doble imposición: 6.750€ - 3.000€ = 3.750€
 * 8. - Retenciones IRPF España: -2.500€
 * 9. = Resultado: 1.250€ (A PAGAR)
 *
 * CAMPOS A USAR:
 * - incomeSpain: 20.000€
 * - incomeGibraltar: 20.000€
 * - retentions: 2.500€ ← SOLO retenciones IRPF de España
 * - gibraltarTaxPaid: 3.000€ ← Impuesto Gibraltar (deducción doble imposición)
 *
 * ===============================================================================
 * RESUMEN DE REGLAS
 * ===============================================================================
 *
 * CAMPO: retentions
 * - USO: Retenciones IRPF practicadas en ESPAÑA sobre rendimientos del trabajo
 * - CASILLA OFICIAL: 0597 (Pagos a cuenta)
 * - CUÁNDO: Solo si trabajaste en España y te retuvieron IRPF
 * - VALOR: Aparece en tus nóminas españolas como "Retención IRPF"
 *
 * CAMPO: gibraltarTaxPaid
 * - USO: Impuesto efectivamente pagado en Gibraltar
 * - CASILLA OFICIAL: 0588 (Deducción por doble imposición internacional)
 * - CUÁNDO: Si trabajaste en Gibraltar y pagaste impuestos allí
 * - VALOR: Total del impuesto Gibraltar del año fiscal
 *
 * ⚠️ NUNCA mezclar ambos conceptos
 * ⚠️ Si trabajaste en Gibraltar, NO pongas el impuesto Gibraltar en "retentions"
 * ⚠️ La deducción doble imposición se aplica ANTES que las retenciones
 *
 * ===============================================================================
 * ORDEN DE APLICACIÓN EN EL CÁLCULO
 * ===============================================================================
 *
 * 1. Cuota líquida (estatal + autonómica)
 * 2. - Deducciones (vivienda, maternidad, etc.)
 * 3. = Cuota resultante de la autoliquidación
 * 4. - Deducción doble imposición (gibraltarTaxPaid) [CASILLA 0588]
 * 5. = Cuota después doble imposición
 * 6. - Retenciones y pagos a cuenta (retentions) [CASILLA 0597]
 * 7. = Resultado final (a pagar o a devolver)
 *
 * Este orden es CRÍTICO y está definido en el Modelo 100 oficial.
 */

// Exportar constantes para usar en el código
export const IRPF_CALCULATION_ORDER = {
  CUOTA_LIQUIDA: 1,
  DEDUCCIONES: 2,
  CUOTA_RESULTANTE: 3,
  DOBLE_IMPOSICION: 4,  // ← Gibraltar se aplica AQUÍ
  CUOTA_DESPUES_DI: 5,
  RETENCIONES: 6,       // ← Retenciones IRPF España se aplican AQUÍ
  RESULTADO_FINAL: 7,
} as const

export const CASILLAS_MODELO_100 = {
  RETENCIONES_TRABAJO_ESPANA: '0597',  // Retenciones IRPF sobre trabajo en España
  DEDUCCION_DOBLE_IMPOSICION: '0588',  // Impuesto pagado en Gibraltar
  TOTAL_PAGOS_CUENTA: '0609',          // Total retenciones (suma de todas)
  CUOTA_RESULTANTE: '0595',            // Cuota después deducciones y doble imposición
  RESULTADO_FINAL: '0610',             // Resultado final (a pagar/devolver)
} as const
