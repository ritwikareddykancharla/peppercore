import { Mail, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StatusBadge } from './status-badge'
import type { DashboardEmail, EmailFilter } from '@/hooks/use-dashboard'

interface EmailInboxProps {
  emails: DashboardEmail[]
  selectedEmailId: string | null
  onSelectEmail: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  emailFilter: EmailFilter
  onFilterChange: (filter: EmailFilter) => void
  loading: boolean
}

export function EmailInbox({
  emails,
  selectedEmailId,
  onSelectEmail,
  searchQuery,
  onSearchChange,
  emailFilter,
  onFilterChange,
  loading,
}: EmailInboxProps) {
  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="font-display text-lg">Inbox</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
            {emails.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sender, subject, intent"
            className="pl-9"
          />
        </div>

        <Select value={emailFilter} onValueChange={(v) => onFilterChange(v as EmailFilter)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="processing">Needs response</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
          </SelectContent>
        </Select>

        <ScrollArea className="h-[460px] pr-1">
          <div className="space-y-2">
            {emails.map((email) => (
              <button
                key={email.id}
                className={cn(
                  'w-full rounded-lg border p-3.5 text-left transition-all duration-200',
                  selectedEmailId === email.id
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                    : 'border-border bg-white hover:border-primary/30 hover:shadow-sm'
                )}
                onClick={() => onSelectEmail(email.id)}
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{email.sender}</p>
                  <StatusBadge status={email.status} />
                </div>
                <p className="truncate text-sm text-muted-foreground">{email.subject}</p>
                {email.classification && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <p className="text-xs text-primary">{email.classification}</p>
                  </div>
                )}
              </button>
            ))}
            {!loading && emails.length === 0 && (
              <div className="rounded-lg border border-dashed border-border bg-white/50 p-6 text-center">
                <p className="text-sm text-muted-foreground">No emails match current filters.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
