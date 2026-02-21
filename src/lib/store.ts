import type { Email, Invoice, Activity, Policy } from './types'

let emails: Map<string, Email> = new Map()
let invoices: Map<string, Invoice> = new Map()
let activities: Activity[] = []
let policies: Map<string, Policy> = new Map()

function uuid(): string {
  return crypto.randomUUID()
}

function initDemoData() {
  const now = new Date()
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)
  const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000)

  const demoEmails: Email[] = [
    {
      id: uuid(),
      sender: 'Sarah Mitchell',
      senderEmail: 'sarah@techstartup.com',
      subject: 'Quick question about your pricing',
      body: "Hi, I saw your pricing page and had a question about the Pro plan. Does it include unlimited team members? We're a team of 8 looking to automate our operations.",
      status: 'responded',
      classification: 'New Lead - Pricing Inquiry',
      confidence: 0.94,
      suggestedResponse: "Hi Sarah, great to hear from you! Thanks for reaching out about Pepper. Yes, the Pro plan includes unlimited team members - perfect for your team of 8. Would you like to schedule a quick demo to see how it works?",
      sentResponse: "Hi Sarah, great to hear from you! Thanks for reaching out about Pepper. Yes, the Pro plan includes unlimited team members - perfect for your team of 8. Would you like to schedule a quick demo to see how it works?",
      timestamp: minutesAgo(45),
    },
    {
      id: uuid(),
      sender: 'David Kim',
      senderEmail: 'david@agency.io',
      subject: 'Meeting reschedule request',
      body: 'Hey, sorry but I need to reschedule our Thursday meeting. Would Friday at 2pm work instead?',
      status: 'responded',
      classification: 'Existing Client - Scheduling',
      confidence: 0.98,
      suggestedResponse: "Hi David, no problem at all! I've rescheduled our meeting to Friday at 2pm. You should have a calendar invite now. Let me know if you need anything else.",
      sentResponse: "Hi David, no problem at all! I've rescheduled our meeting to Friday at 2pm. You should have a calendar invite now. Let me know if you need anything else.",
      timestamp: hoursAgo(2),
    },
    {
      id: uuid(),
      sender: 'Mike Johnson',
      senderEmail: 'mike.j@enterprise.com',
      subject: 'Invoice #892 - Payment delayed',
      body: "Hi, I'm writing to let you know that our payment for invoice #892 will be delayed by about a week due to some internal processing issues. We'll send it over as soon as possible.",
      status: 'responded',
      classification: 'Payment Issue - Delay Notification',
      confidence: 0.91,
      suggestedResponse: "Hi Mike, thanks for the heads up. I've noted the delay and adjusted our records. We appreciate you letting us know. Please reach out if you need anything in the meantime.",
      sentResponse: "Hi Mike, thanks for the heads up. I've noted the delay and adjusted our records. We appreciate you letting us know. Please reach out if you need anything in the meantime.",
      timestamp: hoursAgo(5),
    },
    {
      id: uuid(),
      sender: 'Jennifer Wu',
      senderEmail: 'jwu@design.co',
      subject: 'Refund request for last order',
      body: "Hi, I'd like to request a refund for my order #4521. The product didn't meet my expectations and I'd like to return it. The order was for $450.",
      status: 'escalated',
      classification: 'Customer Issue - Refund Request',
      confidence: 0.72,
      suggestedResponse: "Hi Jennifer, I'm sorry to hear that. I've escalated your refund request to our team. Someone will be in touch shortly to process this for you.",
      timestamp: minutesAgo(30),
    },
    {
      id: uuid(),
      sender: 'Alex Rivera',
      senderEmail: 'alex@consulting.net',
      subject: 'Partnership opportunity',
      body: 'Hi there, I\'m Alex from Consulting.net. We\'re looking to partner with tools like Pepper for our clients. Would you be open to discussing a referral partnership?',
      status: 'processing',
      classification: 'Business Development - Partnership',
      confidence: 0.88,
      suggestedResponse: undefined,
      timestamp: minutesAgo(5),
    },
  ]

  demoEmails.forEach(e => emails.set(e.id, e))

  const demoInvoices: Invoice[] = [
    {
      id: 'INV-891',
      customer: 'TechStartup Inc',
      amount: 2400.00,
      status: 'reminder_sent',
      daysOverdue: 7,
      reminderCount: 1,
      lastReminder: daysAgo(1),
      createdAt: daysAgo(37),
    },
    {
      id: 'INV-889',
      customer: 'Agency.io',
      amount: 1800.00,
      status: 'paid',
      daysOverdue: 0,
      reminderCount: 2,
      lastReminder: daysAgo(3),
      createdAt: daysAgo(30),
    },
    {
      id: 'INV-892',
      customer: 'Enterprise Corp',
      amount: 4500.00,
      status: 'escalated',
      daysOverdue: 14,
      reminderCount: 3,
      lastReminder: daysAgo(2),
      createdAt: daysAgo(44),
    },
    {
      id: 'INV-893',
      customer: 'Design Co',
      amount: 950.00,
      status: 'pending',
      daysOverdue: 3,
      reminderCount: 0,
      createdAt: daysAgo(33),
    },
    {
      id: 'INV-894',
      customer: 'Consulting.net',
      amount: 3200.00,
      status: 'pending',
      daysOverdue: 1,
      reminderCount: 0,
      createdAt: daysAgo(31),
    },
  ]

  demoInvoices.forEach(i => invoices.set(i.id, i))

  const demoActivities: Activity[] = [
    {
      id: uuid(),
      type: 'email_sent',
      description: 'Follow-up sent to Sarah M.',
      details: 'Response to pricing inquiry - 94% confidence',
      timestamp: minutesAgo(45),
    },
    {
      id: uuid(),
      type: 'reminder_sent',
      description: 'Invoice #891 reminder sent',
      details: 'Friendly reminder - 7 days overdue',
      timestamp: hoursAgo(1),
    },
    {
      id: uuid(),
      type: 'meeting_booked',
      description: 'Meeting confirmed with David K.',
      details: 'Rescheduled to Friday 2pm',
      timestamp: hoursAgo(2),
    },
    {
      id: uuid(),
      type: 'lead_responded',
      description: 'New lead response sent',
      details: 'Partnership inquiry from Alex R.',
      timestamp: hoursAgo(3),
    },
    {
      id: uuid(),
      type: 'invoice_chased',
      description: 'Invoice #892 escalated',
      details: '14 days overdue - $4,500',
      timestamp: hoursAgo(5),
    },
    {
      id: uuid(),
      type: 'reminder_sent',
      description: 'Invoice #889 paid',
      details: '$1,800 received after 2 reminders',
      timestamp: daysAgo(1),
    },
  ]

  activities = demoActivities

  const demoPolicies: Policy[] = [
    {
      id: uuid(),
      rule: 'Always respond to new leads within 15 minutes.',
      active: true,
      createdAt: daysAgo(30),
    },
    {
      id: uuid(),
      rule: 'Never offer a discount over 10% without my approval.',
      active: true,
      createdAt: daysAgo(30),
    },
    {
      id: uuid(),
      rule: "Treat any customer who's spent over $1,000 as VIP.",
      active: true,
      createdAt: daysAgo(30),
    },
    {
      id: uuid(),
      rule: 'Send invoice reminders at 3, 7, and 14 days overdue.',
      active: true,
      createdAt: daysAgo(30),
    },
    {
      id: uuid(),
      rule: 'Escalate any refund request over $200.',
      active: true,
      createdAt: daysAgo(15),
    },
  ]

  demoPolicies.forEach(p => policies.set(p.id, p))
}

initDemoData()

export const store = {
  getEmails: (): Email[] => {
    return Array.from(emails.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  },

  getEmail: (id: string): Email | undefined => emails.get(id),

  addEmail: (email: Omit<Email, 'id' | 'timestamp'>): Email => {
    const newEmail: Email = {
      ...email,
      id: uuid(),
      timestamp: new Date(),
    }
    emails.set(newEmail.id, newEmail)
    return newEmail
  },

  updateEmail: (id: string, updates: Partial<Email>): Email | undefined => {
    const email = emails.get(id)
    if (!email) return undefined
    const updated = { ...email, ...updates }
    emails.set(id, updated)
    return updated
  },

  getInvoices: (): Invoice[] => {
    return Array.from(invoices.values()).sort((a, b) => b.daysOverdue - a.daysOverdue)
  },

  getInvoice: (id: string): Invoice | undefined => invoices.get(id),

  updateInvoice: (id: string, updates: Partial<Invoice>): Invoice | undefined => {
    const invoice = invoices.get(id)
    if (!invoice) return undefined
    const updated = { ...invoice, ...updates }
    invoices.set(id, updated)
    return updated
  },

  getActivities: (limit = 20): Activity[] => {
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  },

  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>): Activity => {
    const newActivity: Activity = {
      ...activity,
      id: uuid(),
      timestamp: new Date(),
    }
    activities.unshift(newActivity)
    return newActivity
  },

  getPolicies: (): Policy[] => Array.from(policies.values()),

  getPolicy: (id: string): Policy | undefined => policies.get(id),

  addPolicy: (rule: string): Policy => {
    const policy: Policy = {
      id: uuid(),
      rule,
      active: true,
      createdAt: new Date(),
    }
    policies.set(policy.id, policy)
    return policy
  },

  togglePolicy: (id: string): Policy | undefined => {
    const policy = policies.get(id)
    if (!policy) return undefined
    policy.active = !policy.active
    return policy
  },

  deletePolicy: (id: string): boolean => policies.delete(id),

  getStats: () => {
    const now = new Date()
    const emailList = Array.from(emails.values())
    const invoiceList = Array.from(invoices.values())
    
    return {
      emailsPending: emailList.filter(e => e.status === 'processing').length,
      emailsResponded: emailList.filter(e => e.status === 'responded').length,
      emailsEscalated: emailList.filter(e => e.status === 'escalated').length,
      invoicesPending: invoiceList.filter(i => i.status === 'pending').length,
      invoicesOverdue: invoiceList.filter(i => i.daysOverdue > 0 && i.status !== 'paid').length,
      totalOutstanding: invoiceList
        .filter(i => i.status !== 'paid')
        .reduce((sum, i) => sum + i.amount, 0),
      policiesActive: Array.from(policies.values()).filter(p => p.active).length,
      activitiesToday: activities.filter(
        a => new Date(a.timestamp).toDateString() === now.toDateString()
      ).length,
    }
  },

  reset: () => {
    emails = new Map()
    invoices = new Map()
    activities = []
    policies = new Map()
    initDemoData()
  },
}
