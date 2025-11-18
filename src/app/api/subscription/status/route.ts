import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSubscriptionStatus } from '@/lib/subscription/mockStripe'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

/**
 * GET /api/subscription/status
 * Obtiene el estado de la suscripción del usuario autenticado
 */
export async function GET(req: Request) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener estado de suscripción
    const status = await getSubscriptionStatus(session.user.id)

    return NextResponse.json(status)

  } catch (error) {
    console.error('Error getting subscription status:', error)
    return NextResponse.json(
      { error: 'Error al obtener estado de suscripción' },
      { status: 500 }
    )
  }
}
