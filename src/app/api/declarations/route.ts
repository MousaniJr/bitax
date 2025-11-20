import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createDeclarationSchema } from '@/lib/validations/declarations'
import { z } from 'zod'
import { hasActivePremium } from '@/lib/subscription/mockStripe'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

/**
 * POST /api/declarations
 * Crea una nueva declaración fiscal
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

    // Verificar suscripción premium
    const isPremium = await hasActivePremium(session.user.id)

    if (!isPremium) {
      return NextResponse.json(
        { error: 'Se requiere suscripción Premium para guardar cálculos' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Validar datos
    const validatedData = createDeclarationSchema.parse(body)

    // Verificar si ya existe una declaración para este año y tipo
    const existing = await prisma.taxDeclaration.findFirst({
      where: {
        userId: session.user.id,
        year: validatedData.year,
        type: validatedData.type,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una declaración para este año y tipo' },
        { status: 400 }
      )
    }

    // Crear declaración
    const declaration = await prisma.taxDeclaration.create({
      data: {
        userId: session.user.id,
        year: validatedData.year,
        type: validatedData.type,
        status: validatedData.status || 'draft',
        gibraltarData: validatedData.gibraltarData || null,
        gibraltarResult: validatedData.gibraltarResult || null,
        spainData: validatedData.spainData || null,
        spainResult: validatedData.spainResult || null,
        notes: validatedData.notes,
      },
    })

    return NextResponse.json(declaration, { status: 201 })

  } catch (error) {
    console.error('Error creating declaration:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear declaración' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/declarations
 * Lista las declaraciones del usuario autenticado
 * Query params: year, type, limit, offset
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

    // Verificar suscripción premium
    const isPremium = await hasActivePremium(session.user.id)

    if (!isPremium) {
      return NextResponse.json(
        { error: 'Se requiere suscripción Premium para acceder al historial' },
        { status: 403 }
      )
    }

    // Parsear query params
    const { searchParams } = new URL(req.url)
    const year = searchParams.get('year')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construir filtros
    const where: any = {
      userId: session.user.id,
    }

    if (year) {
      where.year = parseInt(year)
    }

    if (type) {
      where.type = type
    }

    // Obtener declaraciones
    const [declarations, total] = await Promise.all([
      prisma.taxDeclaration.findMany({
        where,
        orderBy: [
          { year: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.taxDeclaration.count({ where }),
    ])

    return NextResponse.json({
      declarations,
      total,
      limit,
      offset,
    })

  } catch (error) {
    console.error('Error fetching declarations:', error)
    return NextResponse.json(
      { error: 'Error al obtener declaraciones' },
      { status: 500 }
    )
  }
}
