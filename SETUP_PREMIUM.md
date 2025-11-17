# Guía de Configuración - Sistema Premium BiTax

Esta guía te ayudará a configurar el sistema premium de BiTax con autenticación, base de datos y suscripciones.

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta de PostgreSQL (Neon, Supabase o local)
- Cuenta de Stripe (opcional, para pagos)
- Cliente de Git

## 🚀 Instalación Paso a Paso

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/MousaniJr/bitax.git
cd bitax
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Base de datos (elige una opción)
DATABASE_URL="postgresql://user:password@localhost:5432/bitax"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-uno-con-openssl-rand-base64-32"

# Stripe (opcional para empezar)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PREMIUM_PRICE_ID="price_..."
```

### 3. Configurar Base de Datos

#### Opción A: Usar Neon (Recomendado - Gratis)

1. Ve a https://neon.tech
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la connection string
5. Pégala en tu `.env` como `DATABASE_URL`

#### Opción B: Usar Supabase (Gratis)

1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. Ve a Settings > Database
4. Copia la connection string (modo "Session")
5. Pégala en tu `.env` como `DATABASE_URL`

#### Opción C: PostgreSQL Local

```bash
# Instalar PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Crear base de datos
createdb bitax

# URL de conexión
DATABASE_URL="postgresql://tu-usuario@localhost:5432/bitax"
```

### 4. Inicializar Prisma

```bash
# Pushear el esquema a la base de datos
npx prisma db push

# Generar el cliente de Prisma
npx prisma generate

# (Opcional) Abrir Prisma Studio para ver la BD
npx prisma studio
```

### 5. Generar Secret para NextAuth

```bash
# En macOS/Linux
openssl rand -base64 32

# Copiar el resultado y pegarlo en .env como NEXTAUTH_SECRET
```

### 6. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## 💳 Configurar Stripe (Opcional)

Si quieres habilitar suscripciones de pago:

### 1. Crear cuenta en Stripe

1. Ve a https://dashboard.stripe.com/register
2. Activa el modo de prueba (test mode)

### 2. Obtener API Keys

1. Ve a Developers > API keys
2. Copia la "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copia la "Secret key" → `STRIPE_SECRET_KEY`

### 3. Crear Producto de Suscripción

1. Ve a Products > Add product
2. Nombre: "BiTax Premium"
3. Precio: 39€/año
4. Tipo: Recurring, yearly
5. Guarda y copia el Price ID → `STRIPE_PREMIUM_PRICE_ID`

### 4. Configurar Webhook (para producción)

1. Ve a Developers > Webhooks
2. Add endpoint: `https://tu-dominio.com/api/webhooks/stripe`
3. Eventos a escuchar:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copia el "Signing secret" → `STRIPE_WEBHOOK_SECRET`

## 🗄️ Esquema de Base de Datos

El esquema incluye:

### Tablas Principales

- **User**: Usuarios de la aplicación
- **Subscription**: Suscripciones premium
- **TaxDeclaration**: Declaraciones fiscales guardadas
- **Reminder**: Recordatorios de plazos
- **UserPreferences**: Preferencias del usuario

### Tablas de NextAuth

- **Account**: Cuentas de OAuth
- **Session**: Sesiones activas
- **VerificationToken**: Tokens de verificación

## 🔐 Sistema de Autenticación

### Flujo de Registro

1. Usuario se registra con email/password
2. Contraseña se hashea con bcrypt
3. Se crea User en la BD
4. Se crea sesión JWT
5. Redirección a webapp

### Flujo de Login

1. Usuario introduce email/password
2. Se verifica contra BD
3. Se genera JWT con datos de sesión
4. Se incluye información de suscripción

## 📊 Características Premium vs Gratuito

### Modo Gratuito
- ✅ Calculadoras ilimitadas
- ✅ Guías fiscales
- ✅ Datos en localStorage
- ❌ No se guardan datos entre sesiones
- ❌ Sin historial

### Modo Premium (39€/año)
- ✅ Todo del modo gratuito
- ✅ Cuenta de usuario
- ✅ Guardar declaraciones
- ✅ Historial año tras año
- ✅ Comparación entre años
- ✅ Exportar a PDF
- ✅ Recordatorios de plazos
- ✅ Soporte prioritario

## 🚀 Despliegue en Producción

### 1. Vercel (Frontend + API)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

Configurar variables de entorno en Vercel Dashboard.

### 2. Base de Datos

Neon y Supabase tienen planes gratuitos que escalan automáticamente.

### 3. Stripe

Cambia a modo "Live" y actualiza las API keys en variables de entorno.

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start

# Prisma
npm run prisma:studio     # Abrir GUI de BD
npm run prisma:push       # Push schema a BD
npm run prisma:migrate    # Crear migración

# Validación
npm run lint
npm run type-check
```

## 📝 Notas Importantes

### Seguridad

- ⚠️ **Nunca** subas `.env` a Git
- ⚠️ Usa secretos seguros en producción
- ⚠️ Habilita HTTPS en producción
- ⚠️ Configura CORS correctamente

### Performance

- La conexión a BD se reutiliza (singleton)
- JWT tokens reducen consultas a BD
- Prisma optimiza queries automáticamente

### Costos Estimados

**Hosting Gratis:**
- Vercel: Gratis (hasta 100GB bandwidth/mes)
- Neon PostgreSQL: Gratis (hasta 3GB)
- Total: **0€/mes** para empezar

**Con tráfico moderado:**
- Vercel Pro: 20$/mes (si excedes gratis)
- Neon Pro: 20$/mes (si excedes 3GB)
- Stripe: 1.5% + 0.25€ por transacción
- Total: ~40€/mes con usuarios premium

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### Error: "Database connection failed"

Verifica:
1. DATABASE_URL en `.env`
2. Base de datos está corriendo
3. Credenciales correctas

### Error: "NEXTAUTH_SECRET is not defined"

```bash
openssl rand -base64 32
# Añadir resultado a .env
```

### Error al hacer login: "CredentialsSignin"

Verifica:
1. Email y contraseña correctos
2. Usuario existe en BD
3. Contraseña hasheada correctamente

## 📚 Recursos

- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Stripe Docs**: https://stripe.com/docs
- **Neon**: https://neon.tech/docs
- **Vercel**: https://vercel.com/docs

## 💡 Próximos Pasos

Después de configurar:

1. **Probar autenticación**: Crear cuenta, login, logout
2. **Probar guardado**: Hacer una declaración y guardarla
3. **Ver en Prisma Studio**: Verificar datos guardados
4. **Configurar Stripe**: Si quieres habilitar pagos
5. **Desplegar**: Subir a producción en Vercel

## 🤝 Soporte

Si tienes problemas:

1. Revisa esta guía
2. Consulta los logs: `npm run dev`
3. Usa Prisma Studio para verificar BD
4. Abre un issue en GitHub

---

**¡Listo!** Tu sistema premium de BiTax está configurado 🎉
