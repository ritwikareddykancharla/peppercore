import { useEffect, useMemo, useState } from 'react'

export interface DashboardEmail {
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

export interface DashboardInvoice {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'reminder_sent' | 'paid' | 'escalated'
  daysOverdue: number
  reminderCount: number
}

export interface DashboardActivity {
  id: string
  type: string
  description: string
  details?: string
  timestamp: string
}

export interface DashboardPolicy {
  id: string
  rule: string
  active: boolean
}

export interface DashboardStats {
  emailsPending: number
  emailsResponded: number
  emailsEscalated: number
  invoicesPending: number
  invoicesOverdue: number
  totalOutstanding: number
  policiesActive: number
  activitiesToday: number
}

export type EmailFilter = 'all' | 'processing' | 'escalated' | 'responded'

export function useDashboard() {
  const [emails, setEmails] = useState<DashboardEmail[]>([])
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([])
  const [activities, setActivities] = useState<DashboardActivity[]>([])
  const [policies, setPolicies] = useState<DashboardPolicy[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [emailFilter, setEmailFilter] = useState<EmailFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [newPolicy, setNewPolicy] = useState('')
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [newEmailForm, setNewEmailForm] = useState({
    sender: '',
    senderEmail: '',
    subject: '',
    body: '',
  })
  const [requestError, setRequestError] = useState<string | null>(null)

  const selectedEmail = useMemo(
    () => emails.find((e) => e.id === selectedEmailId) ?? null,
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

  // Fetch all dashboard data
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

      const nextEmails: DashboardEmail[] = await emailsRes.json()
      setEmails(nextEmails)
      setInvoices(await invoicesRes.json())
      setActivities(await activitiesRes.json())
      setPolicies(await policiesRes.json())
      setStats(await statsRes.json())

      if (!selectedEmailId && nextEmails.length > 0) {
        setSelectedEmailId(nextEmails[0].id)
      }
      if (selectedEmailId && !nextEmails.some((e) => e.id === selectedEmailId)) {
        setSelectedEmailId(nextEmails[0]?.id ?? null)
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setRequestError('Unable to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Poll on mount
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Auto-select first email when filter changes
  useEffect(() => {
    if (!selectedEmail && filteredEmails.length > 0) {
      setSelectedEmailId(filteredEmails[0].id)
    }
  }, [filteredEmails, selectedEmail])

  // Sync reply draft with selected email
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

  // --- Actions ---

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
    const { sender, senderEmail, subject, body } = newEmailForm
    if (!sender.trim() || !senderEmail.trim() || !subject.trim() || !body.trim()) {
      setRequestError('Fill in all email fields before submitting.')
      return
    }

    try {
      setRequestError(null)
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: sender.trim(),
          senderEmail: senderEmail.trim(),
          subject: subject.trim(),
          body: body.trim(),
        }),
      })

      if (!response.ok) {
        setRequestError('Unable to create incoming email.')
        return
      }

      setNewEmailForm({ sender: '', senderEmail: '', subject: '', body: '' })
      fetchData()
    } catch (err) {
      console.error('Failed to create email:', err)
      setRequestError('Unable to create incoming email.')
    }
  }

  return {
    // Data
    filteredEmails,
    selectedEmail,
    invoices,
    activities,
    policies,
    stats,

    // Email selection
    selectedEmailId,
    setSelectedEmailId,
    replyDraft,
    setReplyDraft,
    emailFilter,
    setEmailFilter,
    searchQuery,
    setSearchQuery,

    // New email form
    newEmailForm,
    setNewEmailForm,

    // Policy form
    newPolicy,
    setNewPolicy,
    showPolicyModal,
    setShowPolicyModal,

    // Status
    loading,
    requestError,

    // Actions
    respondToEmail,
    escalateEmail,
    sendReminder,
    markPaid,
    addPolicy,
    togglePolicy,
    deletePolicy,
    submitNewEmail,
  }
}
