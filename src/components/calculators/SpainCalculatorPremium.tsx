'use client'

import { useState } from 'react'
import { SpainDataPremium, SpainResult } from '@/types'
import { calculateSpainTax } from '@/lib/spainCalculations'
import { formatNumber, parseFormattedNumber } from '@/lib/numberFormat'
import { FileText, AlertCircle, MapPin, Crown, Save, ChevronDown, ChevronUp, Euro } from 'lucide-react'

type IncomeSource = 'gibraltar' | 'spain' | 'both'

interface Props {
  isPremium?: boolean
  onSave?: (data: SpainDataPremium, result: SpainResult) => void
}

export default function SpainCalculatorPremium({ isPremium = false, onSave }: Props) {
  const [incomeSource, setIncomeSource] = useState<IncomeSource | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    rendimientos: true,
    gastos: false,
    reducciones: false,
    minimos: false,
    deduccionesEstatales: false,
    deduccionesAutonomicas: false,
  })

  const [data, setData] = useState<SpainDataPremium>({
    // Datos básicos
    incomeSpain: 0,
    incomeGibraltar: 0,
    socialSecurityContributions: 0,
    gibraltarTaxPaid: 0,
    gibraltarSocialSecurity: 0,
    maritalStatus: 'single',
    hasChildren: false,
    numberOfChildren: 0,
    shareChildrenMinimumWithSpouse: false,
    childrenUnder3: 0,
    hasDisabledDependents: false,
    hasMortgage: false,
    mortgageAmount: 0,
    isPrimaryResidence: false,
    purchaseYear: new Date().getFullYear(),
    regionalDeductions: 0,
    maternityPaternity: 0,
    retentions: 0,
    autonomousCommunity: 'andalucia',

    // Datos premium
    age: 30,
    disability: 0,

    rendimientosTrabajo: {
      sueldoSalarios: 0,
      valoracionEspecie: 0,
      dietasExentas: 0,
      indemnizaciones: 0,
    },

    gastosDeducibles: {
      seguridadSocial: 0,
      cuotasSindicales: 0,
      colegiosProfesionales: 0,
      gastosDefensaJuridica: 0,
      movilidadGeografica: false,
    },

    reduccionesBI: {
      aportacionesPlanesPrivados: 0,
      aportacionesPlanesEmpresa: 0,
      pensionesCompensatorias: 0,
      anualidadesAlimentos: 0,
    },

    minimos: {
      contribuyente: 5550,
      mayores65: false,
      mayores75: false,
      descendientes: {
        menores25: 0,
        menores3: 0,
        discapacidad33: 0,
        discapacidad65: 0,
      },
      ascendientes: {
        mayores65: 0,
        mayores75: 0,
        discapacidad33: 0,
        discapacidad65: 0,
      },
    },

    deduccionesEstatales: {
      inversionVivienda: 0,
      donativosONG: 0,
      donativosPartidos: 0,
      actuacionesMedioambiente: 0,
    },

    deduccionesAutonomicas: {
      porNacimiento: 0,
      porAdopcion: 0,
      porFamiliaNumerosa: 0,
      porAlquilerVivienda: 0,
      porGastosEducativos: 0,
      porCuidadoPersonas: 0,
      otras: 0,
    },
  })

  const [result, setResult] = useState<SpainResult | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Calculate totals for display
  const calcularTotalGastosDeducibles = () => {
    const { gastosDeducibles } = data
    let total = gastosDeducibles.seguridadSocial +
      gastosDeducibles.cuotasSindicales +
      Math.min(gastosDeducibles.colegiosProfesionales, 500) +
      Math.min(gastosDeducibles.gastosDefensaJuridica, 300)
    if (gastosDeducibles.movilidadGeografica) total += 2000
    return total
  }

  const calcularTotalReducciones = () => {
    const { reduccionesBI } = data
    return Math.min(reduccionesBI.aportacionesPlanesPrivados, 1500) +
      Math.min(reduccionesBI.aportacionesPlanesEmpresa, 8500) +
      reduccionesBI.pensionesCompensatorias +
      reduccionesBI.anualidadesAlimentos
  }

  const calcularTotalMinimos = () => {
    const { minimos } = data
    let total = minimos.contribuyente
    if (minimos.mayores65) total += 1150
    if (minimos.mayores75) total += 1400

    // Descendientes
    const childMinimums = [2400, 2700, 4000, 4500]
    for (let i = 0; i < minimos.descendientes.menores25; i++) {
      total += childMinimums[Math.min(i, 3)]
    }
    total += minimos.descendientes.menores3 * 2800
    total += minimos.descendientes.discapacidad33 * 3000
    total += minimos.descendientes.discapacidad65 * 9000

    // Ascendientes
    total += minimos.ascendientes.mayores65 * 1150
    total += minimos.ascendientes.mayores75 * 1400
    total += minimos.ascendientes.discapacidad33 * 3000
    total += minimos.ascendientes.discapacidad65 * 9000

    return total
  }

  const calcularTotalDeduccionesEstatales = () => {
    const { deduccionesEstatales } = data
    let total = deduccionesEstatales.inversionVivienda

    // Donativos ONG: 80% primeros 150€, 35% resto
    if (deduccionesEstatales.donativosONG > 0) {
      const primeros150 = Math.min(deduccionesEstatales.donativosONG, 150) * 0.80
      const resto = Math.max(0, deduccionesEstatales.donativosONG - 150) * 0.35
      total += primeros150 + resto
    }

    total += deduccionesEstatales.donativosPartidos * 0.20
    total += deduccionesEstatales.actuacionesMedioambiente

    return total
  }

  const calcularTotalDeduccionesAutonomicas = () => {
    const { deduccionesAutonomicas } = data
    return deduccionesAutonomicas.porNacimiento +
      deduccionesAutonomicas.porAdopcion +
      deduccionesAutonomicas.porFamiliaNumerosa +
      deduccionesAutonomicas.porAlquilerVivienda +
      deduccionesAutonomicas.porGastosEducativos +
      deduccionesAutonomicas.porCuidadoPersonas +
      deduccionesAutonomicas.otras
  }

  const handleCalculate = () => {
    // Sync premium fields to standard fields for calculation
    const syncedData = {
      ...data,
      socialSecurityContributions: data.gastosDeducibles.seguridadSocial,
      regionalDeductions: calcularTotalDeduccionesAutonomicas(),
      numberOfChildren: data.minimos.descendientes.menores25,
      childrenUnder3: data.minimos.descendientes.menores3,
    }

    const calculatedResult = calculateSpainTax(syncedData)
    setResult(calculatedResult)

    // Save to localStorage
    localStorage.setItem('spain-premium-income-source', incomeSource || '')
    localStorage.setItem('spain-premium-data', JSON.stringify(data))
    localStorage.setItem('spain-premium-result', JSON.stringify(calculatedResult))
  }

  const handleSave = () => {
    if (result && onSave) {
      onSave(data, result)
    }
  }

  const handleInputChange = (field: keyof SpainDataPremium, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value,
      },
    }))
  }

  const handleDoubleNestedChange = (parent: string, child: string, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [child]: {
          ...((prev as any)[parent] as any)[child],
          [field]: value,
        },
      },
    }))
  }

  const handleIncomeSourceChange = (source: IncomeSource) => {
    setIncomeSource(source)
    if (source === 'gibraltar') {
      setData((prev) => ({ ...prev, incomeSpain: 0 }))
    } else if (source === 'spain') {
      setData((prev) => ({ ...prev, incomeGibraltar: 0, gibraltarTaxPaid: 0, gibraltarSocialSecurity: 0 }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Calculadora España (IRPF)</h2>
              <p className="text-sm text-gray-500">Versión Premium con deducciones detalladas</p>
            </div>
          </div>
          {isPremium && (
            <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              <Crown className="h-4 w-4" />
              <span className="text-sm font-semibold">Premium</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6">
          Calcula tu declaración de la renta con todas las deducciones y reducciones oficiales disponibles.
        </p>

        {/* Income Source Selector */}
        {!incomeSource && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿De dónde has obtenido tus ingresos en el año fiscal?
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => handleIncomeSourceChange('gibraltar')}
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Solo Gibraltar</h4>
                </div>
                <p className="text-sm text-gray-600">
                  He trabajado únicamente en Gibraltar
                </p>
              </button>

              <button
                onClick={() => handleIncomeSourceChange('spain')}
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Solo España</h4>
                </div>
                <p className="text-sm text-gray-600">
                  He trabajado únicamente en España
                </p>
              </button>

              <button
                onClick={() => handleIncomeSourceChange('both')}
                className="p-6 border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Ambos Países</h4>
                </div>
                <p className="text-sm text-gray-600">
                  He trabajado en Gibraltar y España
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {incomeSource && (
          <div className="space-y-6">
            {/* Change button */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className={`h-5 w-5 ${
                  incomeSource === 'gibraltar' ? 'text-red-600' :
                  incomeSource === 'spain' ? 'text-blue-600' :
                  'text-purple-600'
                }`} />
                <span className="font-semibold text-gray-900">
                  {incomeSource === 'gibraltar' && 'Ingresos solo de Gibraltar'}
                  {incomeSource === 'spain' && 'Ingresos solo de España'}
                  {incomeSource === 'both' && 'Ingresos de ambos países'}
                </span>
              </div>
              <button
                onClick={() => {
                  setIncomeSource(null)
                  setResult(null)
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
              >
                Cambiar
              </button>
            </div>

            {/* Double taxation notice */}
            {(incomeSource === 'gibraltar' || incomeSource === 'both') && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Convenio de doble imposición España-Gibraltar:</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      ✓ El impuesto pagado en Gibraltar se aplica como <strong>deducción por doble imposición</strong> (Casilla 0588 del Modelo 100)<br/>
                      ✓ Se resta ANTES que las retenciones IRPF españolas<br/>
                      ✓ Esto evita que pagues impuestos dos veces por los mismos ingresos
                    </p>
                    {incomeSource === 'both' && (
                      <p className="text-sm text-blue-700 mt-2">
                        <strong>Nota:</strong> Las retenciones IRPF de tu trabajo en España se aplican por separado (Casilla 0597)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Section: Rendimientos del Trabajo */}
            <div className="border rounded-lg overflow-hidden text-gray-900">
              <button
                onClick={() => toggleSection('rendimientos')}
                className="w-full bg-blue-50 p-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Euro className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Rendimientos del Trabajo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-blue-600 font-semibold">
                    {(data.rendimientosTrabajo.sueldoSalarios + data.rendimientosTrabajo.valoracionEspecie).toLocaleString()}€
                  </span>
                  {expandedSections.rendimientos ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {expandedSections.rendimientos && (
                <div className="p-4 space-y-4">
                  {/* Spain income */}
                  {(incomeSource === 'spain' || incomeSource === 'both') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sueldo y salarios brutos en España (€) *
                      </label>
                      <input
                        type="text"
                    inputMode="numeric"
                        value={data.rendimientosTrabajo.sueldoSalarios || ''}
                        onChange={(e) => {
                          handleNestedChange('rendimientosTrabajo', 'sueldoSalarios', parseFloat(e.target.value) || 0)
                          handleInputChange('incomeSpain', parseFloat(e.target.value) || 0)
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Ej: 35000"
                      />
                    </div>
                  )}

                  {/* Gibraltar income */}
                  {(incomeSource === 'gibraltar' || incomeSource === 'both') && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ingresos anuales en Gibraltar (€) *
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          value={data.incomeGibraltar || ''}
                          onChange={(e) => handleInputChange('incomeGibraltar', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Ej: 35000"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Convertir libras a euros al tipo de cambio medio anual
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Impuesto pagado en Gibraltar (€) *
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          value={data.gibraltarTaxPaid || ''}
                          onChange={(e) => handleInputChange('gibraltarTaxPaid', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Ej: 4200"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Total impuesto Gibraltar del año fiscal (se aplica como deducción por doble imposición)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Seguridad Social Gibraltar (€)
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          value={data.gibraltarSocialSecurity || ''}
                          onChange={(e) => handleInputChange('gibraltarSocialSecurity', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Ej: 2500"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Retribución en especie (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.rendimientosTrabajo.valoracionEspecie || ''}
                      onChange={(e) => handleNestedChange('rendimientosTrabajo', 'valoracionEspecie', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 3000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Coche empresa, seguro médico, tickets restaurante valorado, etc.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dietas y gastos de viaje exentos (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.rendimientosTrabajo.dietasExentas || ''}
                      onChange={(e) => handleNestedChange('rendimientosTrabajo', 'dietasExentas', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 1500"
                    />
                  </div>

                  {/* Autonomous Community */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Comunidad Autónoma de residencia *
                    </label>
                    <select
                      value={data.autonomousCommunity}
                      onChange={(e) => handleInputChange('autonomousCommunity', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="andalucia">Andalucía</option>
                      <option value="aragon">Aragón</option>
                      <option value="asturias">Asturias</option>
                      <option value="baleares">Baleares</option>
                      <option value="canarias">Canarias</option>
                      <option value="cantabria">Cantabria</option>
                      <option value="castilla-leon">Castilla y León</option>
                      <option value="castilla-mancha">Castilla-La Mancha</option>
                      <option value="cataluna">Cataluña</option>
                      <option value="valencia">Comunidad Valenciana</option>
                      <option value="extremadura">Extremadura</option>
                      <option value="galicia">Galicia</option>
                      <option value="madrid">Madrid</option>
                      <option value="murcia">Murcia</option>
                      <option value="navarra">Navarra</option>
                      <option value="pais-vasco">País Vasco</option>
                      <option value="rioja">La Rioja</option>
                    </select>
                  </div>

                  {/* Retentions */}
                  {(incomeSource === 'spain' || incomeSource === 'both') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Retenciones practicadas (€)
                      </label>
                      <input
                        type="text"
                    inputMode="numeric"
                        value={data.retentions || ''}
                        onChange={(e) => handleInputChange('retentions', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Ej: 5000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        IRPF retenido en tus nóminas españolas
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section: Gastos Deducibles */}
            <div className="border rounded-lg overflow-hidden text-gray-900">
              <button
                onClick={() => toggleSection('gastos')}
                className="w-full bg-green-50 p-4 flex items-center justify-between hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Euro className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Gastos Deducibles del Trabajo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-green-600 font-semibold">
                    -{calcularTotalGastosDeducibles().toLocaleString()}€
                  </span>
                  {expandedSections.gastos ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {expandedSections.gastos && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cotizaciones Seguridad Social (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.gastosDeducibles.seguridadSocial || ''}
                      onChange={(e) => handleNestedChange('gastosDeducibles', 'seguridadSocial', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 3000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cuotas sindicales (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.gastosDeducibles.cuotasSindicales || ''}
                      onChange={(e) => handleNestedChange('gastosDeducibles', 'cuotasSindicales', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Colegios profesionales (€) <span className="text-gray-500">(máx. 500€)</span>
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.gastosDeducibles.colegiosProfesionales || ''}
                      onChange={(e) => handleNestedChange('gastosDeducibles', 'colegiosProfesionales', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 350"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gastos defensa jurídica laboral (€) <span className="text-gray-500">(máx. 300€)</span>
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.gastosDeducibles.gastosDefensaJuridica || ''}
                      onChange={(e) => handleNestedChange('gastosDeducibles', 'gastosDefensaJuridica', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 200"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="movilidadGeografica"
                      checked={data.gastosDeducibles.movilidadGeografica}
                      onChange={(e) => handleNestedChange('gastosDeducibles', 'movilidadGeografica', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="movilidadGeografica" className="text-sm text-gray-700">
                      <span className="font-semibold">Movilidad geográfica</span> (+2.000€ reducción)
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Aplicable si has aceptado un trabajo que te ha obligado a cambiar de residencia
                  </p>
                </div>
              )}
            </div>

            {/* Section: Reducciones Base Imponible */}
            <div className="border rounded-lg overflow-hidden text-gray-900">
              <button
                onClick={() => toggleSection('reducciones')}
                className="w-full bg-purple-50 p-4 flex items-center justify-between hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Euro className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">Reducciones en Base Imponible</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-purple-600 font-semibold">
                    -{calcularTotalReducciones().toLocaleString()}€
                  </span>
                  {expandedSections.reducciones ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {expandedSections.reducciones && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aportaciones planes de pensiones individuales (€) <span className="text-gray-500">(máx. 1.500€)</span>
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.reduccionesBI.aportacionesPlanesPrivados || ''}
                      onChange={(e) => handleNestedChange('reduccionesBI', 'aportacionesPlanesPrivados', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 1500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aportaciones planes de pensiones empresa (€) <span className="text-gray-500">(máx. 8.500€)</span>
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.reduccionesBI.aportacionesPlanesEmpresa || ''}
                      onChange={(e) => handleNestedChange('reduccionesBI', 'aportacionesPlanesEmpresa', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pensiones compensatorias al cónyuge (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.reduccionesBI.pensionesCompensatorias || ''}
                      onChange={(e) => handleNestedChange('reduccionesBI', 'pensionesCompensatorias', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 6000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Anualidades por alimentos a hijos (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.reduccionesBI.anualidadesAlimentos || ''}
                      onChange={(e) => handleNestedChange('reduccionesBI', 'anualidadesAlimentos', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 3600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section: Mínimos Personales y Familiares */}
            <div className="border rounded-lg overflow-hidden text-gray-900">
              <button
                onClick={() => toggleSection('minimos')}
                className="w-full bg-yellow-50 p-4 flex items-center justify-between hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Euro className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-gray-900">Mínimos Personales y Familiares</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-yellow-600 font-semibold">
                    {calcularTotalMinimos().toLocaleString()}€
                  </span>
                  {expandedSections.minimos ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {expandedSections.minimos && (
                <div className="p-4 space-y-4">
                  {/* Age related */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Mínimo del Contribuyente</h4>
                    <p className="text-sm text-gray-600 mb-3">Base: 5.550€</p>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="mayores65"
                          checked={data.minimos.mayores65}
                          onChange={(e) => handleNestedChange('minimos', 'mayores65', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="mayores65" className="text-sm text-gray-700">
                          Mayor de 65 años (+1.150€)
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="mayores75"
                          checked={data.minimos.mayores75}
                          onChange={(e) => handleNestedChange('minimos', 'mayores75', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="mayores75" className="text-sm text-gray-700">
                          Mayor de 75 años (+1.400€ adicionales)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Descendientes */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Mínimo por Descendientes</h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Hijos menores de 25 años
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          min="0"
                          value={data.minimos.descendientes.menores25 || ''}
                          onChange={(e) => {
                            handleDoubleNestedChange('minimos', 'descendientes', 'menores25', parseInt(e.target.value) || 0)
                            handleInputChange('hasChildren', (parseInt(e.target.value) || 0) > 0)
                          }}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">1º: 2.400€, 2º: 2.700€, 3º: 4.000€, 4º+: 4.500€</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          De ellos, menores de 3 años
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          min="0"
                          value={data.minimos.descendientes.menores3 || ''}
                          onChange={(e) => handleDoubleNestedChange('minimos', 'descendientes', 'menores3', parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">+2.800€ por cada uno</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Con discapacidad ≥33%
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          min="0"
                          value={data.minimos.descendientes.discapacidad33 || ''}
                          onChange={(e) => handleDoubleNestedChange('minimos', 'descendientes', 'discapacidad33', parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">+3.000€ por cada uno</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Con discapacidad ≥65%
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          min="0"
                          value={data.minimos.descendientes.discapacidad65 || ''}
                          onChange={(e) => handleDoubleNestedChange('minimos', 'descendientes', 'discapacidad65', parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">+9.000€ por cada uno</p>
                      </div>

                      {/* Tributación individual con reparto de hijos */}
                      {data.minimos.descendientes.menores25 > 0 && (
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <label className="flex items-start space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.shareChildrenMinimumWithSpouse || false}
                              onChange={(e) => handleInputChange('shareChildrenMinimumWithSpouse', e.target.checked)}
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <span className="text-sm text-gray-700 font-medium">
                                Comparto el mínimo por hijos con mi cónyuge (50%)
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                Marca esta casilla si estás casado/a, hacéis declaraciones individuales,
                                y compartís el mínimo por descendientes. Cada uno aplicará el 50% del mínimo.
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ascendientes */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Mínimo por Ascendientes</h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Ascendientes mayores de 65 años
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          min="0"
                          value={data.minimos.ascendientes.mayores65 || ''}
                          onChange={(e) => handleDoubleNestedChange('minimos', 'ascendientes', 'mayores65', parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">1.150€ por cada uno</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          De ellos, mayores de 75 años
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          min="0"
                          value={data.minimos.ascendientes.mayores75 || ''}
                          onChange={(e) => handleDoubleNestedChange('minimos', 'ascendientes', 'mayores75', parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">+1.400€ adicionales</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Con discapacidad ≥33%
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          min="0"
                          value={data.minimos.ascendientes.discapacidad33 || ''}
                          onChange={(e) => handleDoubleNestedChange('minimos', 'ascendientes', 'discapacidad33', parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">+3.000€ por cada uno</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Con discapacidad ≥65%
                        </label>
                        <input
                          type="text"
                    inputMode="numeric"
                          min="0"
                          value={data.minimos.ascendientes.discapacidad65 || ''}
                          onChange={(e) => handleDoubleNestedChange('minimos', 'ascendientes', 'discapacidad65', parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">+9.000€ por cada uno</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Deducciones Estatales */}
            <div className="border rounded-lg overflow-hidden text-gray-900">
              <button
                onClick={() => toggleSection('deduccionesEstatales')}
                className="w-full bg-red-50 p-4 flex items-center justify-between hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Euro className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-gray-900">Deducciones Estatales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-red-600 font-semibold">
                    -{calcularTotalDeduccionesEstatales().toLocaleString()}€
                  </span>
                  {expandedSections.deduccionesEstatales ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {expandedSections.deduccionesEstatales && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Inversión vivienda habitual (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.deduccionesEstatales.inversionVivienda || ''}
                      onChange={(e) => handleNestedChange('deduccionesEstatales', 'inversionVivienda', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 9040"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Solo si adquirió la vivienda antes del 1/1/2013. Máximo 9.040€/año
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Donativos a ONG y fundaciones (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.deduccionesEstatales.donativosONG || ''}
                      onChange={(e) => handleNestedChange('deduccionesEstatales', 'donativosONG', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      80% primeros 150€, 35-40% del resto
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Donativos a partidos políticos (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.deduccionesEstatales.donativosPartidos || ''}
                      onChange={(e) => handleNestedChange('deduccionesEstatales', 'donativosPartidos', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      20% de las cuotas, máximo base 600€
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deducciones medioambientales (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.deduccionesEstatales.actuacionesMedioambiente || ''}
                      onChange={(e) => handleNestedChange('deduccionesEstatales', 'actuacionesMedioambiente', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 1000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Vehículos eléctricos, instalaciones de autoconsumo, etc.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Deducciones Autonómicas */}
            <div className="border rounded-lg overflow-hidden text-gray-900">
              <button
                onClick={() => toggleSection('deduccionesAutonomicas')}
                className="w-full bg-indigo-50 p-4 flex items-center justify-between hover:bg-indigo-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Euro className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold text-gray-900">Deducciones Autonómicas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-indigo-600 font-semibold">
                    -{calcularTotalDeduccionesAutonomicas().toLocaleString()}€
                  </span>
                  {expandedSections.deduccionesAutonomicas ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {expandedSections.deduccionesAutonomicas && (
                <div className="p-4 space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-700">
                      Las deducciones autonómicas varían según la Comunidad Autónoma.
                      Consulte la normativa específica de {data.autonomousCommunity.charAt(0).toUpperCase() + data.autonomousCommunity.slice(1).replace('-', ' ')}.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Por nacimiento/adopción (€)
                      </label>
                      <input
                        type="text"
                    inputMode="numeric"
                        value={data.deduccionesAutonomicas.porNacimiento || ''}
                        onChange={(e) => handleNestedChange('deduccionesAutonomicas', 'porNacimiento', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Ej: 600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Por adopción internacional (€)
                      </label>
                      <input
                        type="text"
                    inputMode="numeric"
                        value={data.deduccionesAutonomicas.porAdopcion || ''}
                        onChange={(e) => handleNestedChange('deduccionesAutonomicas', 'porAdopcion', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Ej: 600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Por familia numerosa (€)
                      </label>
                      <input
                        type="text"
                    inputMode="numeric"
                        value={data.deduccionesAutonomicas.porFamiliaNumerosa || ''}
                        onChange={(e) => handleNestedChange('deduccionesAutonomicas', 'porFamiliaNumerosa', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Ej: 500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Por alquiler vivienda (€)
                      </label>
                      <input
                        type="text"
                    inputMode="numeric"
                        value={data.deduccionesAutonomicas.porAlquilerVivienda || ''}
                        onChange={(e) => handleNestedChange('deduccionesAutonomicas', 'porAlquilerVivienda', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Ej: 500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Por gastos educativos (€)
                      </label>
                      <input
                        type="text"
                    inputMode="numeric"
                        value={data.deduccionesAutonomicas.porGastosEducativos || ''}
                        onChange={(e) => handleNestedChange('deduccionesAutonomicas', 'porGastosEducativos', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Ej: 1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Por cuidado de personas (€)
                      </label>
                      <input
                        type="text"
                    inputMode="numeric"
                        value={data.deduccionesAutonomicas.porCuidadoPersonas || ''}
                        onChange={(e) => handleNestedChange('deduccionesAutonomicas', 'porCuidadoPersonas', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Ej: 300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Otras deducciones autonómicas (€)
                    </label>
                    <input
                      type="text"
                    inputMode="numeric"
                      value={data.deduccionesAutonomicas.otras || ''}
                      onChange={(e) => handleNestedChange('deduccionesAutonomicas', 'otras', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Ej: 200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Resumen de Deducciones Premium</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Gastos deducibles:</span>
                <span className="text-right font-semibold">-{calcularTotalGastosDeducibles().toLocaleString()}€</span>

                <span className="text-gray-600">Reducciones BI:</span>
                <span className="text-right font-semibold">-{calcularTotalReducciones().toLocaleString()}€</span>

                <span className="text-gray-600">Mínimos familiares:</span>
                <span className="text-right font-semibold">{calcularTotalMinimos().toLocaleString()}€</span>

                <span className="text-gray-600">Deducciones estatales:</span>
                <span className="text-right font-semibold">-{calcularTotalDeduccionesEstatales().toLocaleString()}€</span>

                <span className="text-gray-600">Deducciones autonómicas:</span>
                <span className="text-right font-semibold">-{calcularTotalDeduccionesAutonomicas().toLocaleString()}€</span>
              </div>
            </div>

            {/* Calculate button */}
            <button
              onClick={handleCalculate}
              disabled={
                (incomeSource === 'spain' && data.rendimientosTrabajo.sueldoSalarios === 0) ||
                (incomeSource === 'gibraltar' && data.incomeGibraltar === 0) ||
                (incomeSource === 'both' && (data.rendimientosTrabajo.sueldoSalarios === 0 || data.incomeGibraltar === 0))
              }
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Calcular Declaración IRPF
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Resultado de tu Declaración</h3>
                {isPremium && onSave && (
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar Cálculos</span>
                  </button>
                )}
              </div>

              {/* Final result */}
              <div className={`p-6 rounded-xl mb-6 ${
                result.finalTax > 0
                  ? 'bg-red-50 border-2 border-red-500'
                  : 'bg-green-50 border-2 border-green-500'
              }`}>
                <h4 className="text-xl font-bold mb-2">
                  {result.finalTax > 0 ? 'A pagar' : 'A devolver'}
                </h4>
                <p className="text-4xl font-bold">
                  {result.finalTax > 0 ? '+' : ''}{result.finalTax.toLocaleString()}€
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Resultado final de la declaración
                </p>
              </div>

              {/* Detailed breakdown */}
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h4 className="text-lg font-bold mb-4">Desglose detallado</h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Ingresos brutos totales</p>
                    <p className="text-2xl font-bold">{result.grossIncome.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Base liquidable general</p>
                    <p className="text-2xl font-bold">{result.generalBase.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Cuota estatal</p>
                    <p className="text-xl font-semibold text-blue-600">{result.stateTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Cuota autonómica</p>
                    <p className="text-xl font-semibold text-blue-600">{result.regionalTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Impuesto total</p>
                    <p className="text-xl font-semibold">{result.totalTax.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tasa efectiva</p>
                    <p className="text-xl font-semibold">{result.effectiveRate}%</p>
                  </div>

                  {result.doubleTaxationRelief > 0 && (
                    <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                      <p className="text-sm text-green-700 font-semibold">Crédito por doble imposición</p>
                      <p className="text-xl font-bold text-green-700">-{result.doubleTaxationRelief.toLocaleString()}€</p>
                    </div>
                  )}

                  {result.deductions > 0 && (
                    <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                      <p className="text-sm text-blue-700 font-semibold">Deducciones aplicadas</p>
                      <p className="text-xl font-bold text-blue-700">-{result.deductions.toLocaleString()}€</p>
                    </div>
                  )}

                  <div className="bg-gray-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Retenciones practicadas</p>
                    <p className="text-xl font-semibold">-{data.retentions.toLocaleString()}€</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Ingreso neto estimado</p>
                    <p className="text-2xl font-bold text-green-600">{result.netIncome.toLocaleString()}€</p>
                  </div>
                </div>
              </div>

              {/* Double taxation explanation */}
              {result.doubleTaxationRelief > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                  <p className="text-sm text-blue-700">
                    <strong>Convenio de doble imposición:</strong> Se ha aplicado un crédito de{' '}
                    {result.doubleTaxationRelief.toLocaleString()}€ correspondiente a los impuestos pagados en Gibraltar.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
