'use client'

import { FileText, Calendar, CheckCircle, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function GibraltarGuide() {
  const t = useTranslations('Guides.Gibraltar')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-600 p-3 rounded-lg">
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
                <span dangerouslySetInnerHTML={{ __html: t.raw('dates.start') }} />
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: t.raw('dates.end') }} />
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: t.raw('dates.deadline') }} />
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: t.raw('dates.payments') }} />
              </li>
            </ul>
          </section>

          {/* ABS */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('abs.title')}</h3>

            <div className="bg-green-50 p-6 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-2">{t('abs.whatIsTitle')}</h4>
              <p className="text-gray-700">
                {t('abs.whatIsDesc')}
              </p>
            </div>

            <h4 className="font-bold text-lg mb-3">{t('abs.allowancesTitle')}</h4>
            <ul className="space-y-2 mb-4">
              {(t.raw('abs.allowances') as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-lg mb-3">{t('abs.ratesTitle')}</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2">{t('abs.table.headerIncome')}</th>
                    <th className="text-right py-2">{t('abs.table.headerRate')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">{(t.raw('abs.table.row1') as string[])[0]}</td>
                    <td className="text-right">{(t.raw('abs.table.row1') as string[])[1]}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">{(t.raw('abs.table.row2') as string[])[0]}</td>
                    <td className="text-right">{(t.raw('abs.table.row2') as string[])[1]}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">{(t.raw('abs.table.row3') as string[])[0]}</td>
                    <td className="text-right">{(t.raw('abs.table.row3') as string[])[1]}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">{(t.raw('abs.table.row4') as string[])[0]}</td>
                    <td className="text-right">{(t.raw('abs.table.row4') as string[])[1]}</td>
                  </tr>
                  <tr>
                    <td className="py-2">{(t.raw('abs.table.row5') as string[])[0]}</td>
                    <td className="text-right">{(t.raw('abs.table.row5') as string[])[1]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* GIBS */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('gibs.title')}</h3>

            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-2">{t('gibs.whatIsTitle')}</h4>
              <p className="text-gray-700">
                {t('gibs.whatIsDesc')}
              </p>
            </div>

            <h4 className="font-bold text-lg mb-3">{t('gibs.featuresTitle')}</h4>
            <ul className="space-y-2 mb-4">
              {(t.raw('gibs.features') as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </section>

          {/* Comparación */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('comparison.title')}</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-lg mb-3 text-green-800">{t('comparison.absBestTitle')}</h4>
                <ul className="space-y-2">
                  {(t.raw('comparison.absBest') as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
                <h4 className="font-bold text-lg mb-3 text-blue-800">{t('comparison.gibsBestTitle')}</h4>
                <ul className="space-y-2">
                  {(t.raw('comparison.gibsBest') as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Documentación necesaria */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('docs.title')}</h3>

            <div className="bg-yellow-50 p-6 rounded-lg">
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
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
                <div>
                  <h4 className="font-bold">{t('steps.step1Title')}</h4>
                  <p className="text-gray-600">{t('steps.step1Desc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
                <div>
                  <h4 className="font-bold">{t('steps.step2Title')}</h4>
                  <p className="text-gray-600">{t('steps.step2Desc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
                <div>
                  <h4 className="font-bold">{t('steps.step3Title')}</h4>
                  <p className="text-gray-600">{t('steps.step3Desc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span>
                <div>
                  <h4 className="font-bold">{t('steps.step4Title')}</h4>
                  <p className="text-gray-600">{t('steps.step4Desc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">5</span>
                <div>
                  <h4 className="font-bold">{t('steps.step5Title')}</h4>
                  <p className="text-gray-600">{t('steps.step5Desc')}</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Casos especiales */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('specialCases.title')}</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('specialCases.case1Title')}</h4>
                <p className="text-gray-700">
                  {t('specialCases.case1Desc')}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('specialCases.case2Title')}</h4>
                <p className="text-gray-700">
                  {t('specialCases.case2Desc')}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{t('specialCases.case3Title')}</h4>
                <p className="text-gray-700">
                  {t('specialCases.case3Desc')}
                </p>
              </div>
            </div>
          </section>

          {/* Recursos */}
          <section className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('resources.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span dangerouslySetInnerHTML={{ __html: t.raw('resources.office') }} />
              </li>
              <li>
                <span dangerouslySetInnerHTML={{ __html: t.raw('resources.phone') }} />
              </li>
              <li>
                <span dangerouslySetInnerHTML={{ __html: t.raw('resources.email') }} />
              </li>
              <li>
                <span dangerouslySetInnerHTML={{ __html: t.raw('resources.web') }} />
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
