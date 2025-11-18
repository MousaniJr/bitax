import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { activatePremiumSubscription, MOCK_MODE } from '@/lib/subscription/mockStripe'

/**
 * POST /api/subscription/upgrade
 * Activa una suscripción premium (modo mock para desarrollo)
 */
export async function POST(req: Request) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Activar suscripción premium (mock)
    const result = await activatePremiumSubscription(session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al activar suscripción' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: MOCK_MODE
        ? 'Suscripción premium activada (modo prueba)'
        : 'Suscripción premium activada',
      subscription: result.subscription,
    })

  } catch (error) {
    console.error('Error in subscription upgrade:', error)
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    )
  }
}
