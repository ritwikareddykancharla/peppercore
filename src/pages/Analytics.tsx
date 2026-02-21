import { useState } from 'react'
import { 
  TrendingUp,
  Mail, 
  DollarSign, 
  Clock, 
  CheckCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const timeRanges = ['7 days', '30 days', '90 days', '1 year']

const metrics = [
  {
    label: 'Emails Processed',
    value: '1,247',
    change: '+12.5%',
    trend: 'up',
    icon: Mail,
  },
  {
    label: 'Revenue Collected',
    value: '$24,580',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Avg Response Time',
    value: '2.4h',
    change: '-15.3%',
    trend: 'up',
    icon: Clock,
  },
  {
    label: 'Automation Rate',
    value: '94.2%',
    change: '+3.1%',
    trend: 'up',
    icon: CheckCircle,
  },
]

const emailData = [
  { day: 'Mon', processed: 45, escalated: 5 },
  { day: 'Tue', processed: 52, escalated: 3 },
  { day: 'Wed', processed: 38, escalated: 8 },
  { day: 'Thu', processed: 65, escalated: 4 },
  { day: 'Fri', processed: 48, escalated: 6 },
  { day: 'Sat', processed: 22, escalated: 2 },
  { day: 'Sun', processed: 18, escalated: 1 },
]

const classificationData = [
  { label: 'Lead Inquiry', value: 42, color: 'bg-primary' },
  { label: 'Support Request', value: 28, color: 'bg-success' },
  { label: 'Payment Related', value: 18, color: 'bg-warning' },
  { label: 'Partnership', value: 8, color: 'bg-blue-500' },
  { label: 'Other', value: 4, color: 'bg-muted' },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30 days')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground">Track your operations performance</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                timeRange === range
                  ? 'bg-background text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight
          
          return (
            <Card key={metric.label} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    metric.trend === 'up' ? 'text-success' : 'text-destructive'
                  )}>
                    <TrendIcon className="h-4 w-4" />
                    {metric.change}
                  </div>
                </div>
                <p className="text-2xl font-semibold">{metric.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Email Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {emailData.map((day) => (
                <div key={day.day} className="flex items-end gap-4">
                  <div className="w-10 text-sm text-muted-foreground">{day.day}</div>
                  <div className="flex-1 flex items-end gap-2 h-8">
                    <div 
                      className="bg-primary rounded-t h-full transition-all"
                      style={{ width: `${day.processed * 1.2}%` }}
                    />
                    <div 
                      className="bg-warning rounded-t h-full transition-all"
                      style={{ width: `${day.escalated * 4}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm">
                    <span className="font-medium">{day.processed}</span>
                    <span className="text-muted-foreground">/{day.escalated}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-sm text-muted-foreground">Processed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-warning" />
                <span className="text-sm text-muted-foreground">Escalated</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Email Classifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {classificationData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn('h-full rounded-full transition-all', item.color)}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Revenue Timeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-end justify-between h-40 gap-2">
            {[65, 45, 78, 52, 88, 95, 72, 58, 82, 68, 90, 85].map((height, i) => (
              <div 
                key={i}
                className="flex-1 bg-primary/20 hover:bg-primary/30 rounded-t transition-colors cursor-pointer"
                style={{ height: `${height}%` }}
                title={`Month ${i + 1}: $${(height * 300).toLocaleString()}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
