import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/prisma'

/**
 * Schema de validación para registro de usuarios
 */
const signupSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

/**
 * POST /api/auth/signup
 * Registra un nuevo usuario en el sistema
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validar datos
    const validatedData = signupSchema.parse(body)

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await hash(validatedData.password, 12)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    })

    // Crear suscripción gratuita por defecto
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'free',
        status: 'ACTIVE',
      },
    })

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: 'Usuario creado exitosamente',
        user: userWithoutPassword,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en signup:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    )
  }
}
