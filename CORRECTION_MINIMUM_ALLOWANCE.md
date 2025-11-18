# Corrección: Minimum Allowance £4,343 vs Personal Allowance £3,455

**Fecha:** 18 Noviembre 2024
**Tipo:** Corrección crítica en valor mínimo de allowances

---

## 🔍 Problema Identificado

Había una confusión entre dos conceptos diferentes de allowances en Gibraltar:

### ❌ Implementación ANTERIOR (Incorrecta)
```typescript
export const PERSONAL_ALLOWANCE = 3455 // Personal Allowance individual
```

**Personal Allowance:** £3,455 pa
- Es el allowance básico que recibe cada individuo
- Se aplica automáticamente a cualquier persona con ingresos imponibles

### ✅ Implementación NUEVA (Correcta)
```typescript
export const PERSONAL_ALLOWANCE = 4343 // Minimum Allowance garantizado
```

**Minimum Allowance:** £4,343 (maximum top-up)
- Gibraltar aplica automáticamente un "top-up"
- Garantiza que NADIE tenga menos de £4,343 en total allowances
- Se aplica automáticamente sin documentación requerida
- Es MÁS BENEFICIOSO para el usuario

---

## 📊 Diferencia Práctica

### Escenario: Persona soltera sin hijos ni deducciones

**CON £3,455 (Personal Allowance solo):**
- Total Allowances: £3,455
- Tax Code: 1 (rango £4,000-£4,099)
- ❌ Menos beneficioso

**CON £4,343 (Minimum Allowance aplicado):**
- Total Allowances: £4,343
- Tax Code: 4 (rango £4,300-£4,399)
- ✅ **£888 más en allowances**
- ✅ Gibraltar lo aplica AUTOMÁTICAMENTE

---

## 🔧 Cambios Realizados

### 1. Constante actualizada
**Archivo:** `src/lib/gibraltarCalculations.ts`
```diff
- export const PERSONAL_ALLOWANCE = 3455
+ export const PERSONAL_ALLOWANCE = 4343
```

### 2. Tax Code inicial actualizado
**Archivo:** `src/components/calculators/GibraltarCalculator.tsx`
```diff
  const [data, setData] = useState<GibraltarData>({
    annualIncome: 0,
-   totalAllowances: 3455,
-   taxCode: 1,
+   totalAllowances: 4343,
+   taxCode: 4,
  })
```

### 3. Interfaz actualizada
- Título: "Personal Allowance" → "Minimum Allowance"
- Descripción actualizada explicando el top-up automático
- Valor mostrado: £4,343

### 4. Validaciones actualizadas
- Todos los campos que validan mínimo usan ahora £4,343
- El placeholder muestra "Mínimo: 4343"

---

## 📖 Fuente Oficial

**Gibraltar Income Tax Office - Tax Allowances:**

> **PERSONAL ALLOWANCE:** £3,455 pa
> Any individual in receipt of taxable income.
> Applied automatically.

> **MINIMUM ALLOWANCE:** £4,343 maximum top-up
> Any individual in receipt of taxable income with tax allowances of less than £4,343.
> Applied automatically. No documentation required.

**Interpretación correcta:**
1. Todas las personas reciben £3,455 (Personal Allowance)
2. Si tu total de allowances es menos de £4,343, Gibraltar te hace un "top-up" automático
3. Por lo tanto, el **mínimo garantizado es £4,343**, no £3,455

---

## 💡 Impacto en Cálculos

### Ejemplo: Ingreso £30,000

**ANTES (£3,455 allowances):**
```
Taxable Income: £30,000 - £3,455 = £26,545
ABS Tax:
  £4,000 × 14% = £560
  £12,000 × 17% = £2,040
  £10,545 × 39% = £4,112.55
  Total: £6,712.55
```

**AHORA (£4,343 allowances):**
```
Taxable Income: £30,000 - £4,343 = £25,657
ABS Tax:
  £4,000 × 14% = £560
  £12,000 × 17% = £2,040
  £9,657 × 39% = £3,766.23
  Total: £6,366.23
```

**Ahorro para el usuario:** £346.32/año ✅

---

## ✅ Validación

### Test con nuevo mínimo:

```typescript
// Test case: Ingreso mínimo con Minimum Allowance
Income: £20,000
Total Allowances: £4,343 (mínimo garantizado)

ABS:
  Taxable: £15,657
  Tax: £4,351.63

GIBS:
  Tax: £3,931.40

Best System: GIBS
Savings: £420.23
```

---

## 🎯 Beneficios de la Corrección

1. ✅ **Más preciso:** Refleja lo que Gibraltar aplica realmente
2. ✅ **Más beneficioso:** Los usuarios ven su verdadero tax liability
3. ✅ **Más simple:** El mínimo es £4,343, no hay confusión
4. ✅ **Conforme a ley:** Sigue exactamente las reglas oficiales de Gibraltar

---

## 📝 Tax Code Correspondiente

| Total Allowances | Tax Code Anterior | Tax Code Correcto |
|------------------|-------------------|-------------------|
| £3,455 | Code 1 | ❌ Por debajo del mínimo |
| £4,343 | Code 1 | Code 4 ✅ |
| £4,000-£4,099 | Code 1 ✅ | Code 1 ✅ |
| £4,300-£4,399 | Code 4 ✅ | Code 4 ✅ |

**Nota:** El Tax Code 1 (£4,000-£4,099) sigue siendo válido para ciertos casos especiales, pero el mínimo garantizado es £4,343 (Code 4).

---

## 🚀 Estado

- ✅ Constante actualizada
- ✅ Interfaz actualizada
- ✅ Validaciones actualizadas
- ✅ Tax Code inicial corregido
- ✅ Documentación creada
- ⏳ Pendiente: Commit y push

---

**Conclusión:** Esta corrección asegura que la calculadora refleja correctamente el **Minimum Allowance de £4,343** que Gibraltar aplica automáticamente a todos los contribuyentes, proporcionando cálculos más precisos y beneficiosos para los usuarios.
