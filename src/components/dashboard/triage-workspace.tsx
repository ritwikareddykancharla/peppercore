import { Mail, Sparkles, Send, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from './status-badge'
import type { DashboardEmail } from '@/hooks/use-dashboard'

interface TriageWorkspaceProps {
  email: DashboardEmail | null
  replyDraft: string
  onReplyDraftChange: (draft: string) => void
  onRespond: (id: string, response?: string) => void
  onEscalate: (id: string) => void
}

export function TriageWorkspace({
  email,
  replyDraft,
  onReplyDraftChange,
  onRespond,
  onEscalate,
}: TriageWorkspaceProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Triage Workspace</CardTitle>
            <p className="text-xs text-muted-foreground">Review intent, edit response, and resolve</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {email ? (
          <div className="divide-y divide-border">
            <div className="p-4 bg-muted/20">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {email.sender.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{email.sender}</p>
                    <StatusBadge status={email.status} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{email.senderEmail}</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="code-window">
                <div className="code-window-header">
                  <div className="code-window-dot bg-red-400" />
                  <div className="code-window-dot bg-yellow-400" />
                  <div className="code-window-dot bg-green-400" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">subject.email</span>
                </div>
                <div className="code-window-content">
                  <p className="font-medium">{email.subject}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30 text-sm leading-relaxed">
                {email.body}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Classification
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {email.classification || 'Unclassified'}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-background">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Confidence
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={Math.round((email.confidence || 0) * 100)} className="h-2 flex-1" />
                    <span className="text-sm font-semibold">
                      {Math.round((email.confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="code-window">
                <div className="code-window-header">
                  <span className="text-xs text-muted-foreground font-mono">response_draft.txt</span>
                </div>
                <div className="p-3">
                  <Textarea
                    value={replyDraft}
                    onChange={(e) => onReplyDraftChange(e.target.value)}
                    rows={5}
                    className="resize-none border-0 bg-transparent p-0 focus-visible:ring-0 text-sm"
                    placeholder="Type your response..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => onRespond(email.id, replyDraft)}
                  disabled={email.status === 'responded' || !replyDraft.trim()}
                  className="btn-primary flex-1 gap-2"
                >
                  <Send className="h-4 w-4" />
                  {email.status === 'responded' ? 'Sent' : 'Send Response'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEscalate(email.id)}
                  disabled={email.status === 'escalated' || email.status === 'responded'}
                  className="flex-1 gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Escalate
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Mail className="h-8 w-8" />}
            title="Select an email"
            description="Choose an email from the inbox to view details and respond"
          />
        )}
      </CardContent>
    </Card>
  )
}
