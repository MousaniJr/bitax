'use client'

import { LucideIcon } from 'lucide-react'

interface StatsWidgetProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export default function StatsWidget({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
}: StatsWidgetProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <p className={`text-sm font-medium mt-2 ${trendColors[trend]}`}>
              {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
