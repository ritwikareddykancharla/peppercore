interface AIAnalysis {
  classification: string
  confidence: number
  reasoning: string
  suggestedAction: 'respond_automatically' | 'escalate_for_review'
  suggestedResponse: string
}

const CLASSIFICATIONS: [string, string[]][] = [
  ['New Lead - Pricing Inquiry', ['pricing', 'cost', 'price', 'plan', 'subscription']],
  ['New Lead - Demo Request', ['demo', 'trial', 'test', 'try']],
  ['Existing Client - Scheduling', ['meeting', 'schedule', 'reschedule', 'calendar', 'time']],
  ['Customer Issue - Refund Request', ['refund', 'return', 'money back']],
  ['Customer Issue - Complaint', ['complaint', 'unhappy', 'disappointed', 'issue']],
  ['Payment Issue - Delay Notification', ['payment', 'delay', 'invoice', 'pay']],
  ['Business Development - Partnership', ['partner', 'partnership', 'collaborate']],
  ['General Inquiry', []],
]

const RESPONSE_TEMPLATES: Record<string, string> = {
  'New Lead - Pricing Inquiry': "Hi {name}, great to hear from you! Thanks for reaching out about Pepper. I'd be happy to answer your pricing questions. The Pro plan is $300/month and includes unlimited everything. Would you like to schedule a quick demo?",
  'New Lead - Demo Request': "Hi {name}, thanks for your interest in Pepper! I'd love to show you how it works. I have availability this week - would Tuesday at 2pm or Wednesday at 10am work for you?",
  'Existing Client - Scheduling': "Hi {name}, no problem at all! I've noted your scheduling request. Let me check availability and get back to you with some options shortly.",
  'Customer Issue - Refund Request': "Hi {name}, I'm sorry to hear that. I've escalated your request to our team. Someone will be in touch shortly to help resolve this.",
  'Customer Issue - Complaint': "Hi {name}, I'm truly sorry to hear about your experience. Your feedback is important to us. I've flagged this for immediate attention and someone will reach out within 24 hours.",
  'Payment Issue - Delay Notification': "Hi {name}, thanks for the heads up. I've noted the delay in our records. We appreciate you keeping us informed. Please let me know if there's anything else I can help with.",
  'Business Development - Partnership': "Hi {name}, thanks for reaching out! Partnership opportunities are always exciting. I'd love to learn more about what you have in mind. Could we schedule a call this week?",
  'General Inquiry': "Hi {name}, thanks for your message! I'll review this and get back to you shortly. Is there anything specific you'd like me to address?",
}

export function classifyEmail(sender: string, subject: string, body: string): AIAnalysis {
  const combinedText = `${subject} ${body}`.toLowerCase()
  
  let bestMatch = 'General Inquiry'
  let bestScore = 0
  
  for (const [classification, keywords] of CLASSIFICATIONS) {
    const score = keywords.filter(kw => combinedText.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = classification
    }
  }
  
  const confidence = Math.min(0.95, 0.65 + bestScore * 0.1 + (Math.random() * 0.1 - 0.05))
  
  const name = sender.split(' ')[0] || 'there'
  const suggestedResponse = RESPONSE_TEMPLATES[bestMatch]?.replace('{name}', name) || 
    RESPONSE_TEMPLATES['General Inquiry'].replace('{name}', name)
  
  let reasoning = `Detected keywords related to ${bestMatch.toLowerCase()}. `
  if (confidence > 0.85) {
    reasoning += 'High confidence based on clear intent indicators.'
  } else if (confidence > 0.70) {
    reasoning += 'Medium confidence. May need human review for edge cases.'
  } else {
    reasoning += 'Lower confidence. Recommend human review before responding.'
  }
  
  const suggestedAction = confidence > 0.85 ? 'respond_automatically' : 'escalate_for_review'
  
  return {
    classification: bestMatch,
    confidence: Math.round(confidence * 100) / 100,
    reasoning,
    suggestedAction,
    suggestedResponse,
  }
}

export function shouldEscalate(classification: string, confidence: number): boolean {
  const escalationTriggers = [
    classification.includes('Refund Request'),
    classification.includes('Complaint'),
    confidence < 0.75,
  ]
  return escalationTriggers.some(Boolean)
}

export function determineInvoiceAction(daysOverdue: number, reminderCount: number): [string, string] {
  if (daysOverdue >= 14 && reminderCount >= 3) {
    return ['escalate', 'Invoice escalated - requires manual follow-up']
  } else if (daysOverdue >= 7 && reminderCount < 2) {
    return ['send_firm_reminder', 'Sending firm payment reminder']
  } else if (daysOverdue >= 3 && reminderCount === 0) {
    return ['send_friendly_reminder', 'Sending friendly payment reminder']
  }
  return ['monitor', 'Monitoring - next reminder scheduled']
}
