import { Zap, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Add Incoming Email</CardTitle>
            <p className="text-xs text-muted-foreground">Simulate new inbound traffic</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Input
          value={form.sender}
          onChange={(e) => update('sender', e.target.value)}
          placeholder="Sender name"
          className="input-field"
        />
        <Input
          value={form.senderEmail}
          onChange={(e) => update('senderEmail', e.target.value)}
          placeholder="sender@company.com"
          type="email"
          className="input-field"
        />
        <Input
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          placeholder="Email subject"
          className="input-field"
        />
        <Textarea
          value={form.body}
          onChange={(e) => update('body', e.target.value)}
          placeholder="Email body..."
          rows={3}
          className="resize-none input-field"
        />
        <Button onClick={onSubmit} className="btn-primary w-full gap-2">
          <Send className="h-4 w-4" />
          Submit Incoming Email
        </Button>
      </CardContent>
    </Card>
  )
}
