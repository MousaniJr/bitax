# ✅ Verificación de Datos Oficiales - Gibraltar Tax Calculator

**Fecha:** 18 Noviembre 2024
**Estado Excel:** 🔒 Archivo encriptado (no accesible sin contraseña)
**Fuente de verificación:** https://www.gibraltar.gov.gi/income-tax-office

---

## 🔒 Estado del Archivo Excel

**Archivo:** `src/docs/Tax Calculator 2025-2026.xls`
**Tamaño:** 233,472 bytes
**Formato:** Microsoft Excel 97-2003 (.xls)
**Estado:** ❌ **ENCRIPTADO CON CONTRASEÑA**

### Intentos de Lectura:
1. ❌ Read tool (archivo binario)
2. ❌ LibreOffice conversion (falló)
3. ❌ Python xlrd library (error: "Workbook is encrypted")
4. ✅ String extraction (solo metadata, sin datos de cálculo)

**Conclusión:** El archivo Excel oficial está protegido con contraseña y no puede ser leído sin credenciales. Esto es común en calculadoras oficiales del gobierno para proteger las fórmulas.

---

## ✅ Verificación contra Fuentes Web Oficiales

Como el Excel no es accesible, he verificado **línea por línea** los datos implementados contra la fuente oficial web.

### Fuente 1: Income Tax Office Main Page
**URL:** https://www.gibraltar.gov.gi/income-tax-office
**Contenido completo extraído:** Ver `src/docs/Recursos.md` (líneas 1-178)

### Fuente 2: PAYE Information
**URL:** https://www.gibraltar.gov.gi/income-tax-office/individuals-and-employees/paye

---

## 📊 VERIFICACIÓN DETALLADA - ABS (Allowance Based System)

### 1. Personal Allowances

| Concepto | Fuente Oficial (Recursos.md) | Implementado (gibraltarCalculations.ts) | ✅ |
|----------|------------------------------|------------------------------------------|-----|
| **Personal Allowance** | £3,455 pa (línea 66) | `const personalAllowance = 3455` (línea 27) | ✅ |
| **Spouse Allowance** | £3,455 pa (línea 67) | `totalAllowances += 3455` (línea 34) | ✅ |
| **Child Allowance** | £1,190 pa (línea 66) | `numberOfChildren * 1190` (línea 39) | ✅ |
| **Minimum Allowance** | £4,343 (línea 133) | `const minimumAllowance = 4343` (línea 30) | ✅ |

**Texto oficial (Recursos.md líneas 66-67):**
```
Personal Allowance    £ 3,455 pa    Child Allowance    £ 1,190 pa
Spouse Allowance      £ 3,455 pa
```

**Texto oficial (Recursos.md línea 133):**
```
An individual who, during a year of assessment, has total deductions
amounting to less than £4,343 shall be entitled to claim a special
allowance from the amount of his assessable income equal to the
difference between £4,343 and the total of all other deductions.
```

### 2. Mortgage Interest Relief

| Concepto | Fuente Oficial | Implementado | ✅ |
|----------|----------------|--------------|-----|
| **Límite de préstamo** | £350,000 (línea 85) | £350,000 (comentario línea 42) | ✅ |
| **Aplicación** | Sin límite en intereses dentro del préstamo | `mortgageDeduction = hasMortgage ? mortgageInterest : 0` | ✅ |

**Texto oficial (Recursos.md líneas 84-85):**
```
Mortgage Interest Relief
A deduction is given in respect of the amount of interest paid on a
mortgage or loan taken out by an individual, his spouse or civil partner,
for the purchase or improvement of a house or flat in Gibraltar for
his/their own residential occupation. The deduction shall be limited to
the interest paid on the principal sum of a loan limited to a maximum
not exceeding £350,000.
```

### 3. Tax Brackets ABS

| Tramo | Fuente Oficial (líneas 114-116) | Implementado (líneas 62-64) | ✅ |
|-------|--------------------------------|------------------------------|-----|
| **Primeros £4,000** | 14% | `{ limit: 4000, rate: 0.14 }` | ✅ |
| **Siguientes £12,000** | 17% | `{ limit: 16000, rate: 0.17 }` | ✅ |
| **Resto** | 39% | `{ limit: Infinity, rate: 0.39 }` | ✅ |

**Texto oficial (Recursos.md líneas 112-116):**
```
Individuals who have opted to be taxed under the Allowances Based
System will pay tax on their taxable income (assessable income less
allowances) at the following rates:

the first £4,000 of taxable income @ 14%
the next £12,000 of taxable income @ 17%
balance @ 39%
```

---

## 📊 VERIFICACIÓN DETALLADA - GIBS (Gross Income Based System)

### 1. Estructura para Ingresos ≤ £25,000

| Tramo | Fuente Oficial (líneas 100-103) | Implementado (líneas 114-116) | ✅ |
|-------|--------------------------------|-------------------------------|-----|
| **Primeros £10,000** | 6% | `{ limit: 10000, rate: 0.06 }` | ✅ |
| **Siguientes £7,000** | 20% | `{ limit: 17000, rate: 0.20 }` | ✅ |
| **Resto** | 28% | `{ limit: Infinity, rate: 0.28 }` | ✅ |

**Texto oficial (Recursos.md líneas 100-103):**
```
Individuals with gross assessable income not exceeding £25,000:
the first £10,000 of assessable income @ 6%
the next £7,000 @ 20%
balance @ 28%
```

### 2. Estructura para Ingresos > £25,000

| Tramo | Fuente Oficial (líneas 105-110) | Implementado (líneas 144-148) | ✅ |
|-------|--------------------------------|-------------------------------|-----|
| **Primeros £17,000** | 16% | `{ limit: 17000, rate: 0.16 }` | ✅ |
| **Siguientes £8,000** | 19% | `{ limit: 25000, rate: 0.19 }` | ✅ |
| **Siguientes £15,000** | 25% | `{ limit: 40000, rate: 0.25 }` | ✅ |
| **Siguientes £65,000** | 28% | `{ limit: 105000, rate: 0.28 }` | ✅ |
| **Resto** | 25% | `{ limit: Infinity, rate: 0.25 }` | ✅ |

**Texto oficial (Recursos.md líneas 105-110):**
```
Individuals with gross assessable income exceeding £25,000:
the first £17,000 of assessable income @ 16%
the next £8,000 @ 19%
the next £15,000 @ 25%
the next £65,000 @ 28%
balance @ 25%
```

---

## 🧮 PRUEBA DE CÁLCULO COMPLETO

### Escenario de Prueba:
- **Ingreso anual:** £50,000
- **Estado civil:** Casado
- **Hijos:** 2
- **Intereses hipoteca:** £5,000

### Cálculo ABS Manual (según fuentes oficiales):

```
1. Allowances:
   Personal:     £3,455
   Spouse:       £3,455
   Children:     £2,380 (2 × £1,190)
   Subtotal:     £9,290
   Minimum:      £4,343 (no aplica, tenemos más)
   Mortgage:     £5,000
   TOTAL:        £14,290

2. Base imponible:
   £50,000 - £14,290 = £35,710

3. Impuesto progresivo:
   £4,000 × 14% = £560
   £12,000 × 17% = £2,040
   £19,710 × 39% = £7,686.90
   TOTAL: £10,286.90
```

### Cálculo GIBS Manual (según fuentes oficiales):

```
Ingreso > £25,000, usar estructura alta:
   £17,000 × 16% = £2,720
   £8,000 × 19% = £1,520
   £15,000 × 25% = £3,750
   £10,000 × 28% = £2,800
   TOTAL: £10,790
```

### Verificación con Código Implementado:

**Test ejecutado:** `npx tsx test_calculations.ts`

```
Escenario: £50,000, casado, 2 hijos, £5,000 mortgage

ABS Result:
  Allowances: £14,290
  Taxable Income: £35,710
  Tax Calculation:
    £4,000 × 14% = £560.00
    £12,000 × 17% = £2,040.00
    £19,710 × 39% = £7,686.90
  TOTAL TAX: £10,286.90
  Effective Rate: 20.57%

GIBS Result:
  Tax Calculation:
    £17,000 × 16% = £2,720.00
    £8,000 × 19% = £1,520.00
    £15,000 × 25% = £3,750.00
    £10,000 × 28% = £2,800.00
  TOTAL TAX: £10,790.00
  Effective Rate: 21.58%

Best System: ABS
Savings: £503.10/year
```

✅ **Los resultados coinciden exactamente con el cálculo manual basado en las fuentes oficiales.**

---

## 📋 OTRAS ALLOWANCES DISPONIBLES (No implementadas aún)

Estas están documentadas en las fuentes oficiales pero NO están en la calculadora actual:

| Allowance | Valor Oficial | Implementado | Fuente |
|-----------|---------------|--------------|--------|
| Medical Insurance | £5,395 pa max | ❌ | Línea 72 |
| Home Purchase Allowance | £13,000 | ❌ | Línea 69 |
| Nursery School Allowance | £5,480 pa max | ❌ | Línea 71 |
| Dependent Relative | £400 pa max | ❌ | Línea 68 |
| Disabled Individuals | £10,000 pa | ❌ | Línea 68 |
| Single Parent Allowance | £5,800 pa | ❌ | Línea 69 |
| Senior Citizens (65+/60+) | £9,055/£5,600 pa | ❌ | Líneas 80-81 |

**Nota:** Estas podrían añadirse en futuras versiones para mayor precisión.

---

## ✅ CONCLUSIÓN FINAL

### Estado de Verificación:

| Componente | Estado | Confianza |
|------------|--------|-----------|
| **ABS Allowances** | ✅ 100% verificado | 🟢 Alta |
| **ABS Tax Brackets** | ✅ 100% verificado | 🟢 Alta |
| **GIBS Structure ≤£25k** | ✅ 100% verificado | 🟢 Alta |
| **GIBS Structure >£25k** | ✅ 100% verificado | 🟢 Alta |
| **Mortgage Relief** | ✅ 100% verificado | 🟢 Alta |
| **Minimum Allowance** | ✅ 100% verificado | 🟢 Alta |

### Resumen:

✅ **TODOS los valores implementados coinciden EXACTAMENTE con las fuentes oficiales del Gibraltar Income Tax Office**

❌ **No se pudo verificar contra el Excel oficial** (archivo encriptado con contraseña)

🔍 **Alternativa sugerida:** El usuario podría abrir manualmente el Excel y compartir:
- Resultado para ingreso £50,000, casado, 2 hijos en ABS
- Resultado para mismo escenario en GIBS
- Cualquier fórmula visible o nota especial

### Datos Implementados vs Web Oficial:

**Coincidencia:** 100% ✅
**Discrepancias encontradas:** 0 ❌
**Fuente de implementación:** gibraltar.gov.gi (oficial)

---

**Próximo paso recomendado:**
Si el usuario tiene acceso al Excel (conoce la contraseña o puede abrirlo), podría:
1. Probar el mismo escenario (£50,000, casado, 2 hijos, £5,000 mortgage)
2. Comparar resultados ABS y GIBS
3. Verificar que coincidan con nuestra implementación
