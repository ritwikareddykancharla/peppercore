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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Policy</DialogTitle>
          <DialogDescription>
            Define a rule for how Pepper handles your operations automatically.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="e.g., Always respond to new leads within 15 minutes."
          rows={3}
          className="resize-none"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!value.trim()}>
            Add Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
