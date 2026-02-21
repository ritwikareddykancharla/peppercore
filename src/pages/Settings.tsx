import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { ArrowLeft, CreditCard, Shield, User, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUserData(data.user))
      .catch(console.error)
  }, [])

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
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
                <p className="mt-1 font-medium">{user?.fullName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                <p className="mt-1 font-medium">{user?.primaryEmailAddress?.emailAddress || userData?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plan</label>
                <p className="mt-1">
                  <span className="tag tag-primary capitalize">{userData?.plan || 'free'}</span>
                </p>
              </div>
              {userData?.stripeCurrentPeriodEnd && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Next billing</label>
                  <p className="mt-1 font-medium">
                    {new Date(userData.stripeCurrentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Billing</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {userData?.plan === 'pro' ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pro Plan</p>
                  <p className="text-sm text-muted-foreground">$99/month</p>
                </div>
                <Button
                  onClick={handleManageBilling}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Loading...' : 'Manage Billing'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Free Plan</p>
                  <p className="text-sm text-muted-foreground">Upgrade for more features</p>
                </div>
                <Link to="/pricing">
                  <Button className="btn-primary">Upgrade to Pro</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your operations</p>
              </div>
              <button className="relative h-6 w-10 rounded-full bg-primary transition-colors">
                <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform translate-x-0" />
              </button>
            </div>
            <div className="divider-h" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Get a summary of your automation activity</p>
              </div>
              <button className="relative h-6 w-10 rounded-full bg-muted transition-colors">
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card border-destructive/20">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                <Shield className="h-4 w-4 text-destructive" />
              </div>
              <CardTitle className="text-base font-semibold text-destructive">Danger Zone</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
