import { Badge } from '@/components/ui/badge'

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'responded':
    case 'paid':
      return (
        <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-100">
          {status}
        </Badge>
      )
    case 'escalated':
      return <Badge variant="destructive">{status}</Badge>
    case 'processing':
    case 'reminder_sent':
      return (
        <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          {status.replace('_', ' ')}
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
