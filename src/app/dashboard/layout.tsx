'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Bell,
  Settings,
  CreditCard,
  LogOut,
  Calculator,
  Home,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calculadoras', href: '/webapp', icon: Calculator },
  { name: 'Historial', href: '/dashboard/history', icon: FileText },
  { name: 'Comparar', href: '/dashboard/compare', icon: BarChart3 },
  { name: 'Recordatorios', href: '/dashboard/reminders', icon: Bell },
  { name: 'Suscripción', href: '/dashboard/subscription', icon: CreditCard },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                <span className="font-bold text-xl text-gray-900">BiTax</span>
              </Link>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow p-4 sticky top-24">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </li>
                  )
                })}

                <li className="pt-4 border-t border-gray-200">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Inicio</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Mobile sidebar */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}>
              <aside className="absolute left-0 top-16 bottom-0 w-64 bg-white shadow-lg p-4">
                <nav>
                  <ul className="space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </li>
                      )
                    })}

                    <li className="pt-4 border-t border-gray-200">
                      <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Inicio</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </aside>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
