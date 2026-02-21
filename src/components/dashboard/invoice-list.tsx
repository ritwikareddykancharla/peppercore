import { Bell, CheckCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './status-badge'
import type { DashboardInvoice } from '@/hooks/use-dashboard'

interface InvoiceListProps {
  invoices: DashboardInvoice[]
  onSendReminder: (id: string) => void
  onMarkPaid: (id: string) => void
}

export function InvoiceList({ invoices, onSendReminder, onMarkPaid }: InvoiceListProps) {
  return (
    <Card className="mt-6 border-border bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="font-display text-lg">Invoice Operations</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
            {invoices.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {invoices.slice(0, 5).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/50">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{invoice.customer}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.id} &middot; <span className="font-medium text-fg">${invoice.amount.toLocaleString()}</span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {invoice.daysOverdue > 0 && (
                  <Badge className="border-red-200 bg-red-50 text-red-600 hover:bg-red-50">
                    {invoice.daysOverdue}d overdue
                  </Badge>
                )}
                <StatusBadge status={invoice.status} />
                {invoice.status !== 'paid' && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      onClick={() => onSendReminder(invoice.id)}
                      title="Send reminder"
                      aria-label={`Send reminder for ${invoice.id}`}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-green-100 hover:text-green-600"
                      onClick={() => onMarkPaid(invoice.id)}
                      title="Mark as paid"
                      aria-label={`Mark ${invoice.id} as paid`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {invoices.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No invoices yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
