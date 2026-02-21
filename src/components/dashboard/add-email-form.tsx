import { Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface AddEmailFormProps {
  form: { sender: string; senderEmail: string; subject: string; body: string }
  onFormChange: (form: { sender: string; senderEmail: string; subject: string; body: string }) => void
  onSubmit: () => void
}

export function AddEmailForm({ form, onFormChange, onSubmit }: AddEmailFormProps) {
  const update = (field: string, value: string) =>
    onFormChange({ ...form, [field]: value })

  return (
    <Card className="border-border bg-gradient-to-br from-card to-white/50 overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-white/30">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Add Incoming Email</CardTitle>
            <CardDescription>Simulate new inbound traffic</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        <Input
          value={form.sender}
          onChange={(e) => update('sender', e.target.value)}
          placeholder="Sender name"
        />
        <Input
          value={form.senderEmail}
          onChange={(e) => update('senderEmail', e.target.value)}
          placeholder="sender@company.com"
        />
        <Input
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          placeholder="Email subject"
        />
        <Textarea
          value={form.body}
          onChange={(e) => update('body', e.target.value)}
          placeholder="Email body"
          rows={4}
          className="resize-none"
        />
        <Button onClick={onSubmit} className="w-full shadow-lg shadow-primary/20">
          Submit Incoming Email
        </Button>
      </CardContent>
    </Card>
  )
}
