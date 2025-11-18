# 🔧 Correcciones Críticas - Calculadora de Gibraltar

**Fecha:** 17 Noviembre 2024
**Fuente oficial:** https://www.gibraltar.gov.gi/income-tax-office
**Año fiscal:** 2025/26

---

## ⚠️ RESUMEN EJECUTIVO

Los cálculos anteriores de la calculadora de Gibraltar estaban **significativamente incorrectos** debido al uso de datos no oficiales o aproximaciones. Se han corregido con información extraída directamente del sitio web oficial del Income Tax Office de Gibraltar.

**Impacto:** Los usuarios verán diferencias sustanciales en los resultados, especialmente:
- ABS: La tasa máxima pasó del **28%** al **39%** (aumento del 39%)
- GIBS: Ahora es progresivo, no una tasa fija del 20%
- Allowances: Reducción significativa en deducciones personales

---

## 📊 CORRECCIONES EN ABS (Allowance Based System)

### 1. Allowances (Deducciones) Corregidas

| Concepto | Antes (INCORRECTO) | Ahora (OFICIAL) | Diferencia |
|----------|-------------------|-----------------|------------|
| Personal Allowance | £11,100 | £3,455 | **-£7,645** ⬇️ |
| Married Allowance | £3,200 | £3,455 | +£255 ⬆️ |
| Child Allowance | £1,200 | £1,190 | -£10 (insignificante) |
| Minimum Allowance | ❌ No existía | £4,343 | **NUEVO** ✨ |

### 2. Mortgage Interest Relief Corregido

**Antes:** Limitado a £25,000 de **intereses** pagados
**Ahora:** Sobre préstamos de hasta £350,000 (sin límite en intereses dentro de este monto)

### 3. Tasas Impositivas ABS Corregidas

#### ❌ ANTES (INCORRECTO):
```
£0 - £4,000         17%
£4,001 - £16,000    20%
£16,001 - £25,000   22%
£25,001 - £40,000   27%
Más de £40,000      28%
```

#### ✅ AHORA (OFICIAL 2025/26):
```
£0 - £4,000         14%
£4,001 - £16,000    17%
Más de £16,000      39%  ⚠️ TASA MUY SUPERIOR
```

### 4. Ejemplo de Impacto ABS

**Escenario:** Persona casada, 2 hijos, ingreso £50,000, hipoteca £5,000 intereses

#### Cálculo ANTERIOR (INCORRECTO):
```
Allowances:
  Personal:    £11,100
  Married:     £3,200
  Children:    £2,400
  Mortgage:    £5,000
  TOTAL:       £21,700

Base Imponible: £50,000 - £21,700 = £28,300

Impuesto:
  £4,000 × 17% = £680
  £12,000 × 20% = £2,400
  £9,000 × 22% = £1,980
  £3,300 × 27% = £891
  TOTAL: £5,951 (11.9% tasa efectiva)
```

#### Cálculo ACTUAL (CORRECTO):
```
Allowances:
  Personal:    £3,455
  Married:     £3,455
  Children:    £2,380
  Minimum:     £4,343 (se aplica el mayor)
  Mortgage:    £5,000
  TOTAL:       £13,743

Base Imponible: £50,000 - £13,743 = £36,257

Impuesto:
  £4,000 × 14% = £560
  £12,000 × 17% = £2,040
  £20,257 × 39% = £7,900  ⚠️
  TOTAL: £10,500 (21% tasa efectiva)
```

**Diferencia:** £10,500 - £5,951 = **£4,549 MÁS de impuestos** (+76% más)

---

## 📊 CORRECCIONES EN GIBS (Gross Income Based System)

### 1. Estructura Completamente Revisada

#### ❌ ANTES (INCORRECTO):
```
Tasa base: 20% sobre ingresos brutos
Ajustes:
  - Casado: -0.3%
  - Hijos: -0.2% por hijo (máx -0.7%)

Ejemplo: Casado con 2 hijos = 19.3% fija
```

#### ✅ AHORA (OFICIAL 2025/26):

**Para ingresos ≤ £25,000:**
```
£0 - £10,000        6%
£10,001 - £17,000   20%
Más de £17,000      28%
```

**Para ingresos > £25,000:**
```
£0 - £17,000        16%
£17,001 - £25,000   19%
£25,001 - £40,000   25%
£40,001 - £105,000  28%
Más de £105,000     25%
```

### 2. Ejemplo de Impacto GIBS

**Escenario:** Ingreso £50,000

#### Cálculo ANTERIOR (INCORRECTO):
```
£50,000 × 19.7% (casado) = £9,850
Tasa efectiva: 19.7%
```

#### Cálculo ACTUAL (CORRECTO):
```
Estructura para ingresos > £25,000:
  £17,000 × 16% = £2,720
  £8,000 × 19% = £1,520
  £15,000 × 25% = £3,750
  £10,000 × 28% = £2,800
  TOTAL: £10,790
Tasa efectiva: 21.58%
```

**Diferencia:** £10,790 - £9,850 = **£940 MÁS de impuestos** (+9.5% más)

---

## 📈 COMPARACIÓN ABS vs GIBS (Con datos corregidos)

### Ejemplo: Ingreso £50,000, Casado, 2 hijos, Hipoteca £5,000 intereses

| Sistema | Impuesto | Tasa Efectiva | Ingreso Neto |
|---------|----------|---------------|--------------|
| **ABS** | £10,500 | 21.0% | £39,500 |
| **GIBS** | £10,790 | 21.58% | £39,210 |

**Mejor opción:** ABS (ahorra £290 al año)

**Nota:** Con los cálculos anteriores incorrectos:
- ABS mostraba £5,951 (SUBESTIMADO en £4,549)
- GIBS mostraba £9,850 (SUBESTIMADO en £940)
- La recomendación de "mejor sistema" podría haber sido INCORRECTA

---

## 🎯 CAMBIOS EN EL CÓDIGO

### Archivo: `src/lib/gibraltarCalculations.ts`

**Cambios en `calculateABS()`:**
```typescript
// ANTES
const personalAllowance = 11100
totalAllowances += 3200  // married
totalAllowances += numberOfChildren * 1200  // children
const mortgageDeduction = Math.min(mortgageInterest, 25000)

brackets = [
  { limit: 4000, rate: 0.17 },
  { limit: 16000, rate: 0.20 },
  { limit: 25000, rate: 0.22 },
  { limit: 40000, rate: 0.27 },
  { limit: Infinity, rate: 0.28 }
]

// AHORA
const personalAllowance = 3455
const minimumAllowance = 4343  // NUEVO
totalAllowances += 3455  // married
totalAllowances += numberOfChildren * 1190  // children
const mortgageDeduction = mortgageInterest  // sin límite de 25k

brackets = [
  { limit: 4000, rate: 0.14 },
  { limit: 16000, rate: 0.17 },
  { limit: Infinity, rate: 0.39 }  // ⚠️ CAMBIO CRÍTICO
]
```

**Cambios en `calculateGIBS()`:**
```typescript
// ANTES: Simple tasa fija con ajustes menores
let baseRate = 0.20
// ajustes por familia...
tax = annualIncome * baseRate

// AHORA: Sistema progresivo complejo con dos estructuras
if (annualIncome <= 25000) {
  // Estructura para ingresos bajos
  brackets = [
    { limit: 10000, rate: 0.06 },
    { limit: 17000, rate: 0.20 },
    { limit: Infinity, rate: 0.28 }
  ]
} else {
  // Estructura para ingresos altos
  brackets = [
    { limit: 17000, rate: 0.16 },
    { limit: 25000, rate: 0.19 },
    { limit: 40000, rate: 0.25 },
    { limit: 105000, rate: 0.28 },
    { limit: Infinity, rate: 0.25 }
  ]
}
// Cálculo progresivo...
```

---

## ⚠️ IMPLICACIONES PARA USUARIOS

### 1. Usuarios actuales verán cambios en resultados

Si alguien ya usó la calculadora y guardó resultados, verá diferencias al recalcular:

- **Ingresos bajos (< £25,000):** Impacto moderado, GIBS puede ser más favorable ahora
- **Ingresos medios (£25,000 - £60,000):** Impacto significativo, impuestos MÁS ALTOS en ambos sistemas
- **Ingresos altos (> £60,000):** Impacto CRÍTICO, especialmente en ABS (tasa 39% vs 28% anterior)

### 2. Recomendaciones ABS vs GIBS pueden cambiar

Con los cálculos corregidos, algunos usuarios que antes debían elegir GIBS ahora deberían elegir ABS (o viceversa).

### 3. Disclaimer más importante que nunca

Los usuarios **DEBEN** contrastar estos resultados con:
- Calculadora oficial del Income Tax Office
- Asesor fiscal profesional
- Su declaración real al presentarla

---

## ✅ VALIDACIÓN

### Fuentes Oficiales Consultadas:

1. **Allowances:** https://www.gibraltar.gov.gi/income-tax-office/individuals-and-employees/paye
2. **Tax Rates:** https://www.gibraltar.gov.gi/income-tax-office (página principal)

### Datos Extraídos:

- ✅ Allowances 2025/26: Confirmados
- ✅ Tasas ABS: Confirmadas (14%, 17%, 39%)
- ✅ Tasas GIBS: Confirmadas (dos estructuras según ingreso)
- ✅ Mortgage relief: Confirmado (préstamos hasta £350,000)

---

## 📝 NOTAS ADICIONALES

### Allowances No Implementadas (Posibles mejoras futuras):

El Income Tax Office ofrece más allowances que no están en nuestra calculadora:

- **Medical Insurance:** £5,395 máx.
- **Home Purchase Allowance:** £13,000 (primera vez)
- **Private Nursery:** £5,480 anual
- **Age Allowance:** £9,190 máx. (jubilación)

Estas podrían añadirse en futuras versiones para mayor precisión.

### Limitaciones Actuales:

- No contempla Category 2 individuals
- No contempla non-residents
- No contempla pensioners con reglas especiales
- Asume año fiscal completo

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

1. **Actualizar la Guía de Gibraltar** con las tasas correctas
2. **Añadir disclaimer** más visible sobre los cambios
3. **Considerar añadir** más allowances (medical, nursery, etc.)
4. **Verificar** cálculos con casos de prueba reales
5. **Informar** a usuarios actuales sobre las correcciones

---

**Commit:** `fix: Correct Gibraltar tax calculations with official 2025/26 rates`
**Branch:** `claude/spain-gibraltar-tax-app-01VmccoDm4uP2CR2V7hqVFCc`
**Estado:** ✅ Pusheado al repositorio
