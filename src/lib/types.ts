export type EmailStatus = 'incoming' | 'processing' | 'responded' | 'escalated'
export type InvoiceStatus = 'pending' | 'reminder_sent' | 'paid' | 'escalated'
export type ActivityType = 'email_sent' | 'reminder_sent' | 'meeting_booked' | 'lead_responded' | 'invoice_chased'

export interface Email {
  id: string
  sender: string
  senderEmail: string
  subject: string
  body: string
  status: EmailStatus
  classification?: string
  confidence?: number
  suggestedResponse?: string
  sentResponse?: string
  timestamp: Date
}

export interface Invoice {
  id: string
  customer: string
  amount: number
  status: InvoiceStatus
  daysOverdue: number
  reminderCount: number
  lastReminder?: Date
  createdAt: Date
}

export interface Activity {
  id: string
  type: ActivityType
  description: string
  details?: string
  timestamp: Date
}

export interface Policy {
  id: string
  rule: string
  active: boolean
  createdAt: Date
}

export interface Stats {
  emailsPending: number
  emailsResponded: number
  emailsEscalated: number
  invoicesPending: number
  invoicesOverdue: number
  totalOutstanding: number
  policiesActive: number
  activitiesToday: number
}
