# BiTax - Gestor de Impuestos España-Gibraltar

> La forma más fácil de gestionar tus impuestos entre España y Gibraltar

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Descripción

**BiTax** es una aplicación web profesional diseñada para ayudar a personas que viven en España y trabajan en Gibraltar (o viceversa) a calcular y gestionar sus declaraciones de impuestos en ambos países, aplicando correctamente el convenio de doble imposición.

### Características principales

✅ **Calculadora Gibraltar**: Compara automáticamente ABS vs GIBS y recomienda la mejor opción
✅ **Calculadora España**: Calcula el IRPF con convenio de doble imposición
✅ **Guías completas**: Instrucciones paso a paso para declarar en ambos países
✅ **Sin base de datos**: Uso gratuito con datos almacenados localmente (localStorage)
✅ **Diseño profesional**: Interfaz moderna y fácil de usar
✅ **TypeScript**: Código seguro y mantenible
✅ **Responsive**: Funciona en móvil, tablet y escritorio

## 🚀 Demo

La aplicación consta de:

- **Landing page** profesional con información sobre el servicio
- **WebApp** con 4 secciones:
  - Calculadora de Gibraltar (ABS vs GIBS)
  - Calculadora de España (IRPF)
  - Guía fiscal de Gibraltar
  - Guía fiscal de España

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 14](https://nextjs.org/) (React)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Hosting**: Optimizado para [Vercel](https://vercel.com/) (gratis)

## 📦 Instalación

### Requisitos previos

- Node.js 18+ y npm (o yarn/pnpm)
- Git

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/MousaniJr/bitax.git
cd bitax
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. **Abrir en el navegador**

Navega a [http://localhost:3000](http://localhost:3000)

## 🏗️ Estructura del Proyecto

```
bitax/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Layout principal
│   │   ├── globals.css        # Estilos globales
│   │   └── webapp/
│   │       └── page.tsx       # Página principal de la webapp
│   ├── components/
│   │   ├── calculators/
│   │   │   ├── GibraltarCalculator.tsx
│   │   │   └── SpainCalculator.tsx
│   │   └── guides/
│   │       ├── GibraltarGuide.tsx
│   │       └── SpainGuide.tsx
│   ├── lib/                    # Lógica de negocio
│   │   ├── gibraltarCalculations.ts
│   │   └── spainCalculations.ts
│   └── types/                  # Tipos TypeScript
│       └── index.ts
├── public/                     # Archivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🧮 Cómo Funciona

### Calculadora de Gibraltar

1. El usuario introduce sus datos personales y financieros
2. El sistema calcula el impuesto bajo **ABS** (Allowance Based System):
   - Aplica allowances personales, familiares y deducciones
   - Usa tasas progresivas (17% - 28%)
3. El sistema calcula el impuesto bajo **GIBS** (Gross Income Based System):
   - Aplica una tasa fija (~20%) sobre ingresos brutos
   - Mínimas deducciones
4. Compara ambos sistemas y recomienda el más beneficioso
5. Muestra el ahorro estimado

### Calculadora de España

1. El usuario introduce ingresos de España y Gibraltar
2. El sistema calcula la base imponible general
3. Aplica las escalas del IRPF (estatal + autonómica)
4. Calcula el **crédito por doble imposición**:
   - Permite deducir los impuestos pagados en Gibraltar
   - Evita pagar impuestos dos veces
5. Resta retenciones y deducciones aplicables
6. Muestra el resultado final (a pagar o a devolver)

### Almacenamiento de Datos

- **Modo gratuito**: Los datos se guardan en `localStorage` del navegador
- **Sin servidor**: No se envían datos a ningún backend
- **Privacidad total**: Los datos nunca salen del navegador del usuario
- **Futuro**: Sistema de suscripción con base de datos para guardar historial

## 🔒 Seguridad y Privacidad

- ✅ No se recopilan datos personales
- ✅ No hay tracking ni analytics de terceros
- ✅ Los cálculos se realizan en el cliente (navegador)
- ✅ Cumple con RGPD
- ✅ TypeScript garantiza seguridad de tipos

## ⚖️ Avisos Legales

**IMPORTANTE**: Esta herramienta proporciona cálculos estimados basados en la normativa vigente. Los resultados pueden no ser exactos debido a:

- Cambios frecuentes en las leyes fiscales
- Situaciones personales específicas no contempladas
- Aproximaciones en los cálculos

**Esta plataforma NO sustituye el asesoramiento profesional**. Se recomienda consultar con un asesor fiscal especializado antes de tomar decisiones basadas en estos cálculos.

## 🚀 Despliegue en Producción

### Vercel (Recomendado - Gratis)

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Vercel detectará automáticamente Next.js
4. Click en "Deploy"
5. ¡Listo! Tu app estará en línea en minutos

### Otros servicios

- **Netlify**: Similar a Vercel
- **Railway**: Para apps full-stack
- **DigitalOcean App Platform**: Para más control

### Build de producción manual

```bash
npm run build
npm run start
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Modo desarrollo (puerto 3000)
npm run build        # Build de producción
npm run start        # Ejecutar build de producción
npm run lint         # Ejecutar linter (ESLint)
npm run type-check   # Verificar tipos TypeScript
```

## 🎨 Personalización

### Colores

Edita `tailwind.config.ts` para cambiar la paleta de colores:

```typescript
theme: {
  extend: {
    colors: {
      primary: { ... },    // Azul por defecto
      secondary: { ... },  // Púrpura por defecto
    }
  }
}
```

### Cálculos Fiscales

Los cálculos se pueden ajustar en:

- `src/lib/gibraltarCalculations.ts`: Lógica de ABS y GIBS
- `src/lib/spainCalculations.ts`: Lógica del IRPF español

### Contenido de las Guías

Edita los componentes de guías para actualizar información:

- `src/components/guides/GibraltarGuide.tsx`
- `src/components/guides/SpainGuide.tsx`

## 🔮 Roadmap (Próximas Funcionalidades)

### Fase 2: Sistema de Usuarios Premium
- [ ] Autenticación con NextAuth.js
- [ ] Base de datos PostgreSQL (Supabase/Neon)
- [ ] Guardar historial de declaraciones
- [ ] Comparación año a año
- [ ] Recordatorios automáticos de plazos
- [ ] Integración con Stripe para pagos

### Fase 3: Funcionalidades Avanzadas
- [ ] Exportar resultados a PDF
- [ ] Simulaciones con diferentes escenarios
- [ ] Alertas de cambios normativos
- [ ] Chat de soporte integrado
- [ ] Versión móvil nativa (React Native)
- [ ] Integración con APIs oficiales de hacienda

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado por **MousaniJr**

- GitHub: [@MousaniJr](https://github.com/MousaniJr)

## 📧 Contacto

Para preguntas, sugerencias o colaboraciones, abre un issue en GitHub.

## 🙏 Agradecimientos

- Comunidad de Next.js
- Documentación oficial de Gibraltar Income Tax Office
- Agencia Tributaria Española
- Trabajadores fronterizos que inspiraron este proyecto

---

**Nota**: Los cálculos fiscales son aproximados y están sujetos a cambios en la legislación. Consulta siempre con un profesional.
