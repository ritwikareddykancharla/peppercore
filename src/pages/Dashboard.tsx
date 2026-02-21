import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Plus,
  Search,
  Settings,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Email {
  id: string
  sender: string
  senderEmail: string
  subject: string
  body: string
  status: 'incoming' | 'processing' | 'responded' | 'escalated'
  classification?: string
  confidence?: number
  suggestedResponse?: string
  sentResponse?: string
  timestamp: string
}

interface Invoice {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'reminder_sent' | 'paid' | 'escalated'
  daysOverdue: number
  reminderCount: number
}

interface Activity {
  id: string
  type: string
  description: string
  details?: string
  timestamp: string
}

interface Policy {
  id: string
  rule: string
  active: boolean
}

interface Stats {
  emailsPending: number
  emailsResponded: number
  emailsEscalated: number
  invoicesPending: number
  invoicesOverdue: number
  totalOutstanding: number
  policiesActive: number
  activitiesToday: number
}

type EmailFilter = 'all' | 'processing' | 'escalated' | 'responded'

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'responded':
    case 'paid':
      return (
        <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-100">
          {status}
        </Badge>
      )
    case 'escalated':
      return <Badge variant="destructive">{status}</Badge>
    case 'processing':
    case 'reminder_sent':
      return (
        <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          {status.replace('_', ' ')}
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function Dashboard() {
  const [emails, setEmails] = useState<Email[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [emailFilter, setEmailFilter] = useState<EmailFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [newPolicy, setNewPolicy] = useState('')
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [newEmailSender, setNewEmailSender] = useState('')
  const [newEmailSenderEmail, setNewEmailSenderEmail] = useState('')
  const [newEmailSubject, setNewEmailSubject] = useState('')
  const [newEmailBody, setNewEmailBody] = useState('')
  const [requestError, setRequestError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const selectedEmail = useMemo(
    () => emails.find((email) => email.id === selectedEmailId) ?? null,
    [emails, selectedEmailId]
  )

  const filteredEmails = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return emails.filter((email) => {
      const statusMatch = emailFilter === 'all' || email.status === emailFilter
      if (!statusMatch) return false

      if (!query) return true
      const haystack = [email.sender, email.subject, email.body, email.classification]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [emails, emailFilter, searchQuery])

  useEffect(() => {
    if (!selectedEmail && filteredEmails.length > 0) {
      setSelectedEmailId(filteredEmails[0].id)
    }
  }, [filteredEmails, selectedEmail])

  useEffect(() => {
    if (!selectedEmail) {
      setReplyDraft('')
      return
    }

    if (selectedEmail.status === 'responded') {
      setReplyDraft(selectedEmail.sentResponse ?? '')
    } else {
      setReplyDraft(selectedEmail.suggestedResponse ?? '')
    }
  }, [selectedEmailId, selectedEmail?.status, selectedEmail?.suggestedResponse, selectedEmail?.sentResponse])

  const fetchData = async () => {
    try {
      setRequestError(null)
      const [emailsRes, invoicesRes, activitiesRes, policiesRes, statsRes] = await Promise.all([
        fetch('/api/emails'),
        fetch('/api/invoices'),
        fetch('/api/activities?limit=10'),
        fetch('/api/policies'),
        fetch('/api/stats'),
      ])

      if (!emailsRes.ok || !invoicesRes.ok || !activitiesRes.ok || !policiesRes.ok || !statsRes.ok) {
        throw new Error('One or more requests failed')
      }

      const nextEmails: Email[] = await emailsRes.json()
      setEmails(nextEmails)
      setInvoices(await invoicesRes.json())
      setActivities(await activitiesRes.json())
      setPolicies(await policiesRes.json())
      setStats(await statsRes.json())

      if (!selectedEmailId && nextEmails.length > 0) {
        setSelectedEmailId(nextEmails[0].id)
      }

      if (selectedEmailId && !nextEmails.some((email) => email.id === selectedEmailId)) {
        setSelectedEmailId(nextEmails[0]?.id ?? null)
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setRequestError('Unable to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const respondToEmail = async (id: string, responseText?: string) => {
    const payload = responseText?.trim() ? { response: responseText.trim() } : undefined
    await fetch(`/api/emails/${id}/respond`, {
      method: 'POST',
      headers: payload ? { 'Content-Type': 'application/json' } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    })
    fetchData()
  }

  const escalateEmail = async (id: string) => {
    await fetch(`/api/emails/${id}/escalate`, { method: 'POST' })
    fetchData()
  }

  const sendReminder = async (id: string) => {
    await fetch(`/api/invoices/${id}/remind`, { method: 'POST' })
    fetchData()
  }

  const markPaid = async (id: string) => {
    await fetch(`/api/invoices/${id}/mark-paid`, { method: 'POST' })
    fetchData()
  }

  const addPolicy = async () => {
    if (!newPolicy.trim()) return
    await fetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rule: newPolicy }),
    })
    setNewPolicy('')
    setShowPolicyModal(false)
    fetchData()
  }

  const togglePolicy = async (id: string) => {
    await fetch(`/api/policies/${id}/toggle`, { method: 'POST' })
    fetchData()
  }

  const deletePolicy = async (id: string) => {
    await fetch(`/api/policies/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const submitNewEmail = async () => {
    const payload = {
      sender: newEmailSender.trim(),
      senderEmail: newEmailSenderEmail.trim(),
      subject: newEmailSubject.trim(),
      body: newEmailBody.trim(),
    }

    if (!payload.sender || !payload.senderEmail || !payload.subject || !payload.body) {
      setRequestError('Fill in all email fields before submitting.')
      return
    }

    try {
      setRequestError(null)
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        setRequestError('Unable to create incoming email.')
        return
      }

      setNewEmailSender('')
      setNewEmailSenderEmail('')
      setNewEmailSubject('')
      setNewEmailBody('')
      fetchData()
    } catch (err) {
      console.error('Failed to create email:', err)
      setRequestError('Unable to create incoming email.')
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border/50 bg-charcoal/95 backdrop-blur-md text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-xl font-semibold shadow-lg shadow-accent/20">
              P
            </div>
            <div>
              <h1 className="font-display text-xl">Pepper Ops</h1>
              <p className="text-xs text-white/50">Revenue and operations control center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-white">
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Error Alert */}
        {requestError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{requestError}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-white transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Emails</p>
                  <p className="font-display text-4xl mt-1">{stats?.emailsPending ?? 0}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Responded</p>
                  <p className="font-display text-4xl mt-1 text-green-600">{stats?.emailsResponded ?? 0}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 transition-colors group-hover:bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue Invoices</p>
                  <p className="font-display text-4xl mt-1 text-yellow-600">{stats?.invoicesOverdue ?? 0}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 transition-colors group-hover:bg-yellow-500/20">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-white transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="font-display text-4xl mt-1">${stats?.totalOutstanding?.toLocaleString() ?? 0}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Inbox + Add Email */}
          <section className="space-y-6 lg:col-span-4">
            {/* Inbox */}
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
                    {filteredEmails.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sender, subject, intent"
                    className="pl-9"
                  />
                </div>

                <Select value={emailFilter} onValueChange={(v) => setEmailFilter(v as EmailFilter)}>
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
                    {filteredEmails.map((email) => (
                      <button
                        key={email.id}
                        className={cn(
                          'w-full rounded-lg border p-3.5 text-left transition-all duration-200',
                          selectedEmailId === email.id
                            ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                            : 'border-border bg-white hover:border-primary/30 hover:shadow-sm'
                        )}
                        onClick={() => setSelectedEmailId(email.id)}
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
                    {!loading && filteredEmails.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border bg-white/50 p-6 text-center">
                        <p className="text-sm text-muted-foreground">No emails match current filters.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Add Incoming Email */}
            <Card className="border-border bg-gradient-to-br from-card to-white/50 overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-white/30">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">Add Incoming Email</CardTitle>
                    <CardDescription>Simulate new inbound traffic</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                <Input
                  value={newEmailSender}
                  onChange={(e) => setNewEmailSender(e.target.value)}
                  placeholder="Sender name"
                />
                <Input
                  value={newEmailSenderEmail}
                  onChange={(e) => setNewEmailSenderEmail(e.target.value)}
                  placeholder="sender@company.com"
                />
                <Input
                  value={newEmailSubject}
                  onChange={(e) => setNewEmailSubject(e.target.value)}
                  placeholder="Email subject"
                />
                <Textarea
                  value={newEmailBody}
                  onChange={(e) => setNewEmailBody(e.target.value)}
                  placeholder="Email body"
                  rows={4}
                  className="resize-none"
                />
                <Button onClick={submitNewEmail} className="w-full shadow-lg shadow-primary/20">
                  Submit Incoming Email
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Center Column - Triage + Invoices */}
          <section className="lg:col-span-5">
            {/* Triage Workspace */}
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
                {selectedEmail ? (
                  <div className="space-y-5">
                    {/* Sender info */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {selectedEmail.sender.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{selectedEmail.sender}</p>
                        <p className="truncate text-sm text-muted-foreground">{selectedEmail.senderEmail}</p>
                      </div>
                      <StatusBadge status={selectedEmail.status} />
                    </div>

                    {/* Subject */}
                    <div className="rounded-lg border border-border bg-white/80 p-4">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Subject</p>
                      <p className="font-medium">{selectedEmail.subject}</p>
                    </div>

                    {/* Body */}
                    <div className="rounded-lg border border-border bg-white/80 p-4 text-sm leading-relaxed">
                      {selectedEmail.body}
                    </div>

                    {/* Classification + Confidence */}
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Classification</p>
                        </div>
                        <p className="text-sm font-semibold text-primary">{selectedEmail.classification || 'Unclassified'}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Confidence</p>
                        <div className="flex items-center gap-3">
                          <Progress value={Math.round((selectedEmail.confidence || 0) * 100)} className="h-2" />
                          <span className="text-sm font-semibold shrink-0">
                            {Math.round((selectedEmail.confidence || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Response Draft */}
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Response Draft
                      </label>
                      <Textarea
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => respondToEmail(selectedEmail.id, replyDraft)}
                        disabled={selectedEmail.status === 'responded' || !replyDraft.trim()}
                        className="flex-1 shadow-lg shadow-primary/20"
                      >
                        {selectedEmail.status === 'responded' ? 'Already Responded' : 'Send Response'}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => escalateEmail(selectedEmail.id)}
                        disabled={selectedEmail.status === 'escalated' || selectedEmail.status === 'responded'}
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

            {/* Invoice Operations */}
            <Card className="mt-6 border-border bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="font-display text-lg">Invoice Operations</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                    {invoices.length} total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/50">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{invoice.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.id} &middot; <span className="font-medium text-fg">${invoice.amount.toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {invoice.daysOverdue > 0 && (
                          <Badge className="border-red-200 bg-red-50 text-red-600 hover:bg-red-50">
                            {invoice.daysOverdue}d overdue
                          </Badge>
                        )}
                        <StatusBadge status={invoice.status} />
                        {invoice.status !== 'paid' && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              onClick={() => sendReminder(invoice.id)}
                              title="Send reminder"
                              aria-label={`Send reminder for ${invoice.id}`}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-green-100 hover:text-green-600"
                              onClick={() => markPaid(invoice.id)}
                              title="Mark as paid"
                              aria-label={`Mark ${invoice.id} as paid`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {invoices.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No invoices yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Right Column - Policies + Activity */}
          <section className="space-y-6 lg:col-span-3">
            {/* Policies */}
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
                    onClick={() => setShowPolicyModal(true)}
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
                        onClick={() => togglePolicy(policy.id)}
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
                        onClick={() => deletePolicy(policy.id)}
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

            {/* Activity Feed */}
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
          </section>
        </div>
      </main>

      {/* Add Policy Dialog */}
      <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add New Policy</DialogTitle>
            <DialogDescription>
              Define a rule for how Pepper handles your operations automatically.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={newPolicy}
            onChange={(e) => setNewPolicy(e.target.value)}
            placeholder="e.g., Always respond to new leads within 15 minutes."
            rows={3}
            className="resize-none"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPolicyModal(false)}>
              Cancel
            </Button>
            <Button onClick={addPolicy} disabled={!newPolicy.trim()}>
              Add Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
