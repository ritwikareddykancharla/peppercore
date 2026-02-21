import { Mail, Search, Sparkles, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyState } from '@/components/ui/empty-state'
import { SkeletonList } from '@/components/ui/skeleton'
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
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Inbox</CardTitle>
              <p className="text-xs text-muted-foreground">
                {emails.length} message{emails.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sender, subject, intent..."
            className="pl-9 input-field"
          />
        </div>

        <Select value={emailFilter} onValueChange={(v) => onFilterChange(v as EmailFilter)}>
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="processing">Needs response</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
          </SelectContent>
        </Select>

        <ScrollArea className="h-[420px]">
          {loading ? (
            <SkeletonList count={4} />
          ) : emails.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-8 w-8" />}
              title="No emails found"
              description="Emails matching your search will appear here"
            />
          ) : (
            <div className="space-y-2 pr-2">
              {emails.map((email) => (
                <button
                  key={email.id}
                  className={cn(
                    'w-full rounded-lg border p-4 text-left transition-all duration-200',
                    selectedEmailId === email.id
                      ? 'border-primary bg-primary/5 shadow-soft'
                      : 'border-border bg-background hover:border-primary/30 hover:bg-muted/50'
                  )}
                  onClick={() => onSelectEmail(email.id)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium text-sm truncate">{email.sender}</p>
                    <StatusBadge status={email.status} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {email.subject}
                  </p>
                  {email.classification && (
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary font-medium">
                        {email.classification}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
