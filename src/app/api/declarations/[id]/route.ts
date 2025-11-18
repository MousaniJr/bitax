import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { updateDeclarationSchema } from '@/lib/validations/declarations'
import { z } from 'zod'
import { hasActivePremium } from '@/lib/subscription/mockStripe'

/**
 * GET /api/declarations/[id]
 * Obtiene una declaración específica
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar suscripción premium
    const isPremium = await hasActivePremium(session.user.id)

    if (!isPremium) {
      return NextResponse.json(
        { error: 'Se requiere suscripción Premium' },
        { status: 403 }
      )
    }

    // Obtener declaración
    const declaration = await prisma.taxDeclaration.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!declaration) {
      return NextResponse.json(
        { error: 'Declaración no encontrada' },
        { status: 404 }
      )
    }

    // Verificar ownership
    if (declaration.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    return NextResponse.json(declaration)

  } catch (error) {
    console.error('Error fetching declaration:', error)
    return NextResponse.json(
      { error: 'Error al obtener declaración' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/declarations/[id]
 * Actualiza una declaración existente
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar suscripción premium
    const isPremium = await hasActivePremium(session.user.id)

    if (!isPremium) {
      return NextResponse.json(
        { error: 'Se requiere suscripción Premium' },
        { status: 403 }
      )
    }

    // Verificar que la declaración existe y pertenece al usuario
    const existing = await prisma.taxDeclaration.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Declaración no encontrada' },
        { status: 404 }
      )
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Validar datos
    const validatedData = updateDeclarationSchema.parse(body)

    // Actualizar declaración
    const updated = await prisma.taxDeclaration.update({
      where: {
        id: params.id,
      },
      data: {
        ...validatedData,
        // Si se marca como completed, guardar fecha
        completedAt: validatedData.status === 'completed'
          ? new Date()
          : existing.completedAt,
      },
    })

    return NextResponse.json(updated)

  } catch (error) {
    console.error('Error updating declaration:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar declaración' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/declarations/[id]
 * Elimina una declaración
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar suscripción premium
    const isPremium = await hasActivePremium(session.user.id)

    if (!isPremium) {
      return NextResponse.json(
        { error: 'Se requiere suscripción Premium' },
        { status: 403 }
      )
    }

    // Verificar que la declaración existe y pertenece al usuario
    const existing = await prisma.taxDeclaration.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Declaración no encontrada' },
        { status: 404 }
      )
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Eliminar declaración
    await prisma.taxDeclaration.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Declaración eliminada' })

  } catch (error) {
    console.error('Error deleting declaration:', error)
    return NextResponse.json(
      { error: 'Error al eliminar declaración' },
      { status: 500 }
    )
  }
}
