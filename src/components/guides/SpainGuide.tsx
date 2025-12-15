'use client'

import { FileText, Calendar, CheckCircle, AlertTriangle, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function SpainGuide() {
  const t = useTranslations('Guides.Spain')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
        </div>

        <div className="prose max-w-none">
          {/* Introducción */}
          <section className="mb-8">
            <p className="text-gray-700 text-lg mb-4">
              {t('intro')}
            </p>
          </section>

          {/* Plazos */}
          <section className="mb-8 bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">{t('dates.title')}</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: t.raw('dates.april') }} />
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: t.raw('dates.may') }} />
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: t.raw('dates.june30') }} />
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: t.raw('dates.june25') }} />
              </li>
            </ul>
          </section>

          {/* ¿Quién está obligado? */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('obliged.title')}</h3>

            <div className="bg-yellow-50 p-6 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-3">{t('obliged.subtitle')}</h4>
              <ul className="space-y-2">
                {(t.raw('obliged.list') as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    {idx === 4 ? (
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Convenio doble imposición */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <Globe className="inline h-8 w-8 mr-2 text-blue-600" />
              {t('dta.title')}
            </h3>

            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-2">{t('dta.whatIsTitle')}</h4>
              <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: t.raw('dta.whatIsDesc') }} />

              <h4 className="font-bold text-lg mb-2 mt-4">{t('dta.howTitle')}</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {(t.raw('dta.steps') as string[]).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800" dangerouslySetInnerHTML={{ __html: t.raw('dta.example') }} />
            </div>
          </section>

          {/* Modelo 100 */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('model100.title')}</h3>

            <p className="text-gray-700 mb-4">{t('model100.intro')}</p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('model100.sec1Title')}</h4>
                <p className="text-gray-700">{t('model100.sec1Desc')}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('model100.sec2Title')}</h4>
                <p className="text-gray-700">{t('model100.sec2Desc')}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('model100.sec3Title')}</h4>
                <p className="text-gray-700">{t('model100.sec3Desc')}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('model100.sec4Title')}</h4>
                <p className="text-gray-700">{t('model100.sec4Desc')}</p>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
                <h4 className="font-bold mb-2 text-blue-900">{t('model100.sec5Title')}</h4>
                <p className="text-blue-800" dangerouslySetInnerHTML={{ __html: t.raw('model100.sec5Desc') }} />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('model100.sec6Title')}</h4>
                <p className="text-gray-700">{t('model100.sec6Desc')}</p>
              </div>
            </div>
          </section>

          {/* Documentación */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('docs.title')}</h3>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-3">{t('docs.subtitle')}</h4>
              <ul className="space-y-2">
                {(t.raw('docs.list') as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Pasos para declarar */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('steps.title')}</h3>

            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
                <div>
                  <h4 className="font-bold">{t('steps.s1t')}</h4>
                  <p className="text-gray-600">{t('steps.s1d')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
                <div>
                  <h4 className="font-bold">{t('steps.s2t')}</h4>
                  <p className="text-gray-600">{t('steps.s2d')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
                <div>
                  <h4 className="font-bold">{t('steps.s3t')}</h4>
                  <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: t.raw('steps.s3d') }} />
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span>
                <div>
                  <h4 className="font-bold">{t('steps.s4t')}</h4>
                  <p className="text-gray-600">{t('steps.s4d')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">5</span>
                <div>
                  <h4 className="font-bold">{t('steps.s5t')}</h4>
                  <p className="text-gray-600">{t('steps.s5d')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">6</span>
                <div>
                  <h4 className="font-bold">{t('steps.s6t')}</h4>
                  <p className="text-gray-600">{t('steps.s6d')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">7</span>
                <div>
                  <h4 className="font-bold">{t('steps.s7t')}</h4>
                  <p className="text-gray-600">{t('steps.s7d')}</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Deducciones comunes */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('deductions.title')}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('deductions.housingTitle')}</h4>
                <p className="text-sm text-gray-700">{t('deductions.housingDesc')}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('deductions.maternityTitle')}</h4>
                <p className="text-sm text-gray-700">{t('deductions.maternityDesc')}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('deductions.familyTitle')}</h4>
                <p className="text-sm text-gray-700">{t('deductions.familyDesc')}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('deductions.disabilityTitle')}</h4>
                <p className="text-sm text-gray-700">{t('deductions.disabilityDesc')}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('deductions.donationsTitle')}</h4>
                <p className="text-sm text-gray-700">{t('deductions.donationsDesc')}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('deductions.pensionsTitle')}</h4>
                <p className="text-sm text-gray-700">{t('deductions.pensionsDesc')}</p>
              </div>
            </div>
          </section>

          {/* Casos especiales */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('specialCases.title')}</h3>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('specialCases.geoTitle')}</h4>
                <p className="text-gray-700">{t('specialCases.geoDesc')}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('specialCases.teleworkTitle')}</h4>
                <p className="text-gray-700">{t('specialCases.teleworkDesc')}</p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('specialCases.residencyTitle')}</h4>
                <p className="text-gray-700">{t('specialCases.residencyDesc')}</p>
              </div>
            </div>
          </section>

          {/* Comunidades Autónomas */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('regions.title')}</h3>

            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-3">{t('regions.desc')}</p>
              <ul className="space-y-2 text-sm">
                {(t.raw('regions.list') as string[]).map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
              <p className="text-gray-600 mt-3 text-sm">{t('regions.note')}</p>
            </div>
          </section>

          {/* Errores comunes */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('errors.title')}</h3>

            <div className="space-y-3">
              <div className="flex items-start bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div dangerouslySetInnerHTML={{ __html: t.raw('errors.e1') }} />
              </div>

              <div className="flex items-start bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div dangerouslySetInnerHTML={{ __html: t.raw('errors.e2') }} />
              </div>

              <div className="flex items-start bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div dangerouslySetInnerHTML={{ __html: t.raw('errors.e3') }} />
              </div>

              <div className="flex items-start bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div dangerouslySetInnerHTML={{ __html: t.raw('errors.e4') }} />
              </div>
            </div>
          </section>

          {/* Recursos */}
          <section className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('resources.title')}</h3>
            <ul className="space-y-2 text-sm">
              {(t.raw('resources.items') as string[]).map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
