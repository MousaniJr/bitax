'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  AlertTriangle,
  Sparkles,
  Check,
} from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface SubscriptionData {
  hasPremium: boolean
  plan: string
  status: string | null
  endDate: string | null
  startDate: string | null
  canceledAt: string | null
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscription/status')
      if (res.ok) {
        const data = await res.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const res = await fetch('/api/subscription/upgrade', {
        method: 'POST',
      })

      if (res.ok) {
        await fetchSubscription()
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al activar Premium')
      }
    } catch (error) {
      console.error('Error upgrading:', error)
      alert('Error al activar Premium')
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleCancelClick = () => {
    setShowCancelModal(true)
  }

  const handleCancelConfirm = async () => {
    setIsCanceling(true)
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
      })

      if (res.ok) {
        setShowCancelModal(false)
        await fetchSubscription()
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al cancelar suscripción')
      }
    } catch (error) {
      console.error('Error canceling:', error)
      alert('Error al cancelar suscripción')
    } finally {
      setIsCanceling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isPremium = subscription?.hasPremium
  const isCanceled = subscription?.status === 'CANCELED'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Suscripción
        </h1>
        <p className="text-gray-600">
          Gestiona tu plan de BiTax
        </p>
      </div>

      {/* Mock mode notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">
              Modo de Prueba Activado
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Este es un simulador de suscripciones para desarrollo. No se realizarán cargos reales.
              Puedes activar y desactivar Premium libremente para probar las funcionalidades.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <div className="lg:col-span-2">
          <div className={`bg-gradient-to-br ${isPremium ? 'from-yellow-50 to-orange-50' : 'from-gray-50 to-gray-100'} rounded-lg shadow-lg p-8 border-2 ${isPremium ? 'border-yellow-300' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${isPremium ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-300'}`}>
                  <Crown className={`w-8 h-8 ${isPremium ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isPremium ? 'Plan Premium' : 'Plan Gratuito'}
                  </h2>
                  <p className="text-gray-600">
                    {isPremium ? '39€ / año' : 'Gratis para siempre'}
                  </p>
                </div>
              </div>

              {isPremium && (
                <div className="flex flex-col items-end gap-2">
                  {isCanceled ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      Cancelada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Activa
                    </span>
                  )}
                </div>
              )}
            </div>

            {isPremium && subscription.endDate && (
              <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>
                    {isCanceled ? (
                      <>
                        Tu plan Premium estará activo hasta el{' '}
                        <strong>
                          {new Date(subscription.endDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </strong>
                      </>
                    ) : (
                      <>
                        Tu suscripción se renovará el{' '}
                        <strong>
                          {new Date(subscription.endDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </strong>
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!isPremium ? (
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpgrading ? (
                    'Activando Premium...'
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 inline mr-2" />
                      Activar Premium (Mock)
                    </>
                  )}
                </button>
              ) : (
                !isCanceled && (
                  <button
                    onClick={handleCancelClick}
                    disabled={isCanceling}
                    className="flex-1 bg-white text-red-600 py-3 px-6 rounded-lg font-semibold hover:bg-red-50 transition border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCanceling ? 'Cancelando...' : 'Cancelar Suscripción'}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Funcionalidades Premium
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Guardar declaraciones ilimitadas</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Historial año tras año</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Comparación entre años</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Exportar a PDF</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Recordatorios de plazos</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Inputs avanzados en calculadoras</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Soporte prioritario</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Billing History (mock) */}
      {isPremium && subscription.startDate && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Historial de Facturación
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Suscripción Premium Anual
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(subscription.startDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">39,00€</p>
                <p className="text-sm text-green-600">Pagado (Mock)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        title="Cancelar Suscripción"
        message="¿Estás seguro de que quieres cancelar tu suscripción Premium? Seguirás teniendo acceso hasta el final de tu período de facturación actual."
        confirmText="Sí, cancelar"
        cancelText="No, mantener"
        variant="danger"
        isLoading={isCanceling}
      />
    </div>
  )
}
