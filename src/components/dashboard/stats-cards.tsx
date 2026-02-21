import { Mail, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardStats } from '@/hooks/use-dashboard'

interface StatsCardsProps {
  stats: DashboardStats | null
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-white transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Emails</p>
              <p className="font-display text-4xl mt-1">{stats?.emailsPending ?? 0}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Mail className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Responded</p>
              <p className="font-display text-4xl mt-1 text-green-600">{stats?.emailsResponded ?? 0}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 transition-colors group-hover:bg-green-500/20">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue Invoices</p>
              <p className="font-display text-4xl mt-1 text-yellow-600">{stats?.invoicesOverdue ?? 0}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 transition-colors group-hover:bg-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-white transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="font-display text-4xl mt-1">${stats?.totalOutstanding?.toLocaleString() ?? 0}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
