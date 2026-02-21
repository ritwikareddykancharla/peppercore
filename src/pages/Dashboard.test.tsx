import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from './Dashboard'

type EmailStatus = 'incoming' | 'processing' | 'responded' | 'escalated'
type InvoiceStatus = 'pending' | 'reminder_sent' | 'paid' | 'escalated'

type Email = {
  id: string
  sender: string
  senderEmail: string
  subject: string
  body: string
  status: EmailStatus
  classification?: string
  confidence?: number
  suggestedResponse?: string
  timestamp: string
}

type Invoice = {
  id: string
  customer: string
  amount: number
  status: InvoiceStatus
  daysOverdue: number
  reminderCount: number
}

type Activity = {
  id: string
  type: string
  description: string
  details?: string
  timestamp: string
}

type Policy = {
  id: string
  rule: string
  active: boolean
}

const EMAIL_ID = 'email-1'
const INVOICE_ID = 'INV-900'

function buildFetchMock() {
  const now = new Date().toISOString()

  const emails: Email[] = [
    {
      id: EMAIL_ID,
      sender: 'Jordan Lee',
      senderEmail: 'jordan@example.com',
      subject: 'Need help with scheduling',
      body: 'Can we move this call to tomorrow?',
      status: 'processing',
      classification: 'Existing Client - Scheduling',
      confidence: 0.9,
      suggestedResponse: 'Sure, I can help with that schedule update.',
      timestamp: now,
    },
  ]

  const invoices: Invoice[] = [
    {
      id: INVOICE_ID,
      customer: 'Acme Co',
      amount: 1250,
      status: 'pending',
      daysOverdue: 4,
      reminderCount: 0,
    },
  ]

  const activities: Activity[] = [
    {
      id: 'act-1',
      type: 'lead_responded',
      description: 'Initial activity',
      timestamp: now,
    },
  ]

  const policies: Policy[] = [
    { id: 'pol-1', rule: 'Always follow up quickly.', active: true },
  ]

  const stats = () => ({
    emailsPending: emails.filter((e) => e.status === 'processing').length,
    emailsResponded: emails.filter((e) => e.status === 'responded').length,
    emailsEscalated: emails.filter((e) => e.status === 'escalated').length,
    invoicesPending: invoices.filter((i) => i.status === 'pending').length,
    invoicesOverdue: invoices.filter((i) => i.daysOverdue > 0 && i.status !== 'paid').length,
    totalOutstanding: invoices.filter((i) => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0),
    policiesActive: policies.filter((p) => p.active).length,
    activitiesToday: activities.length,
  })

  const response = (data: unknown, status = 200): Response => {
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
    } as Response
  }

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const method = (init?.method ?? 'GET').toUpperCase()

    if (url === '/api/emails' && method === 'GET') return response(emails)
    if (url === '/api/invoices' && method === 'GET') return response(invoices)
    if (url.startsWith('/api/activities') && method === 'GET') return response(activities)
    if (url === '/api/policies' && method === 'GET') return response(policies)
    if (url === '/api/stats' && method === 'GET') return response(stats())

    if (url === '/api/emails' && method === 'POST') {
      const body = JSON.parse(init?.body as string)
      const newEmail: Email = {
        id: `email-${emails.length + 1}`,
        sender: body.sender,
        senderEmail: body.senderEmail,
        subject: body.subject,
        body: body.body,
        status: 'processing',
        classification: 'General Inquiry',
        confidence: 0.8,
        suggestedResponse: 'Thanks for your message.',
        timestamp: new Date().toISOString(),
      }
      emails.unshift(newEmail)
      return response({ email: newEmail, analysis: { classification: 'General Inquiry', confidence: 0.8 } })
    }

    if (url === `/api/emails/${EMAIL_ID}/respond` && method === 'POST') {
      const email = emails.find((e) => e.id === EMAIL_ID)
      if (email) {
        email.status = 'responded'
      }
      return response(email)
    }

    if (url === `/api/invoices/${INVOICE_ID}/remind` && method === 'POST') {
      const invoice = invoices.find((i) => i.id === INVOICE_ID)
      if (invoice) {
        invoice.status = 'reminder_sent'
        invoice.reminderCount += 1
      }
      return response(invoice)
    }

    if (url === `/api/invoices/${INVOICE_ID}/mark-paid` && method === 'POST') {
      const invoice = invoices.find((i) => i.id === INVOICE_ID)
      if (invoice) {
        invoice.status = 'paid'
        invoice.daysOverdue = 0
      }
      return response(invoice)
    }

    if (url === '/api/policies' && method === 'POST') {
      const body = JSON.parse(init?.body as string)
      policies.push({ id: `pol-${policies.length + 1}`, rule: body.rule, active: true })
      return response(policies[policies.length - 1])
    }

    if (url === '/api/policies/pol-1/toggle' && method === 'POST') {
      policies[0].active = !policies[0].active
      return response(policies[0])
    }

    if (url === '/api/policies/pol-1' && method === 'DELETE') {
      policies.splice(0, 1)
      return response({ success: true })
    }

    return response({ error: `Unhandled route ${method} ${url}` }, 500)
  })

  return fetchMock
}

describe('Dashboard actions', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', buildFetchMock())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('submits a new incoming email', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await screen.findAllByText('Need help with scheduling')

    await user.type(screen.getByPlaceholderText('Sender name'), 'Casey Green')
    await user.type(screen.getByPlaceholderText('sender@company.com'), 'casey@company.com')
    await user.type(screen.getByPlaceholderText('Email subject'), 'New pipeline question')
    await user.type(screen.getByPlaceholderText('Email body'), 'What plan fits a team of ten?')
    await user.click(screen.getByRole('button', { name: 'Submit Incoming Email' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/emails',
        expect.objectContaining({ method: 'POST' })
      )
    })
  }, 15000)

  it('responds to a selected processing email', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    const subjectRows = await screen.findAllByText('Need help with scheduling')
    await user.click(subjectRows[0])
    await user.click(screen.getByRole('button', { name: 'Send Response' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `/api/emails/${EMAIL_ID}/respond`,
        expect.objectContaining({ method: 'POST' })
      )
    })
  })

  it('sends invoice reminder and marks invoice paid', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await screen.findByText('Acme Co')
    await user.click(screen.getByTitle('Send reminder'))
    await user.click(screen.getByTitle('Mark as paid'))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`/api/invoices/${INVOICE_ID}/remind`, { method: 'POST' })
      expect(fetch).toHaveBeenCalledWith(`/api/invoices/${INVOICE_ID}/mark-paid`, { method: 'POST' })
    })
  })

  it('adds, toggles, and deletes a policy', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    await screen.findByText('Always follow up quickly.')

    await user.click(screen.getByRole('button', { name: 'Open add policy modal' }))
    await user.type(screen.getByPlaceholderText('e.g., Always respond to new leads within 15 minutes.'), 'Escalate legal requests immediately.')
    await user.click(screen.getByRole('button', { name: 'Add Policy' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/policies',
        expect.objectContaining({ method: 'POST' })
      )
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Toggle policy Always follow up quickly.' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: 'Toggle policy Always follow up quickly.' }))
    await user.click(screen.getByRole('button', { name: 'Delete policy Always follow up quickly.' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/policies/pol-1/toggle', { method: 'POST' })
      expect(fetch).toHaveBeenCalledWith('/api/policies/pol-1', { method: 'DELETE' })
    })
  })
})
