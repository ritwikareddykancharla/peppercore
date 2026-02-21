import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import apiRoutes from './backend/routes'
import { stripe } from './lib/payments/stripe'
import { db } from './db'
import { users } from './db/schema'
import { eq } from 'drizzle-orm'

const app = new Hono()

app.route('/api', apiRoutes)

app.post('/webhooks/stripe', async (c) => {
  const body = await c.req.text()
  const sig = c.req.header('stripe-signature')
  
  if (!sig) {
    return c.json({ error: 'No signature' }, 400)
  }
  
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return c.json({ error: 'Invalid signature' }, 400)
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string
    
    const user = await db.query.users.findFirst({
      where: eq(users.stripeCustomerId, customerId),
    })
    
    if (user) {
      await db.update(users)
        .set({
          stripeSubscriptionId: subscriptionId,
          stripePriceId: session.line_items?.data[0]?.price?.id,
          stripeCurrentPeriodEnd: new Date((session as any).current_period_end * 1000),
          plan: 'pro',
        })
        .where(eq(users.id, user.id))
    }
  }
  
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as any
    const subscriptionId = invoice.subscription as string
    
    const user = await db.query.users.findFirst({
      where: eq(users.stripeSubscriptionId, subscriptionId),
    })
    
    if (user) {
      await db.update(users)
        .set({
          stripeCurrentPeriodEnd: new Date((invoice as any).period_end * 1000),
        })
        .where(eq(users.id, user.id))
    }
  }
  
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const subscriptionId = subscription.id
    
    const user = await db.query.users.findFirst({
      where: eq(users.stripeSubscriptionId, subscriptionId),
    })
    
    if (user) {
      await db.update(users)
        .set({
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          plan: 'free',
        })
        .where(eq(users.id, user.id))
    }
  }
  
  return c.json({ received: true })
})

if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: './dist' }))
  app.get('*', async (c) => {
    return c.html(
      await Bun.file('./dist/index.html').text()
    )
  })
}

const port = parseInt(process.env.PORT || '3000')

console.log(`Pepper server running at http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
