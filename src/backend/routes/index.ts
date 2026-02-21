import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authMiddleware, getOrCreateUser } from '../../lib/auth'
import { db } from '../../db'
import { emails, invoices, activities, policies, users } from '../../db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { classifyEmail, shouldEscalate } from '../../lib/ai-engine'
import { createCustomer, createCheckoutSession, createBillingPortalSession, PLANS } from '../../lib/payments/stripe'

const api = new Hono()

api.use('/*', cors())
api.use('/*', authMiddleware)

api.get('/health', (c) => c.json({ status: 'healthy' }))

api.get('/me', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({ user })
})

api.get('/emails', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const userEmails = await db.query.emails.findMany({
    where: eq(emails.userId, user.id),
    orderBy: [desc(emails.timestamp)],
  })
  
  return c.json(userEmails)
})

api.get('/emails/:id', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const email = await db.query.emails.findFirst({
    where: and(eq(emails.id, c.req.param('id')), eq(emails.userId, user.id)),
  })
  
  if (!email) return c.json({ error: 'Email not found' }, 404)
  return c.json(email)
})

api.post('/emails', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const body = await c.req.json()
  const { sender, senderEmail, subject, body: emailBody } = body

  if (!sender || !senderEmail || !subject || !emailBody) {
    return c.json({ error: 'sender, senderEmail, subject, and body are required' }, 400)
  }
  
  const analysis = classifyEmail(sender, subject, emailBody)
  const escalate = shouldEscalate(analysis.classification, analysis.confidence)
  const status = escalate ? 'escalated' : 'processing'
  
  const [email] = await db.insert(emails).values({
    userId: user.id,
    sender,
    senderEmail,
    subject,
    body: emailBody,
    status,
    classification: analysis.classification,
    confidence: analysis.confidence?.toString(),
    suggestedResponse: analysis.suggestedResponse,
  }).returning()
  
  await db.insert(activities).values({
    userId: user.id,
    type: 'lead_responded',
    description: `New email from ${sender}`,
    details: `Classified as: ${analysis.classification}`,
  })
  
  return c.json({ email, analysis })
})

api.post('/emails/:id/respond', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const id = c.req.param('id')
  const email = await db.query.emails.findFirst({
    where: and(eq(emails.id, id), eq(emails.userId, user.id)),
  })
  
  if (!email) return c.json({ error: 'Email not found' }, 404)

  let customResponse: string | undefined
  try {
    const body = await c.req.json()
    if (body && typeof body.response === 'string' && body.response.trim()) {
      customResponse = body.response.trim()
    }
  } catch {}
  
  const responseToSend = customResponse ?? email.suggestedResponse

  if (!responseToSend) {
    return c.json({ error: 'No suggested response available' }, 400)
  }
  
  const [updated] = await db.update(emails)
    .set({ sentResponse: responseToSend, status: 'responded' })
    .where(eq(emails.id, id))
    .returning()
  
  await db.insert(activities).values({
    userId: user.id,
    type: 'email_sent',
    description: `Response sent to ${email.sender}`,
    details: `Re: ${email.subject}`,
  })
  
  return c.json(updated)
})

api.post('/emails/:id/escalate', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const id = c.req.param('id')
  const email = await db.query.emails.findFirst({
    where: and(eq(emails.id, id), eq(emails.userId, user.id)),
  })
  
  if (!email) return c.json({ error: 'Email not found' }, 404)
  
  const [updated] = await db.update(emails)
    .set({ status: 'escalated' })
    .where(eq(emails.id, id))
    .returning()
  
  await db.insert(activities).values({
    userId: user.id,
    type: 'email_sent',
    description: `Email from ${email.sender} escalated`,
    details: 'Requires manual review',
  })
  
  return c.json(updated)
})

api.get('/invoices', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const userInvoices = await db.query.invoices.findMany({
    where: eq(invoices.userId, user.id),
    orderBy: [desc(invoices.daysOverdue)],
  })
  
  return c.json(userInvoices)
})

api.get('/invoices/:id', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const invoice = await db.query.invoices.findFirst({
    where: and(eq(invoices.id, c.req.param('id')), eq(invoices.userId, user.id)),
  })
  
  if (!invoice) return c.json({ error: 'Invoice not found' }, 404)
  return c.json(invoice)
})

api.post('/invoices', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const body = await c.req.json()
  const { customer, customerEmail, amount, dueDate } = body
  
  if (!customer || !amount || !dueDate) {
    return c.json({ error: 'customer, amount, and dueDate are required' }, 400)
  }
  
  const [invoice] = await db.insert(invoices).values({
    userId: user.id,
    customer,
    customerEmail,
    amount: amount.toString(),
    dueDate: new Date(dueDate),
  }).returning()
  
  return c.json(invoice)
})

api.post('/invoices/:id/remind', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const id = c.req.param('id')
  const invoice = await db.query.invoices.findFirst({
    where: and(eq(invoices.id, id), eq(invoices.userId, user.id)),
  })
  
  if (!invoice) return c.json({ error: 'Invoice not found' }, 404)
  
  const [updated] = await db.update(invoices)
    .set({
      reminderCount: invoice.reminderCount + 1,
      lastReminder: new Date(),
      status: 'reminder_sent',
    })
    .where(eq(invoices.id, id))
    .returning()
  
  await db.insert(activities).values({
    userId: user.id,
    type: 'reminder_sent',
    description: `Reminder sent for ${id}`,
    details: `$${invoice.amount} - ${invoice.daysOverdue} days overdue`,
  })
  
  return c.json(updated)
})

api.post('/invoices/:id/mark-paid', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const id = c.req.param('id')
  const invoice = await db.query.invoices.findFirst({
    where: and(eq(invoices.id, id), eq(invoices.userId, user.id)),
  })
  
  if (!invoice) return c.json({ error: 'Invoice not found' }, 404)
  
  const [updated] = await db.update(invoices)
    .set({ status: 'paid', daysOverdue: 0 })
    .where(eq(invoices.id, id))
    .returning()
  
  await db.insert(activities).values({
    userId: user.id,
    type: 'reminder_sent',
    description: `Invoice ${id} marked as paid`,
    details: `$${invoice.amount} received`,
  })
  
  return c.json(updated)
})

api.get('/activities', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const limit = parseInt(c.req.query('limit') || '20')
  const userActivities = await db.query.activities.findMany({
    where: eq(activities.userId, user.id),
    orderBy: [desc(activities.timestamp)],
    limit,
  })
  
  return c.json(userActivities)
})

api.get('/policies', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const userPolicies = await db.query.policies.findMany({
    where: eq(policies.userId, user.id),
  })
  
  return c.json(userPolicies)
})

api.post('/policies', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const body = await c.req.json()
  const { rule } = body

  if (!rule || typeof rule !== 'string' || !rule.trim()) {
    return c.json({ error: 'rule is required' }, 400)
  }
  
  const [policy] = await db.insert(policies).values({
    userId: user.id,
    rule: rule.trim(),
  }).returning()
  
  await db.insert(activities).values({
    userId: user.id,
    type: 'email_sent',
    description: 'New policy created',
    details: rule,
  })
  
  return c.json(policy)
})

api.post('/policies/:id/toggle', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const policy = await db.query.policies.findFirst({
    where: and(eq(policies.id, c.req.param('id')), eq(policies.userId, user.id)),
  })
  
  if (!policy) return c.json({ error: 'Policy not found' }, 404)
  
  const [updated] = await db.update(policies)
    .set({ active: !policy.active })
    .where(eq(policies.id, policy.id))
    .returning()
  
  return c.json(updated)
})

api.delete('/policies/:id', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const policy = await db.query.policies.findFirst({
    where: and(eq(policies.id, c.req.param('id')), eq(policies.userId, user.id)),
  })
  
  if (!policy) return c.json({ error: 'Policy not found' }, 404)
  
  await db.delete(policies).where(eq(policies.id, policy.id))
  
  return c.json({ success: true })
})

api.get('/stats', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  const userEmails = await db.query.emails.findMany({
    where: eq(emails.userId, user.id),
  })
  
  const userInvoices = await db.query.invoices.findMany({
    where: eq(invoices.userId, user.id),
  })
  
  const userPolicies = await db.query.policies.findMany({
    where: eq(policies.userId, user.id),
  })
  
  const userActivities = await db.query.activities.findMany({
    where: eq(activities.userId, user.id),
  })
  
  const now = new Date()
  
  return c.json({
    emailsPending: userEmails.filter(e => e.status === 'processing').length,
    emailsResponded: userEmails.filter(e => e.status === 'responded').length,
    emailsEscalated: userEmails.filter(e => e.status === 'escalated').length,
    invoicesPending: userInvoices.filter(i => i.status === 'pending').length,
    invoicesOverdue: userInvoices.filter(i => i.daysOverdue > 0 && i.status !== 'paid').length,
    totalOutstanding: userInvoices
      .filter(i => i.status !== 'paid')
      .reduce((sum, i) => sum + parseFloat(i.amount), 0),
    policiesActive: userPolicies.filter(p => p.active).length,
    activitiesToday: userActivities.filter(
      a => new Date(a.timestamp).toDateString() === now.toDateString()
    ).length,
  })
})

api.post('/checkout', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  let customerId = user.stripeCustomerId
  
  if (!customerId) {
    const customer = await createCustomer(user.email, user.name || undefined)
    customerId = customer.id
    
    await db.update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, user.id))
  }
  
  const session = await createCheckoutSession(
    customerId,
    PLANS.pro.priceId,
    `${process.env.APP_URL}/dashboard?success=true`,
    `${process.env.APP_URL}/pricing?canceled=true`
  )
  
  return c.json({ url: session.url })
})

api.post('/billing-portal', async (c) => {
  const user = await getOrCreateUser(c, db)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  
  if (!user.stripeCustomerId) {
    return c.json({ error: 'No subscription found' }, 400)
  }
  
  const session = await createBillingPortalSession(
    user.stripeCustomerId,
    `${process.env.APP_URL}/settings`
  )
  
  return c.json({ url: session.url })
})

export default api
