import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { DashboardActivity } from '@/hooks/use-dashboard'

interface ActivityFeedProps {
  activities: DashboardActivity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="font-display text-lg">Activity Feed</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[300px]">
          <div className="space-y-3 pr-3">
            {activities.map((activity) => (
              <div key={activity.id} className="rounded-lg border border-border bg-white p-3 shadow-sm transition-shadow hover:shadow">
                <p className="font-medium text-sm">{activity.description}</p>
                {activity.details && <p className="mt-1 text-xs text-muted-foreground">{activity.details}</p>}
                <p className="mt-2 text-xs text-muted/50">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                No activity yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
