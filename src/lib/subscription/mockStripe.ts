/**
 * Mock de Stripe para desarrollo y testing
 *
 * Este módulo simula las funcionalidades de Stripe sin requerir pagos reales.
 * Para cambiar a Stripe real, simplemente cambia MOCK_MODE a false y configura
 * las variables de entorno de Stripe.
 */

import prisma from '@/lib/prisma'
import { SubscriptionStatus } from '@prisma/client'

// Cambiar a false para usar Stripe real
export const MOCK_MODE = true

/**
 * Simula la creación de una sesión de checkout de Stripe
 */
export async function createCheckoutSession(userId: string) {
  if (!MOCK_MODE) {
    // Aquí iría la lógica real de Stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const session = await stripe.checkout.sessions.create(...)
    throw new Error('Stripe real no configurado. Usar MOCK_MODE = true')
  }

  // Mock: Simular sesión de checkout
  const mockSessionId = `mock_session_${Date.now()}`
  const mockUrl = `/dashboard/subscription?upgrade=success&session_id=${mockSessionId}`

  return {
    id: mockSessionId,
    url: mockUrl,
    success: true,
  }
}

/**
 * Simula la activación de una suscripción premium
 */
export async function activatePremiumSubscription(userId: string) {
  try {
    // Verificar si ya tiene suscripción
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    const now = new Date()
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    if (existingSubscription) {
      // Actualizar suscripción existente
      const updated = await prisma.subscription.update({
        where: { userId },
        data: {
          plan: 'premium',
          status: 'ACTIVE',
          stripeCustomerId: MOCK_MODE ? `mock_cus_${userId.slice(0, 8)}` : null,
          stripeSubscriptionId: MOCK_MODE ? `mock_sub_${Date.now()}` : null,
          stripePriceId: MOCK_MODE ? 'price_mock_premium_39eur' : null,
          stripeCurrentPeriodEnd: oneYearFromNow,
          startDate: now,
          endDate: oneYearFromNow,
          canceledAt: null,
        },
      })

      return {
        success: true,
        subscription: updated,
      }
    } else {
      // Crear nueva suscripción
      const subscription = await prisma.subscription.create({
        data: {
          userId,
          plan: 'premium',
          status: 'ACTIVE',
          stripeCustomerId: MOCK_MODE ? `mock_cus_${userId.slice(0, 8)}` : null,
          stripeSubscriptionId: MOCK_MODE ? `mock_sub_${Date.now()}` : null,
          stripePriceId: MOCK_MODE ? 'price_mock_premium_39eur' : null,
          stripeCurrentPeriodEnd: oneYearFromNow,
          startDate: now,
          endDate: oneYearFromNow,
        },
      })

      return {
        success: true,
        subscription,
      }
    }
  } catch (error) {
    console.error('Error activating subscription:', error)
    return {
      success: false,
      error: 'Error al activar suscripción',
    }
  }
}

/**
 * Simula la cancelación de una suscripción
 */
export async function cancelSubscription(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (!subscription) {
      return {
        success: false,
        error: 'No se encontró suscripción',
      }
    }

    const updated = await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    })

    return {
      success: true,
      subscription: updated,
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return {
      success: false,
      error: 'Error al cancelar suscripción',
    }
  }
}

/**
 * Obtiene el estado de la suscripción de un usuario
 */
export async function getSubscriptionStatus(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (!subscription) {
      return {
        hasPremium: false,
        plan: 'free',
        status: null,
        endDate: null,
      }
    }

    return {
      hasPremium: subscription.plan === 'premium' && subscription.status === 'ACTIVE',
      plan: subscription.plan,
      status: subscription.status,
      endDate: subscription.endDate,
      startDate: subscription.startDate,
      canceledAt: subscription.canceledAt,
    }
  } catch (error) {
    console.error('Error getting subscription:', error)
    return {
      hasPremium: false,
      plan: 'free',
      status: null,
      endDate: null,
    }
  }
}

/**
 * Simula la creación de un portal de cliente de Stripe
 */
export async function createCustomerPortalSession(userId: string) {
  if (!MOCK_MODE) {
    // Aquí iría la lógica real de Stripe
    throw new Error('Stripe real no configurado. Usar MOCK_MODE = true')
  }

  // Mock: Redirigir a página de gestión de suscripción
  return {
    url: '/dashboard/subscription',
    success: true,
  }
}

/**
 * Verifica si un usuario tiene acceso premium
 */
export async function hasActivePremium(userId: string): Promise<boolean> {
  const status = await getSubscriptionStatus(userId)
  return status.hasPremium
}
