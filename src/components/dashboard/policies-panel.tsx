import { Plus, Settings, X, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import type { DashboardPolicy } from '@/hooks/use-dashboard'

interface PoliciesPanelProps {
  policies: DashboardPolicy[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function PoliciesPanel({ policies, onToggle, onDelete, onAdd }: PoliciesPanelProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Policies</CardTitle>
              <p className="text-xs text-muted-foreground">
                {policies.filter(p => p.active).length} active
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {policies.length === 0 ? (
          <EmptyState
            icon={<Shield className="h-8 w-8" />}
            title="No policies"
            description="Add policies to automate your operations"
          />
        ) : (
          <div className="space-y-2">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="group flex items-start gap-3 rounded-lg border border-border bg-background p-3 transition-all hover:border-primary/20"
              >
                <button
                  onClick={() => onToggle(policy.id)}
                  className={cn(
                    'mt-0.5 flex h-5 w-10 shrink-0 items-center rounded-full transition-colors relative',
                    policy.active ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'absolute h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                      policy.active ? 'translate-x-5' : 'translate-x-0.5'
                    )}
                  />
                </button>
                <p className={cn(
                  'flex-1 text-sm leading-relaxed transition-colors',
                  !policy.active && 'text-muted-foreground'
                )}>
                  {policy.rule}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(policy.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
