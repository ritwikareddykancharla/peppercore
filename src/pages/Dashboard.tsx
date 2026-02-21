import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { EmailInbox } from '@/components/dashboard/email-inbox'
import { AddEmailForm } from '@/components/dashboard/add-email-form'
import { TriageWorkspace } from '@/components/dashboard/triage-workspace'
import { InvoiceList } from '@/components/dashboard/invoice-list'
import { PoliciesPanel } from '@/components/dashboard/policies-panel'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { AddPolicyDialog } from '@/components/dashboard/add-policy-dialog'
import { useDashboard } from '@/hooks/use-dashboard'

export default function DashboardOverview() {
  const dashboard = useDashboard()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-muted-foreground">Monitor your operations at a glance</p>
      </div>

      {dashboard.requestError && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{dashboard.requestError}</AlertDescription>
        </Alert>
      )}

      <StatsCards stats={dashboard.stats} />

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-4">
          <EmailInbox
            emails={dashboard.filteredEmails}
            selectedEmailId={dashboard.selectedEmailId}
            onSelectEmail={dashboard.setSelectedEmailId}
            searchQuery={dashboard.searchQuery}
            onSearchChange={dashboard.setSearchQuery}
            emailFilter={dashboard.emailFilter}
            onFilterChange={dashboard.setEmailFilter}
            loading={dashboard.loading}
          />
          <AddEmailForm
            form={dashboard.newEmailForm}
            onFormChange={dashboard.setNewEmailForm}
            onSubmit={dashboard.submitNewEmail}
          />
        </section>

        <section className="lg:col-span-5 space-y-6">
          <TriageWorkspace
            email={dashboard.selectedEmail}
            replyDraft={dashboard.replyDraft}
            onReplyDraftChange={dashboard.setReplyDraft}
            onRespond={dashboard.respondToEmail}
            onEscalate={dashboard.escalateEmail}
          />
          <InvoiceList
            invoices={dashboard.invoices}
            onSendReminder={dashboard.sendReminder}
            onMarkPaid={dashboard.markPaid}
          />
        </section>

        <section className="space-y-6 lg:col-span-3">
          <PoliciesPanel
            policies={dashboard.policies}
            onToggle={dashboard.togglePolicy}
            onDelete={dashboard.deletePolicy}
            onAdd={() => dashboard.setShowPolicyModal(true)}
          />
          <ActivityFeed activities={dashboard.activities} />
        </section>
      </div>

      <AddPolicyDialog
        open={dashboard.showPolicyModal}
        onOpenChange={dashboard.setShowPolicyModal}
        value={dashboard.newPolicy}
        onValueChange={dashboard.setNewPolicy}
        onSubmit={dashboard.addPolicy}
      />
    </div>
  )
}
