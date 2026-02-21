import { Mail, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
    <Card className="border-border bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-xl">Triage Workspace</CardTitle>
            <CardDescription>Review intent, edit response, and resolve</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {email ? (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {email.sender.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{email.sender}</p>
                <p className="truncate text-sm text-muted-foreground">{email.senderEmail}</p>
              </div>
              <StatusBadge status={email.status} />
            </div>

            <div className="rounded-lg border border-border bg-white/80 p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Subject</p>
              <p className="font-medium">{email.subject}</p>
            </div>

            <div className="rounded-lg border border-border bg-white/80 p-4 text-sm leading-relaxed">
              {email.body}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Classification</p>
                </div>
                <p className="text-sm font-semibold text-primary">{email.classification || 'Unclassified'}</p>
              </div>
              <div className="rounded-lg border border-border bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Confidence</p>
                <div className="flex items-center gap-3">
                  <Progress value={Math.round((email.confidence || 0) * 100)} className="h-2" />
                  <span className="text-sm font-semibold shrink-0">
                    {Math.round((email.confidence || 0) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Response Draft
              </label>
              <Textarea
                value={replyDraft}
                onChange={(e) => onReplyDraftChange(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => onRespond(email.id, replyDraft)}
                disabled={email.status === 'responded' || !replyDraft.trim()}
                className="flex-1 shadow-lg shadow-primary/20"
              >
                {email.status === 'responded' ? 'Already Responded' : 'Send Response'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => onEscalate(email.id)}
                disabled={email.status === 'escalated' || email.status === 'responded'}
                className="flex-1"
              >
                Escalate
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-8 w-8 text-primary/40" />
            </div>
            <p className="text-muted-foreground">Select an email from the inbox to begin.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
