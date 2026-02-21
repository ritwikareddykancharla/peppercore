import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { ArrowLeft, CreditCard, Settings as SettingsIcon, Shield } from 'lucide-react'
import { AppNavbar } from '@/components/layout/app-navbar'

interface UserData {
  id: string
  email: string
  name: string
  plan: string
  stripeCustomerId: string | null
  stripeCurrentPeriodEnd: string | null
}

export default function Settings() {
  const { isLoaded, signOut } = useAuth()
  const { user } = useUser()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)

  useState(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUserData(data.user))
      .catch(console.error)
  })

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing-portal', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return <div className="min-h-screen bg-bg flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppNavbar subtitle="Settings" />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted hover:text-fg mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-sm">Back</span>
        </button>

        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <SettingsIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg">Account</h2>
                <p className="text-xs text-muted">Your account details</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted">Name</label>
                <p className="font-body mt-1">{user?.fullName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted">Email</label>
                <p className="font-body mt-1">{user?.primaryEmailAddress?.emailAddress || userData?.email}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted">Plan</label>
                <p className="font-body mt-1 capitalize">{userData?.plan || 'free'}</p>
              </div>
              {userData?.stripeCurrentPeriodEnd && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-muted">Next billing date</label>
                  <p className="font-body mt-1">
                    {new Date(userData.stripeCurrentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg">Billing</h2>
                <p className="text-xs text-muted">Manage your subscription</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {userData?.plan === 'pro' ? (
                <button
                  onClick={handleManageBilling}
                  disabled={loading}
                  className="btn-primary w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Manage Billing'}
                </button>
              ) : (
                <Link
                  to="/pricing"
                  className="btn-primary block text-center w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="font-display text-lg">Danger Zone</h2>
                <p className="text-xs text-muted">Irreversible actions</p>
              </div>
            </div>
            
            <button
              onClick={() => signOut()}
              className="rounded-xl border-2 border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
