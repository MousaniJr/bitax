'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Filter,
  Download,
  Trash2,
  Eye,
  Calendar,
  Search,
  Plus,
} from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Declaration {
  id: string
  year: number
  type: 'GIBRALTAR' | 'SPAIN' | 'BOTH'
  status: string
  gibraltarData: any
  gibraltarResult: any
  spainData: any
  spainResult: any
  createdAt: string
  updatedAt: string
  completedAt: string | null
  notes: string | null
}

export default function HistoryPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterYear, setFilterYear] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchDeclarations()
  }, [filterYear, filterType])

  const fetchDeclarations = async () => {
    setIsLoading(true)
    try {
      let url = '/api/declarations?limit=100'
      if (filterYear) url += `&year=${filterYear}`
      if (filterType) url += `&type=${filterType}`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setDeclarations(data.declarations || [])
      } else if (res.status === 403) {
        // No tiene premium
        setDeclarations([])
      }
    } catch (error) {
      console.error('Error fetching declarations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/declarations/${deletingId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setShowDeleteModal(false)
        setDeletingId(null)
        fetchDeclarations()
      } else {
        alert('Error al eliminar declaración')
      }
    } catch (error) {
      console.error('Error deleting declaration:', error)
      alert('Error al eliminar declaración')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setDeletingId(null)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'GIBRALTAR':
        return 'Gibraltar'
      case 'SPAIN':
        return 'España'
      case 'BOTH':
        return 'España + Gibraltar'
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GIBRALTAR':
        return 'bg-blue-100 text-blue-700'
      case 'SPAIN':
        return 'bg-red-100 text-red-700'
      case 'BOTH':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Borrador'
      case 'completed':
        return 'Completada'
      case 'filed':
        return 'Presentada'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'filed':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Get unique years for filter
  const availableYears = Array.from(
    new Set(declarations.map(d => d.year))
  ).sort((a, b) => b - a)

  // Filter by search term
  const filteredDeclarations = declarations.filter(d => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      d.year.toString().includes(searchLower) ||
      getTypeLabel(d.type).toLowerCase().includes(searchLower) ||
      getStatusLabel(d.status).toLowerCase().includes(searchLower) ||
      (d.notes && d.notes.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial de Declaraciones
          </h1>
          <p className="text-gray-600">
            Todas tus declaraciones fiscales guardadas
          </p>
        </div>
        <Link
          href="/webapp"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Declaración
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por año, tipo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Year filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los años</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="GIBRALTAR">Gibraltar</option>
              <option value="SPAIN">España</option>
              <option value="BOTH">España + Gibraltar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Declarations list */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-12">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : filteredDeclarations.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {declarations.length === 0
                ? 'Aún no has creado ninguna declaración'
                : 'No se encontraron declaraciones con esos filtros'}
            </p>
            <Link
              href="/webapp"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Crear primera declaración
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDeclarations.map((declaration) => (
              <div
                key={declaration.id}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Declaración {declaration.year}
                      </h3>
                      <span className={`px-3 py-1 text-sm rounded-full ${getTypeColor(declaration.type)}`}>
                        {getTypeLabel(declaration.type)}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(declaration.status)}`}>
                        {getStatusLabel(declaration.status)}
                      </span>
                    </div>

                    {declaration.notes && (
                      <p className="text-sm text-gray-600 mb-2">
                        {declaration.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Creada:{' '}
                        {new Date(declaration.createdAt).toLocaleDateString('es-ES')}
                      </span>
                      {declaration.completedAt && (
                        <span className="flex items-center gap-1">
                          Completada:{' '}
                          {new Date(declaration.completedAt).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteClick(declaration.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredDeclarations.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-900">
            Mostrando <strong>{filteredDeclarations.length}</strong> de{' '}
            <strong>{declarations.length}</strong> declaraciones totales
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Declaración"
        message="¿Estás seguro de que quieres eliminar esta declaración? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
