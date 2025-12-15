'use client'

import { Bell, Calendar, CheckCircle, Plus, AlertCircle } from 'lucide-react'

export default function RemindersPage() {
  // Recordatorios predeterminados
  const defaultReminders = [
    {
      id: '1',
      title: 'Declaración Gibraltar',
      description: 'Plazo límite para presentar la declaración de impuestos en Gibraltar',
      date: new Date(new Date().getFullYear(), 10, 30), // 30 de noviembre
      type: 'GIBRALTAR_DEADLINE',
      completed: false,
    },
    {
      id: '2',
      title: 'Inicio Campaña de la Renta (España)',
      description: 'Comienza el periodo para presentar la declaración del IRPF en España',
      date: new Date(new Date().getFullYear(), 3, 3), // 3 de abril
      type: 'SPAIN_DEADLINE',
      completed: false,
    },
    {
      id: '3',
      title: 'Fin Campaña de la Renta (España)',
      description: 'Último día para presentar la declaración del IRPF en España',
      date: new Date(new Date().getFullYear(), 5, 30), // 30 de junio
      type: 'SPAIN_DEADLINE',
      completed: false,
    },
  ]

  const isUpcoming = (date: Date) => {
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 90
  }

  const getDaysUntil = (date: Date) => {
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const upcomingReminders = defaultReminders.filter(r => isUpcoming(r.date))
  const futureReminders = defaultReminders.filter(r => !isUpcoming(r.date))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recordatorios
          </h1>
          <p className="text-gray-600">
            Fechas importantes y plazos fiscales
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Funcionalidad en desarrollo
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Los recordatorios personalizados y notificaciones por email estarán disponibles próximamente.
              Por ahora puedes consultar las fechas importantes predeterminadas.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Próximos Plazos
              </h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {upcomingReminders.map((reminder) => {
              const daysUntil = getDaysUntil(reminder.date)
              const isUrgent = daysUntil <= 30

              return (
                <div
                  key={reminder.id}
                  className={`p-6 ${isUrgent ? 'bg-orange-50' : 'hover:bg-gray-50'} transition`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {reminder.title}
                        </h3>
                        {isUrgent && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            ¡Próximo!
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {reminder.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {reminder.date.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className={`font-medium ${
                          daysUntil <= 7 ? 'text-red-600' :
                          daysUntil <= 30 ? 'text-orange-600' :
                          'text-blue-600'
                        }`}>
                          {daysUntil === 0 ? '¡Hoy!' :
                           daysUntil === 1 ? 'Mañana' :
                           `En ${daysUntil} días`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All Reminders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Fechas Importantes
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {defaultReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="p-6 hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {reminder.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {reminder.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {reminder.date.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  reminder.type === 'GIBRALTAR_DEADLINE'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {reminder.type === 'GIBRALTAR_DEADLINE' ? 'Gibraltar' : 'España'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          Consejos
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Gibraltar:</strong> El año fiscal va de julio a junio. La declaración se presenta antes del 30 de noviembre.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>España:</strong> La campaña de la renta es de abril a junio del año siguiente al declarado.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              Es recomendable preparar la documentación con al menos un mes de antelación.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
