import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cancelSubscription } from '@/lib/subscription/mockStripe'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

/**
 * POST /api/subscription/cancel
 * Cancela una suscripción premium
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

    // Cancelar suscripción
    const result = await cancelSubscription(session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al cancelar suscripción' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Suscripción cancelada correctamente',
      subscription: result.subscription,
    })

  } catch (error) {
    console.error('Error in subscription cancel:', error)
    return NextResponse.json(
      { error: 'Error al cancelar la suscripción' },
      { status: 500 }
    )
  }
}
