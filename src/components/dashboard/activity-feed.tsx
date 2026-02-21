import { Clock, CheckCircle, Mail, AlertTriangle, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'
import type { DashboardActivity } from '@/hooks/use-dashboard'

const iconMap: Record<string, React.ReactNode> = {
  'lead_responded': <CheckCircle className="h-4 w-4" />,
  'email_sent': <Mail className="h-4 w-4" />,
  'reminder_sent': <Bell className="h-4 w-4" />,
  'escalated': <AlertTriangle className="h-4 w-4" />,
}

const colorMap: Record<string, string> = {
  'lead_responded': 'bg-success/10 text-success',
  'email_sent': 'bg-primary/10 text-primary',
  'reminder_sent': 'bg-warning/10 text-amber-600',
  'escalated': 'bg-destructive/10 text-destructive',
}

interface ActivityFeedProps {
  activities: DashboardActivity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Activity Feed</CardTitle>
            <p className="text-xs text-muted-foreground">Recent events</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {activities.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={<Clock className="h-8 w-8" />}
                title="No activity"
                description="Activity will appear here as events occur"
              />
            </div>
          ) : (
            <div className="relative px-4 py-2">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {activities.map((activity) => {
                  const icon = iconMap[activity.type] || <Clock className="h-4 w-4" />
                  const colorClass = colorMap[activity.type] || 'bg-muted text-muted-foreground'
                  
                  return (
                    <div key={activity.id} className="relative flex gap-3 pl-1">
                      <div className={cn(
                        'relative z-10 flex h-6 w-6 items-center justify-center rounded-full',
                        colorClass
                      )}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0 pb-4">
                        <p className="text-sm font-medium">{activity.description}</p>
                        {activity.details && (
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.details}</p>
                        )}
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
