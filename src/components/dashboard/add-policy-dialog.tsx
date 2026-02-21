import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface AddPolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function AddPolicyDialog({
  open,
  onOpenChange,
  value,
  onValueChange,
  onSubmit,
}: AddPolicyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New Policy</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Define a rule for how Pepper handles your operations automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="e.g., Always respond to new leads within 15 minutes."
            rows={3}
            className="resize-none input-field"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="btn-secondary">
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!value.trim()} className="btn-primary">
            Add Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
