import { CheckCircle, Plus, Settings, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { DashboardPolicy } from '@/hooks/use-dashboard'

interface PoliciesPanelProps {
  policies: DashboardPolicy[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function PoliciesPanel({ policies, onToggle, onDelete, onAdd }: PoliciesPanelProps) {
  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="font-display text-lg">Policies</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            onClick={onAdd}
            aria-label="Open add policy modal"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="group flex items-start gap-3 rounded-lg border border-border bg-white p-3 shadow-sm transition-shadow hover:shadow"
            >
              <button
                onClick={() => onToggle(policy.id)}
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                  policy.active
                    ? 'border-primary bg-primary'
                    : 'border-border hover:border-primary/50'
                )}
                aria-label={`Toggle policy ${policy.rule}`}
              >
                {policy.active && <CheckCircle className="h-3 w-3 text-white" />}
              </button>
              <p className={cn('flex-1 text-sm leading-relaxed', !policy.active && 'text-muted line-through')}>
                {policy.rule}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 transition-all hover:bg-red-100 hover:text-red-500 group-hover:opacity-100"
                onClick={() => onDelete(policy.id)}
                aria-label={`Delete policy ${policy.rule}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {policies.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              No policies yet. Add one to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
