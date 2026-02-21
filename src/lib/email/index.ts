import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export const sendEmail = async ({ to, subject, html, from }: SendEmailOptions) => {
  const { data, error } = await resend.emails.send({
    from: from || 'Pepper <noreply@pepperops.com>',
    to,
    subject,
    html,
  })

  if (error) {
    throw error
  }

  return data
}

export const sendInvoiceReminder = async (to: string, invoiceId: string, amount: number, daysOverdue: number) => {
  return sendEmail({
    to,
    subject: `Invoice ${invoiceId} - Payment Reminder`,
    html: `
      <h1>Payment Reminder</h1>
      <p>This is a friendly reminder that invoice <strong>${invoiceId}</strong> for <strong>$${amount}</strong> is ${daysOverdue} days overdue.</p>
      <p>Please process payment at your earliest convenience.</p>
      <p>Thank you,<br>Pepper Ops</p>
    `,
  })
}

export const sendWelcomeEmail = async (to: string, name: string) => {
  return sendEmail({
    to,
    subject: 'Welcome to Pepper!',
    html: `
      <h1>Welcome to Pepper, ${name}!</h1>
      <p>Thanks for signing up. You're now ready to automate your business operations.</p>
      <p>Get started by connecting your email and setting up your first policies.</p>
      <p>Cheers,<br>The Pepper Team</p>
    `,
  })
}
