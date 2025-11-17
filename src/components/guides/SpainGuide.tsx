'use client'

import { FileText, Calendar, CheckCircle, AlertTriangle, Globe } from 'lucide-react'

export default function SpainGuide() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Guía: Declaración de la Renta en España</h2>
        </div>

        <div className="prose max-w-none">
          {/* Introducción */}
          <section className="mb-8">
            <p className="text-gray-700 text-lg mb-4">
              Si trabajas en Gibraltar pero resides en España, o tienes ingresos en ambos países, debes presentar
              la declaración del IRPF en España. Esta guía te explica cómo hacerlo correctamente aplicando el
              convenio de doble imposición.
            </p>
          </section>

          {/* Plazos */}
          <section className="mb-8 bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Fechas Importantes (Campaña de la Renta)</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>1 de abril:</strong> Inicio de la campaña de la Renta (presentación online)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Mayo:</strong> Comienza la atención presencial y telefónica (fecha exacta varía)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>30 de junio:</strong> Fecha límite para presentar la declaración</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>25 de junio:</strong> Si el resultado es a ingresar con domiciliación bancaria</span>
              </li>
            </ul>
          </section>

          {/* ¿Quién está obligado? */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Estás obligado a declarar?</h3>

            <div className="bg-yellow-50 p-6 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-3">Obligados a declarar:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Rendimientos del trabajo superiores a <strong>22.000€ anuales</strong> (un pagador)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Más de <strong>14.000€</strong> con más de un pagador (si el 2º supera 1.500€)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Rendimientos de capital mobiliario o inmobiliario superiores a <strong>1.600€</strong></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ganancias patrimoniales superiores a <strong>1.000€</strong></span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Importante:</strong> Si trabajas en Gibraltar, casi siempre estás obligado a declarar</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Convenio doble imposición */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <Globe className="inline h-8 w-8 mr-2 text-blue-600" />
              Convenio de Doble Imposición España-Gibraltar
            </h3>

            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-2">¿Qué es?</h4>
              <p className="text-gray-700 mb-4">
                El convenio evita que pagues impuestos dos veces por los mismos ingresos. Los impuestos pagados
                en Gibraltar se pueden deducir de tu declaración española mediante un <strong>crédito fiscal</strong>.
              </p>

              <h4 className="font-bold text-lg mb-2 mt-4">¿Cómo funciona?</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Declaras todos tus ingresos en España (incluyendo los de Gibraltar)</li>
                <li>Calculas el impuesto español sobre el total de ingresos</li>
                <li>Restas el impuesto ya pagado en Gibraltar (crédito fiscal)</li>
                <li>Pagas la diferencia (si la hay) o recibes devolución</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                <strong>Ejemplo práctico:</strong> Si ganas 40.000€ en Gibraltar y pagas 8.000€ de impuestos allí,
                y el impuesto español sobre esa cantidad sería 10.000€, solo pagarías 2.000€ adicionales en España.
              </p>
            </div>
          </section>

          {/* Modelo 100 */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Modelo 100: Declaración de la Renta</h3>

            <p className="text-gray-700 mb-4">
              El Modelo 100 es el formulario oficial para la declaración del IRPF. Aquí te explicamos las
              secciones más relevantes para trabajadores en Gibraltar:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">1. Rendimientos del trabajo (Casillas 001-030)</h4>
                <p className="text-gray-700">
                  Incluye todos tus ingresos laborales, tanto de España como de Gibraltar. Usa el tipo de
                  cambio medio anual para convertir libras a euros.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">2. Cotizaciones y deducciones (Casillas 005-006)</h4>
                <p className="text-gray-700">
                  Incluye las cotizaciones a la Seguridad Social. Si cotizas en Gibraltar, también son deducibles.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">3. Base imponible general (Casillas 435-455)</h4>
                <p className="text-gray-700">
                  Después de aplicar reducciones por rendimientos del trabajo, gastos deducibles, etc.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">4. Cuota íntegra estatal y autonómica (Casillas 505-540)</h4>
                <p className="text-gray-700">
                  Se calculan las cuotas según las escalas progresivas de tu comunidad autónoma.
                </p>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
                <h4 className="font-bold mb-2 text-blue-900">
                  5. Deducción por doble imposición internacional (Casilla 596)
                </h4>
                <p className="text-blue-800">
                  <strong>¡MUY IMPORTANTE!</strong> Aquí es donde aplicas el crédito por impuestos pagados en Gibraltar.
                  Necesitarás un certificado del Income Tax Office de Gibraltar que acredite lo pagado allí.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">6. Cuota diferencial (Casilla 610)</h4>
                <p className="text-gray-700">
                  Resultado final: a ingresar o a devolver. Se resta las retenciones practicadas.
                </p>
              </div>
            </div>
          </section>

          {/* Documentación */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Documentación Necesaria</h3>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-3">Documentos imprescindibles:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>DNI/NIE:</strong> Documento de identidad español vigente</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Certificado de retenciones español:</strong> Si tienes ingresos en España</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Certificado de salarios de Gibraltar (P60):</strong> Emitido por tu empleador gibraltareño
                  </span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Certificado de impuestos pagados en Gibraltar:</strong> Del Income Tax Office
                    (imprescindible para aplicar la deducción por doble imposición)
                  </span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Justificantes de deducciones:</strong> Hipoteca, donativos, planes de pensiones, etc.</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Certificado de familia numerosa:</strong> Si aplica</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Datos bancarios:</strong> IBAN para domiciliación o devolución</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Pasos para declarar */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pasos para presentar tu declaración</h3>

            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
                <div>
                  <h4 className="font-bold">Obtén tu Cl@ve PIN o certificado digital</h4>
                  <p className="text-gray-600">Necesario para acceder a la web de la Agencia Tributaria</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
                <div>
                  <h4 className="font-bold">Accede a Renta WEB</h4>
                  <p className="text-gray-600">En www.agenciatributaria.es durante la campaña (abril-junio)</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
                <div>
                  <h4 className="font-bold">Revisa el borrador</h4>
                  <p className="text-gray-600">
                    La AEAT genera un borrador automático, pero <strong>NO incluirá tus ingresos de Gibraltar</strong>.
                    Debes añadirlos manualmente.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span>
                <div>
                  <h4 className="font-bold">Añade ingresos de Gibraltar</h4>
                  <p className="text-gray-600">
                    En la sección de rendimientos del trabajo, añade tus ingresos gibraltareños convertidos a euros
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">5</span>
                <div>
                  <h4 className="font-bold">Aplica la deducción por doble imposición</h4>
                  <p className="text-gray-600">
                    En la casilla 596, introduce el importe de impuestos pagados en Gibraltar (con certificado)
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">6</span>
                <div>
                  <h4 className="font-bold">Añade otras deducciones</h4>
                  <p className="text-gray-600">Vivienda (si aplica), familia numerosa, discapacidad, etc.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">7</span>
                <div>
                  <h4 className="font-bold">Revisa y presenta</h4>
                  <p className="text-gray-600">
                    Verifica todos los datos, guarda una copia y presenta antes del 30 de junio
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* Deducciones comunes */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Deducciones Comunes</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Vivienda habitual</h4>
                <p className="text-sm text-gray-700">
                  Hasta 15% de lo pagado (máx. 9.040€/año). Solo si compraste antes de 2013.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Maternidad/Paternidad</h4>
                <p className="text-sm text-gray-700">
                  Hasta 1.200€/año por hijo menor de 3 años (madres trabajadoras).
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Familia numerosa</h4>
                <p className="text-sm text-gray-700">
                  1.200€ (general) o 2.400€ (especial) por año.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Discapacidad</h4>
                <p className="text-sm text-gray-700">
                  Deducciones por el contribuyente o ascendientes/descendientes con discapacidad.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Donativos</h4>
                <p className="text-sm text-gray-700">
                  80% primeros 150€, 35-40% del resto (ONGs y fundaciones).
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Planes de pensiones</h4>
                <p className="text-sm text-gray-700">
                  Reducen la base imponible hasta 1.500€/año (o 8.500€ si &gt;50 años).
                </p>
              </div>
            </div>
          </section>

          {/* Casos especiales */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Casos Especiales: Trabajadores Fronterizos</h3>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Movilidad geográfica</h4>
                <p className="text-gray-700">
                  Si te has trasladado por trabajo, puedes tener derecho a reducciones adicionales del 20%
                  en tus rendimientos netos.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Teletrabajo mixto (España + Gibraltar)</h4>
                <p className="text-gray-700">
                  Situación compleja. La tributación depende de dónde se realice efectivamente el trabajo.
                  Consúltalo con un asesor fiscal especializado.
                </p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Cambio de residencia fiscal</h4>
                <p className="text-gray-700">
                  Si has cambiado de residencia durante el año, deberás hacer declaraciones proporcionales
                  o incluso dos declaraciones (España y Gibraltar).
                </p>
              </div>
            </div>
          </section>

          {/* Comunidades Autónomas */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Diferencias por Comunidad Autónoma</h3>

            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-3">
                Cada comunidad autónoma tiene sus propias escalas de IRPF y deducciones adicionales:
              </p>
              <ul className="space-y-2 text-sm">
                <li><strong>Andalucía:</strong> Deducciones por nacimiento/adopción, familia numerosa, discapacidad</li>
                <li><strong>Madrid:</strong> Escalas más bajas, deducciones por alquiler de vivienda habitual</li>
                <li><strong>Cataluña:</strong> Deducciones por alquiler, rehabilitación de viviendas</li>
                <li><strong>Valencia:</strong> Deducciones por nacimiento, discapacidad, dependientes</li>
              </ul>
              <p className="text-gray-600 mt-3 text-sm">
                Consulta las deducciones específicas de tu comunidad en la web de tu hacienda autonómica.
              </p>
            </div>
          </section>

          {/* Errores comunes */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Errores Comunes a Evitar</h3>

            <div className="space-y-3">
              <div className="flex items-start bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>No declarar ingresos de Gibraltar:</strong> Es obligatorio. La AEAT puede detectarlo
                  y sancionarte.
                </div>
              </div>

              <div className="flex items-start bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Olvidar aplicar la deducción por doble imposición:</strong> Estarías pagando de más.
                  Solicita siempre el certificado en Gibraltar.
                </div>
              </div>

              <div className="flex items-start bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Usar un tipo de cambio incorrecto:</strong> Debe ser el tipo de cambio medio anual
                  oficial (publicado por el Banco de España).
                </div>
              </div>

              <div className="flex items-start bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>No conservar justificantes:</strong> Guarda todos los documentos al menos 4 años
                  por si Hacienda requiere una comprobación.
                </div>
              </div>
            </div>
          </section>

          {/* Recursos */}
          <section className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Recursos Oficiales</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Agencia Tributaria:</strong> www.agenciatributaria.es</li>
              <li><strong>Teléfono información:</strong> 91 535 73 26 / 901 33 55 33</li>
              <li><strong>Cita previa:</strong> A través de la web o app de la AEAT</li>
              <li><strong>Renta WEB:</strong> Acceso a declaración online (abril-junio)</li>
              <li><strong>Calculadora IRPF:</strong> Disponible en la web de la AEAT</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
