import { Mail, CheckCircle, AlertTriangle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DashboardStats } from '@/hooks/use-dashboard'

interface StatsCardsProps {
  stats: DashboardStats | null
}

export function StatsCards({ stats }: StatsCardsProps) {
  const metrics = [
    {
      label: 'Pending Emails',
      value: stats?.emailsPending ?? 0,
      icon: Mail,
      trend: 'up' as const,
      trendValue: '+12%',
      color: 'primary' as const,
    },
    {
      label: 'Responded',
      value: stats?.emailsResponded ?? 0,
      icon: CheckCircle,
      trend: 'up' as const,
      trendValue: '+8%',
      color: 'success' as const,
    },
    {
      label: 'Overdue Invoices',
      value: stats?.invoicesOverdue ?? 0,
      icon: AlertTriangle,
      trend: 'down' as const,
      trendValue: '-3%',
      color: 'warning' as const,
    },
    {
      label: 'Outstanding',
      value: `$${(stats?.totalOutstanding ?? 0).toLocaleString()}`,
      icon: DollarSign,
      trend: 'up' as const,
      trendValue: '+5%',
      color: 'primary' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <div
            key={metric.label}
            className="metric-card group"
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                  metric.color === 'primary' && 'bg-primary/10 text-primary',
                  metric.color === 'success' && 'bg-success/10 text-success',
                  metric.color === 'warning' && 'bg-warning/10 text-amber-600',
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  metric.trend === 'up' ? 'text-success' : 'text-destructive'
                )}>
                  <TrendIcon className="h-3.5 w-3.5" />
                  {metric.trendValue}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="number-display">{metric.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
