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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'escalated':
        return 'bg-red-100 text-red-800'
      case 'processing':
      case 'reminder_sent':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="sticky top-0 z-40 border-b border-border/50 bg-charcoal/95 backdrop-blur-md text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-xl font-semibold shadow-lg shadow-accent/20">P</div>
            <div>
              <h1 className="font-display text-xl">Pepper Ops</h1>
              <p className="text-xs text-white/50">Revenue and operations control center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/settings" className="rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {requestError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-white px-5 py-4 text-sm text-red-700 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              {requestError}
            </div>
          </div>
        )}

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
            <div className="absolute right-3 top-3 opacity-10 transition-opacity group-hover:opacity-20">
              <Mail className="h-16 w-16 text-accent" />
            </div>
            <div className="relative z-10">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <p className="font-display text-4xl">{stats?.emailsPending || 0}</p>
              <p className="mt-1 text-sm text-muted">Pending Emails</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
            <div className="absolute right-3 top-3 opacity-10 transition-opacity group-hover:opacity-20">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="relative z-10">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="font-display text-4xl text-green-600">{stats?.emailsResponded || 0}</p>
              <p className="mt-1 text-sm text-muted">Responded</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5">
            <div className="absolute right-3 top-3 opacity-10 transition-opacity group-hover:opacity-20">
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
            </div>
            <div className="relative z-10">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="font-display text-4xl text-yellow-600">{stats?.invoicesOverdue || 0}</p>
              <p className="mt-1 text-sm text-muted">Overdue Invoices</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
            <div className="absolute right-3 top-3 opacity-10 transition-opacity group-hover:opacity-20">
              <DollarSign className="h-16 w-16 text-accent" />
            </div>
            <div className="relative z-10">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <p className="font-display text-4xl">${stats?.totalOutstanding?.toLocaleString() || 0}</p>
              <p className="mt-1 text-sm text-muted">Outstanding</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <Mail className="h-4 w-4 text-accent" />
                  </div>
                  <h2 className="font-display text-lg">Inbox</h2>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{filteredEmails.length}</span>
              </div>

              <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-white/80 px-4 py-2.5 shadow-sm transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
                <Search className="h-4 w-4 text-muted" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search sender, subject, intent"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted/60"
                />
              </div>

              <select
                value={emailFilter}
                onChange={(event) => setEmailFilter(event.target.value as EmailFilter)}
                className="mb-4 w-full rounded-xl border border-border bg-white/80 px-4 py-2.5 text-sm shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
              >
                <option value="all">All statuses</option>
                <option value="processing">Needs response</option>
                <option value="escalated">Escalated</option>
                <option value="responded">Responded</option>
              </select>

              <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
                {filteredEmails.map((email) => (
                  <button
                    key={email.id}
                    className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                      selectedEmailId === email.id
                        ? 'border-accent bg-accent/5 shadow-md shadow-accent/5'
                        : 'border-border bg-white hover:border-accent/30 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedEmailId(email.id)}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{email.sender}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(email.status)}`}>
                        {email.status}
                      </span>
                    </div>
                    <p className="truncate text-sm text-fg/80">{email.subject}</p>
                    {email.classification && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-accent" />
                        <p className="text-xs text-accent">{email.classification}</p>
                      </div>
                    )}
                  </button>
                ))}
                {!loading && filteredEmails.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-white/50 p-6 text-center">
                    <p className="text-sm text-muted">No emails match current filters.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-white/50 overflow-hidden shadow-sm">
              <div className="border-b border-border/50 bg-white/30 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg">Add Incoming Email</h2>
                    <p className="text-xs text-muted">Simulate new inbound traffic</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <input
                  value={newEmailSender}
                  onChange={(e) => setNewEmailSender(e.target.value)}
                  placeholder="Sender name"
                  className="w-full rounded-xl border border-border bg-white/80 px-4 py-2.5 text-sm shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                />
                <input
                  value={newEmailSenderEmail}
                  onChange={(e) => setNewEmailSenderEmail(e.target.value)}
                  placeholder="sender@company.com"
                  className="w-full rounded-xl border border-border bg-white/80 px-4 py-2.5 text-sm shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                />
                <input
                  value={newEmailSubject}
                  onChange={(e) => setNewEmailSubject(e.target.value)}
                  placeholder="Email subject"
                  className="w-full rounded-xl border border-border bg-white/80 px-4 py-2.5 text-sm shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                />
                <textarea
                  value={newEmailBody}
                  onChange={(e) => setNewEmailBody(e.target.value)}
                  placeholder="Email body"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-white/80 px-4 py-3 text-sm shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                />
                <button
                  onClick={submitNewEmail}
                  className="btn-primary w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30"
                >
                  Submit Incoming Email
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="border-b border-border/50 bg-gradient-to-r from-accent/5 to-transparent px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl">Triage Workspace</h2>
                    <p className="text-xs text-muted">Review intent, edit response, and resolve</p>
                  </div>
                </div>
              </div>

              {selectedEmail ? (
                <div className="space-y-5 p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                      {selectedEmail.sender.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{selectedEmail.sender}</p>
                      <p className="truncate text-sm text-muted">{selectedEmail.senderEmail}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(selectedEmail.status)}`}>
                      {selectedEmail.status}
                    </span>
                  </div>

                  <div className="rounded-xl border border-border bg-white/80 p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Subject</p>
                    <p className="font-medium">{selectedEmail.subject}</p>
                  </div>

                  <div className="rounded-xl border border-border bg-white/80 p-4 text-sm text-fg/90 leading-relaxed">
                    {selectedEmail.body}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-white p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">Classification</p>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-accent">{selectedEmail.classification || 'Unclassified'}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">Confidence</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                          <div 
                            className="h-full rounded-full bg-accent transition-all" 
                            style={{ width: `${Math.round((selectedEmail.confidence || 0) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{Math.round((selectedEmail.confidence || 0) * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">Response Draft</label>
                    <textarea
                      value={replyDraft}
                      onChange={(event) => setReplyDraft(event.target.value)}
                      rows={5}
                      className="w-full resize-none rounded-xl border border-border bg-white/80 px-4 py-3 text-sm shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => respondToEmail(selectedEmail.id, replyDraft)}
                      disabled={selectedEmail.status === 'responded' || !replyDraft.trim()}
                      className="btn-primary flex-1 rounded-xl bg-accent py-3.5 font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30 disabled:cursor-not-allowed disabled:bg-accent/40 disabled:shadow-none"
                    >
                      {selectedEmail.status === 'responded' ? 'Already Responded' : 'Send Response'}
                    </button>
                    <button
                      onClick={() => escalateEmail(selectedEmail.id)}
                      disabled={selectedEmail.status === 'escalated' || selectedEmail.status === 'responded'}
                      className="flex-1 rounded-xl border-2 border-red-200 py-3.5 font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Escalate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                    <Mail className="h-8 w-8 text-accent/40" />
                  </div>
                  <p className="text-muted">Select an email from the inbox to begin.</p>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-accent/5 to-transparent px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  <h2 className="font-display text-lg">Invoice Operations</h2>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{invoices.length} total</span>
              </div>
              <div className="divide-y divide-border/50">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/50">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{invoice.customer}</p>
                      <p className="text-sm text-muted">{invoice.id} - <span className="font-medium text-fg">${invoice.amount.toLocaleString()}</span></p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {invoice.daysOverdue > 0 && <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">{invoice.daysOverdue}d overdue</span>}
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                        {invoice.status.replace('_', ' ')}
                      </span>
                      {invoice.status !== 'paid' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => sendReminder(invoice.id)}
                            className="rounded-lg p-2 transition-colors hover:bg-accent/10"
                            title="Send reminder"
                            aria-label={`Send reminder for ${invoice.id}`}
                          >
                            <Bell className="h-4 w-4 text-accent" />
                          </button>
                          <button
                            onClick={() => markPaid(invoice.id)}
                            className="rounded-lg p-2 transition-colors hover:bg-green-100"
                            title="Mark as paid"
                            aria-label={`Mark ${invoice.id} as paid`}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6 lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-accent/5 to-transparent px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <Settings className="h-4 w-4 text-accent" />
                  </div>
                  <h2 className="font-display text-lg">Policies</h2>
                </div>
                <button
                  onClick={() => setShowPolicyModal(true)}
                  className="rounded-lg bg-accent/10 p-2 transition-colors hover:bg-accent/20"
                  aria-label="Open add policy modal"
                >
                  <Plus className="h-4 w-4 text-accent" />
                </button>
              </div>
              <div className="space-y-2 p-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="group flex items-start gap-3 rounded-xl border border-border bg-white p-3 shadow-sm transition-shadow hover:shadow">
                    <button
                      onClick={() => togglePolicy(policy.id)}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${policy.active ? 'border-accent bg-accent' : 'border-border hover:border-accent/50'}`}
                      aria-label={`Toggle policy ${policy.rule}`}
                    >
                      {policy.active && <CheckCircle className="h-3 w-3 text-white" />}
                    </button>
                    <p className={`flex-1 text-sm leading-relaxed ${!policy.active ? 'text-muted line-through' : ''}`}>{policy.rule}</p>
                    <button
                      onClick={() => deletePolicy(policy.id)}
                      className="rounded-lg p-1 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100"
                      aria-label={`Delete policy ${policy.rule}`}
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
                {policies.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
                    No policies yet. Add one to get started.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="border-b border-border/50 bg-gradient-to-r from-accent/5 to-transparent px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  <h2 className="font-display text-lg">Activity Feed</h2>
                </div>
              </div>
              <div className="max-h-[320px] space-y-3 overflow-y-auto p-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="rounded-xl border border-border bg-white p-3 shadow-sm transition-shadow hover:shadow">
                    <p className="font-medium text-sm">{activity.description}</p>
                    {activity.details && <p className="mt-1 text-xs text-muted">{activity.details}</p>}
                    <p className="mt-2 text-xs text-muted/70">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setShowPolicyModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-xl">Add New Policy</h3>
            <textarea
              value={newPolicy}
              onChange={(e) => setNewPolicy(e.target.value)}
              placeholder="e.g., Always respond to new leads within 15 minutes."
              className="w-full resize-none rounded-xl border border-border bg-white/80 px-4 py-3 shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
              rows={3}
            />
            <div className="mt-5 flex gap-3">
              <button
                onClick={addPolicy}
                className="btn-primary flex-1 rounded-xl bg-accent py-3 font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30"
              >
                Add Policy
              </button>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="flex-1 rounded-xl border-2 border-border py-3 font-semibold transition-all hover:border-accent/30 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
