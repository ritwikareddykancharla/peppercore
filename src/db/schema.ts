import { pgTable, text, timestamp, integer, boolean, decimal, json } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  plan: text('plan').default('free').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const emails = pgTable('emails', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  sender: text('sender').notNull(),
  senderEmail: text('sender_email').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  status: text('status').default('incoming').notNull(),
  classification: text('classification'),
  confidence: decimal('confidence', { precision: 3, scale: 2 }),
  suggestedResponse: text('suggested_response'),
  sentResponse: text('sent_response'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
})

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  customer: text('customer').notNull(),
  customerEmail: text('customer_email'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('pending').notNull(),
  daysOverdue: integer('days_overdue').default(0).notNull(),
  reminderCount: integer('reminder_count').default(0).notNull(),
  lastReminder: timestamp('last_reminder'),
  dueDate: timestamp('due_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const activities = pgTable('activities', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  details: text('details'),
  metadata: json('metadata').$type<Record<string, unknown>>(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
})

export const policies = pgTable('policies', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id).notNull(),
  rule: text('rule').notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Email = typeof emails.$inferSelect
export type NewEmail = typeof emails.$inferInsert
export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert
export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert
export type Policy = typeof policies.$inferSelect
export type NewPolicy = typeof policies.$inferInsert
