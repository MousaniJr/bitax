# Correcciones Necesarias para Cálculo IRPF España

**Fecha:** 18 de Noviembre, 2025
**Versión actual:** 2.1.0
**Estado:** Pendiente de corrección

---

## 🚨 PROBLEMA IDENTIFICADO

Los tramos del IRPF en `src/lib/spainCalculations.ts` están desactualizados y no reflejan las tasas correctas de 2024-2025.

### Tramos ACTUALES en el código (❌ INCORRECTOS):

**Tramo Estatal:**
```typescript
{ limit: 12450, rate: 0.095 },   // 9.5%
{ limit: 20200, rate: 0.12 },    // 12%
{ limit: 35200, rate: 0.15 },    // 15%
{ limit: 60000, rate: 0.185 },   // 18.5%
{ limit: 300000, rate: 0.225 },  // 22.5%
{ limit: Infinity, rate: 0.24 }, // 24%
```

**Tramo Autonómico (Andalucía):**
```typescript
{ limit: 12450, rate: 0.095 },    // 9.5%
{ limit: 20200, rate: 0.12 },     // 12%
{ limit: 35200, rate: 0.15 },     // 15%
{ limit: 60000, rate: 0.185 },    // 18.5%
{ limit: 300000, rate: 0.225 },   // 22.5%
{ limit: Infinity, rate: 0.245 }, // 24.5%
```

---

## ✅ VALORES CORRECTOS 2024-2025

### Tramos TOTALES (Estatal + Autonómico):

Según fuentes oficiales (TaxDown, Wolters Kluwer, Idealista):

| Base Liquidable | Tipo Total |
|----------------|-----------|
| Hasta 12.450€ | 19% |
| 12.450€ - 20.200€ | 24% |
| 20.200€ - 35.200€ | 30% |
| 35.200€ - 60.000€ | 37% |
| 60.000€ - 300.000€ | 45% |
| Más de 300.000€ | 47% |

### Desglose Estatal vs Autonómico:

**PENDIENTE DE INVESTIGAR:** Necesitamos el desglose exacto de:
- ¿Qué porcentaje corresponde al Estado?
- ¿Qué porcentaje corresponde a la Comunidad Autónoma?

**Fuentes a consultar:**
1. Agencia Tributaria Española: https://sede.agenciatributaria.gob.es
2. BOE (Boletín Oficial del Estado): Ley del IRPF actualizada
3. Hacienda por Comunidades Autónomas

---

## 📋 TAREAS PENDIENTES

### 1. Investigación de Datos Oficiales
- [ ] Buscar en Agencia Tributaria la escala estatal EXACTA
- [ ] Buscar escalas autonómicas para las 17 CCAA
- [ ] Verificar que los datos sean de 2024-2025
- [ ] Documentar las fuentes oficiales

### 2. Actualización de Tramos
- [ ] Actualizar `stateBrackets` en `spainCalculations.ts`
- [ ] Crear objeto con todas las escalas autonómicas
- [ ] Implementar selector dinámico según CCAA seleccionada
- [ ] Verificar que la suma estatal + autonómico sea correcta

### 3. Verificación de Reducciones
- [ ] Confirmar reducción por rendimientos del trabajo:
  - Hasta 14.000€: 6.498€
  - 14.000€ - 19.000€: reducción decreciente  - 19.000€ - 21.000€: 1.245€
  - Más de 21.000€: 0€
- [ ] Verificar que estén actualizadas para 2024-2025

### 4. Mínimo Personal y Familiar
- [ ] Verificar mínimo del contribuyente: ¿5.550€ o actualizado?
- [ ] Verificar mínimos por descendientes:
  - 1º hijo: 2.400€
  - 2º hijo: 2.700€
  - 3º hijo: 4.000€
  - 4º y siguientes: 4.500€
- [ ] Verificar mínimo por hijo < 3 años: 2.800€

### 5. Deducciones
- [ ] Verificar deducción por maternidad/paternidad
- [ ] Verificar deducción por vivienda (compra antes 2013)
- [ ] Investigar deducciones específicas para trabajadores transfronterizos

### 6. Testing
- [ ] Crear casos de prueba con datos reales
- [ ] Comparar resultados con Renta Web (AEAT)
- [ ] Verificar varios escenarios:
  - Trabajador solo en Gibraltar
  - Trabajador solo en España
  - Trabajador en ambos países
  - Diferentes CCAA

---

## 📊 COMPARACIÓN DE IMPACTO

### Ejemplo: Salario de 30.000€

**Con tramos INCORRECTOS actuales:**
- Estatal: ~3.800€
- Autonómico: ~3.900€
- **Total: ~7.700€** (tasa efectiva: 25.67%)

**Con tramos CORRECTOS (estimado):**
- Debería ser aproximadamente: ~30% sobre base liquidable
- **Total estimado: ~9.000€** (tasa efectiva: ~30%)

**Diferencia: ~1.300€** ❌ ERROR SIGNIFICATIVO

---

## 🔍 FUENTES CONSULTADAS

1. **TaxDown** - https://taxdown.es/irpf/tabla-tramos/
   - Menciona los tramos totales 2024-2025

2. **Wolters Kluwer** - Tramos y retenciones IRPF 2025
   - Confirma que no hay cambios respecto a 2024

3. **Idealista** - Tramos del IRPF 2024
   - Desglose por comunidades autónomas

4. **WebSearch Results**
   - Confirma tramos totales
   - Menciona variaciones autonómicas (Madrid 45%, Cataluña 50%, Navarra 52%)

---

## ✅ PRÓXIMOS PASOS

1. **Prioritario:** Investigar tramos estatales y autonómicos EXACTOS
2. **Alto:** Actualizar código con valores correctos
3. **Alto:** Testing con casos reales
4. **Medio:** Documentar fuentes oficiales
5. **Bajo:** Añadir disclaimer sobre cambios normativos

---

**Responsable:** Equipo de desarrollo
**Deadline:** Antes de lanzar versión Premium
**Impacto:** CRÍTICO - Afecta precisión de cálculos fiscales
