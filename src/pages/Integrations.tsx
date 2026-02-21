import { useState } from 'react'
import { 
  Mail, 
  CreditCard, 
  Calendar, 
  MessageSquare, 
  Database,
  X,
  ExternalLink,
  Plug,
  Settings,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const integrations = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Connect your Gmail account to automatically process incoming emails',
    icon: Mail,
    status: 'connected' as const,
    category: 'Email',
    lastSync: '2 minutes ago',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Track invoices and payments from your Stripe account',
    icon: CreditCard,
    status: 'connected' as const,
    category: 'Payments',
    lastSync: '5 minutes ago',
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Automatically schedule meetings and manage appointments',
    icon: Calendar,
    status: 'disconnected' as const,
    category: 'Scheduling',
    lastSync: null,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and manage team communication',
    icon: MessageSquare,
    status: 'disconnected' as const,
    category: 'Communication',
    lastSync: null,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync documents and manage knowledge base',
    icon: Database,
    status: 'pending' as const,
    category: 'Documentation',
    lastSync: null,
  },
]

const statusStyles = {
  connected: {
    badge: 'tag tag-success',
    text: 'Connected',
  },
  disconnected: {
    badge: 'tag bg-muted text-muted-foreground',
    text: 'Disconnected',
  },
  pending: {
    badge: 'tag tag-warning',
    text: 'Pending',
  },
}

export default function IntegrationsPage() {
  const [syncingId, setSyncingId] = useState<string | null>(null)

  const handleSync = (id: string) => {
    setSyncingId(id)
    setTimeout(() => setSyncingId(null), 2000)
  }

  const handleConnect = (id: string) => {
    console.log('Connecting:', id)
  }

  const handleDisconnect = (id: string) => {
    console.log('Disconnecting:', id)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="text-muted-foreground">Connect your tools to automate your operations</p>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon
          const status = statusStyles[integration.status]
          
          return (
            <Card key={integration.id} className="border-border bg-card hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    integration.status === 'connected' 
                      ? 'bg-primary/10' 
                      : 'bg-muted'
                  )}>
                    <Icon className={cn(
                      'h-6 w-6',
                      integration.status === 'connected' 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{integration.name}</h3>
                      <span className={status.badge}>{status.text}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="tag bg-secondary">{integration.category}</span>
                      {integration.lastSync && (
                        <span>Last synced: {integration.lastSync}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {integration.status === 'connected' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-secondary"
                          onClick={() => handleSync(integration.id)}
                          disabled={syncingId === integration.id}
                        >
                          {syncingId === integration.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-secondary"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/20 hover:bg-destructive/10"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {integration.status === 'disconnected' && (
                      <Button
                        size="sm"
                        className="btn-primary"
                        onClick={() => handleConnect(integration.id)}
                      >
                        <Plug className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                    {integration.status === 'pending' && (
                      <Button
                        size="sm"
                        className="btn-primary"
                        onClick={() => handleConnect(integration.id)}
                      >
                        Complete Setup
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-dashed border-border bg-card">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
              <Plug className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Need a custom integration?</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              We're constantly adding new integrations. Contact us if you need a specific tool connected.
            </p>
            <Button variant="outline" className="btn-secondary">
              Request Integration
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
