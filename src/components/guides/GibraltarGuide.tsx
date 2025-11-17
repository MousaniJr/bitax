'use client'

import { FileText, Calendar, CheckCircle, AlertTriangle } from 'lucide-react'

export default function GibraltarGuide() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-600 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Guía: Declaración en Gibraltar</h2>
        </div>

        <div className="prose max-w-none">
          {/* Introducción */}
          <section className="mb-8">
            <p className="text-gray-700 text-lg mb-4">
              Gibraltar ofrece dos sistemas principales de tributación para residentes: ABS (Allowance Based System)
              y GIBS (Gross Income Based System). Esta guía te ayudará a entender ambos sistemas y completar tu declaración.
            </p>
          </section>

          {/* Plazos */}
          <section className="mb-8 bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Fechas Importantes</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>1 de julio:</strong> Inicio del año fiscal en Gibraltar</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>30 de junio:</strong> Fin del año fiscal</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>30 de noviembre:</strong> Fecha límite para presentar la declaración (Tax Return)</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Importante:</strong> Los pagos a cuenta suelen realizarse en enero y julio</span>
              </li>
            </ul>
          </section>

          {/* ABS */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sistema ABS (Allowance Based System)</h3>

            <div className="bg-green-50 p-6 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-2">¿Qué es ABS?</h4>
              <p className="text-gray-700">
                Sistema tradicional basado en allowances (deducciones personales) y tasas progresivas de impuestos.
                Similar al sistema español de IRPF.
              </p>
            </div>

            <h4 className="font-bold text-lg mb-3">Allowances principales:</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Personal Allowance:</strong> Aprox. £12,000 (cantidad estándar para todos)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Married Allowance:</strong> £3,000 adicionales si estás casado/a</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Child Allowance:</strong> £1,200 por cada hijo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Mortgage Interest Relief:</strong> Deducción de intereses hipotecarios (limitado a £25,000)</span>
              </li>
            </ul>

            <h4 className="font-bold text-lg mb-3">Tasas impositivas ABS (aproximadas):</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2">Renta imponible</th>
                    <th className="text-right py-2">Tasa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">£0 - £4,000</td>
                    <td className="text-right">17%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">£4,001 - £16,000</td>
                    <td className="text-right">20%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">£16,001 - £25,000</td>
                    <td className="text-right">21%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">£25,001 - £40,000</td>
                    <td className="text-right">23%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Más de £40,000</td>
                    <td className="text-right">28%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* GIBS */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sistema GIBS (Gross Income Based System)</h3>

            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-2">¿Qué es GIBS?</h4>
              <p className="text-gray-700">
                Sistema simplificado introducido en 2010. Aplica una tasa fija sobre los ingresos brutos,
                sin deducciones significativas. Más simple pero puede resultar en mayor tributación para
                algunas personas.
              </p>
            </div>

            <h4 className="font-bold text-lg mb-3">Características principales:</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Tasa base:</strong> 20% sobre ingresos brutos</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Sin allowances:</strong> No hay deducciones personales significativas</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Simplicidad:</strong> Cálculo muy directo y transparente</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Ajustes menores:</strong> Pequeñas reducciones por circunstancias familiares</span>
              </li>
            </ul>
          </section>

          {/* Comparación */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿ABS o GIBS? ¿Cuál elegir?</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-lg mb-3 text-green-800">ABS es mejor si:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tienes ingresos medios-bajos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Estás casado/a o tienes hijos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tienes hipoteca con intereses altos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tienes otras deducciones aplicables</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
                <h4 className="font-bold text-lg mb-3 text-blue-800">GIBS es mejor si:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tienes ingresos muy altos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Eres soltero/a sin hijos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No tienes hipoteca ni deducciones</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Prefieres simplicidad administrativa</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Documentación necesaria */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Documentación necesaria</h3>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Certificado de salarios (P60 o P45):</strong> Emitido por tu empleador</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>ID Card o pasaporte:</strong> Documento de identidad vigente</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Certificado de matrimonio:</strong> Si aplicas married allowance</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Certificados de nacimiento de hijos:</strong> Si aplicas child allowance</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Certificado de intereses hipotecarios:</strong> Del banco o entidad financiera</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Otros ingresos:</strong> Rentas, dividendos, inversiones, etc.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Pasos para declarar */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pasos para presentar tu declaración</h3>

            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
                <div>
                  <h4 className="font-bold">Recopila toda la documentación</h4>
                  <p className="text-gray-600">Asegúrate de tener todos los certificados y documentos necesarios</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
                <div>
                  <h4 className="font-bold">Decide entre ABS o GIBS</h4>
                  <p className="text-gray-600">Usa nuestra calculadora para ver cuál te conviene más</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
                <div>
                  <h4 className="font-bold">Completa el formulario Tax Return</h4>
                  <p className="text-gray-600">Disponible en el Income Tax Office o online</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span>
                <div>
                  <h4 className="font-bold">Presenta antes del 30 de noviembre</h4>
                  <p className="text-gray-600">Puedes hacerlo presencialmente, por correo o online</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">5</span>
                <div>
                  <h4 className="font-bold">Paga el impuesto resultante</h4>
                  <p className="text-gray-600">Según el calendario de pagos establecido por el Income Tax Office</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Casos especiales */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Casos Especiales</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Trabajador fronterizo (resides en España)</h4>
                <p className="text-gray-700">
                  Si trabajas en Gibraltar pero resides en España, debes declarar en ambos países.
                  Gibraltar te retendrá impuestos en origen, pero deberás incluir estos ingresos en tu
                  declaración española aplicando el convenio de doble imposición.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Teletrabajo mixto</h4>
                <p className="text-gray-700">
                  Si teletrabajes parte del tiempo desde España, la tributación puede ser compleja.
                  Consulta con un asesor fiscal especializado en estos casos.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Primer año en Gibraltar</h4>
                <p className="text-gray-700">
                  En tu primer año fiscal en Gibraltar, es posible que tengas que hacer una declaración
                  proporcional. Asegúrate de declarar correctamente la fecha de inicio de empleo.
                </p>
              </div>
            </div>
          </section>

          {/* Recursos */}
          <section className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Recursos oficiales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Income Tax Office Gibraltar:</strong> HM Customs, Watergate House, 2/8 Casemates Square
              </li>
              <li>
                <strong>Teléfono:</strong> +350 200 46600
              </li>
              <li>
                <strong>Email:</strong> itd@gibraltar.gov.gi
              </li>
              <li>
                <strong>Web:</strong> www.gibraltar.gov.gi
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
