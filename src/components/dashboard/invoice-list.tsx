import { Bell, CheckCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from './status-badge'
import type { DashboardInvoice } from '@/hooks/use-dashboard'

interface InvoiceListProps {
  invoices: DashboardInvoice[]
  onSendReminder: (id: string) => void
  onMarkPaid: (id: string) => void
}

export function InvoiceList({ invoices, onSendReminder, onMarkPaid }: InvoiceListProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Invoice Operations</CardTitle>
              <p className="text-xs text-muted-foreground">
                {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {invoices.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No invoices"
            description="Invoices will appear here when created"
          />
        ) : (
          <div className="divide-y divide-border">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/20 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Invoice ID</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            {invoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-muted/20 transition-colors"
              >
                <div className="col-span-3 min-w-0">
                  <p className="font-medium text-sm truncate">{invoice.customer}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground font-mono text-xs">{invoice.id}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="font-semibold text-sm">${invoice.amount.toLocaleString()}</p>
                  {invoice.daysOverdue > 0 && (
                    <p className="text-xs text-destructive">{invoice.daysOverdue}d overdue</p>
                  )}
                </div>
                <div className="col-span-2 flex justify-center">
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="col-span-3 flex justify-end gap-1">
                  {invoice.status !== 'paid' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => onSendReminder(invoice.id)}
                        title="Send reminder"
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-success hover:bg-success/10"
                        onClick={() => onMarkPaid(invoice.id)}
                        title="Mark as paid"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
