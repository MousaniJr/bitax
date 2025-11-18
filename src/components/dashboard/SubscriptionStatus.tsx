'use client'

import { useEffect, useState } from 'react'
import { Crown, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

interface SubscriptionData {
  hasPremium: boolean
  plan: string
  status: string | null
  endDate: string | null
  startDate: string | null
  canceledAt: string | null
}

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return null
  }

  const isPremium = subscription.hasPremium
  const isCanceled = subscription.status === 'CANCELED'

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPremium ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-200'}`}>
            <Crown className={`w-5 h-5 ${isPremium ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {isPremium ? 'Plan Premium' : 'Plan Gratuito'}
            </h3>
            <p className="text-sm text-gray-600">
              {isPremium ? 'Acceso completo a todas las funciones' : 'Funciones básicas'}
            </p>
          </div>
        </div>

        {isPremium && (
          <div className="flex items-center gap-2 text-sm">
            {isCanceled ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                <AlertCircle className="w-4 h-4" />
                Cancelada
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Activa
              </span>
            )}
          </div>
        )}
      </div>

      {isPremium && subscription.endDate && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4" />
          <span>
            {isCanceled ? 'Válida hasta' : 'Se renueva el'}{' '}
            {new Date(subscription.endDate).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {!isPremium ? (
          <Link
            href="/dashboard/subscription"
            className="flex-1 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
          >
            Actualizar a Premium
          </Link>
        ) : (
          <Link
            href="/dashboard/subscription"
            className="flex-1 text-center bg-white text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition border border-gray-200"
          >
            Gestionar Suscripción
          </Link>
        )}
      </div>
    </div>
  )
}
