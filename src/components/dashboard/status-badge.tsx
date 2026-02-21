import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    responded: 'tag tag-success',
    paid: 'tag tag-success',
    escalated: 'tag tag-destructive',
    processing: 'tag tag-warning',
    reminder_sent: 'tag tag-warning',
    pending: 'tag bg-muted text-muted-foreground',
    incoming: 'tag bg-muted text-muted-foreground',
  }

  const labels: Record<string, string> = {
    reminder_sent: 'Reminder sent',
    processing: 'Processing',
    responded: 'Responded',
    escalated: 'Escalated',
    pending: 'Pending',
    paid: 'Paid',
    incoming: 'Incoming',
  }

  return (
    <span className={cn(styles[status] || 'tag bg-muted text-muted-foreground', className)}>
      {labels[status] || status}
    </span>
  )
}
