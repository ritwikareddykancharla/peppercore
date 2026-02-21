import api from './index'
import { store } from '../../lib/store'

describe('API routes', () => {
  beforeEach(() => {
    store.reset()
  })

  it('returns health status', async () => {
    const response = await api.request('/health')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'healthy' })
  })

  it('rejects email creation when required fields are missing', async () => {
    const response = await api.request('/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: 'Sam' }),
    })

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'sender, senderEmail, subject, and body are required',
    })
  })

  it('creates an email and can respond to it', async () => {
    const createResponse = await api.request('/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: 'Taylor Morgan',
        senderEmail: 'taylor@example.com',
        subject: 'Question about meeting schedule',
        body: 'Can we move our meeting to Friday?',
      }),
    })

    expect(createResponse.status).toBe(200)
    const createData = await createResponse.json()

    expect(createData.email.id).toBeTruthy()
    expect(createData.email.sender).toBe('Taylor Morgan')
    expect(['processing', 'escalated']).toContain(createData.email.status)
    expect(typeof createData.analysis.classification).toBe('string')
    expect(typeof createData.analysis.confidence).toBe('number')

    const respondResponse = await api.request(`/emails/${createData.email.id}/respond`, {
      method: 'POST',
    })

    expect(respondResponse.status).toBe(200)
    const respondedEmail = await respondResponse.json()

    expect(respondedEmail.status).toBe('responded')
    expect(respondedEmail.sentResponse).toBeTruthy()
  })

  it('reminds and then marks invoice paid', async () => {
    const remindResponse = await api.request('/invoices/INV-893/remind', {
      method: 'POST',
    })
    expect(remindResponse.status).toBe(200)
    const remindedInvoice = await remindResponse.json()
    expect(remindedInvoice.status).toBe('reminder_sent')
    expect(remindedInvoice.reminderCount).toBe(1)

    const paidResponse = await api.request('/invoices/INV-893/mark-paid', {
      method: 'POST',
    })
    expect(paidResponse.status).toBe(200)
    const paidInvoice = await paidResponse.json()

    expect(paidInvoice.status).toBe('paid')
    expect(paidInvoice.daysOverdue).toBe(0)
  })
})
