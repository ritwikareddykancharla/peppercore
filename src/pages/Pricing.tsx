import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Check } from 'lucide-react'

export default function Pricing() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      navigate('/sign-up')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              P
            </div>
            <span className="font-semibold text-lg">Pepper</span>
          </Link>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Link to="/dashboard" className="btn-primary text-sm">
                Dashboard
              </Link>
            ) : (
              <Link to="/sign-in" className="btn-primary text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Pricing</p>
          <h1 className="text-display-2 mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One plan, everything included. No hidden fees. Cancel anytime.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-xl border border-border p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold">Pro</h3>
                <span className="tag tag-primary">Popular</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-semibold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited email handling',
                  'Invoice and payment tracking',
                  'Smart scheduling assistant',
                  'Custom policies and rules',
                  'AI-powered classification',
                  'Priority support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="btn-primary w-full text-center"
              >
                {loading ? 'Loading...' : isSignedIn ? 'Subscribe Now' : 'Get Started'}
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <p className="text-2xl font-semibold text-primary">14-day</p>
              <p className="text-sm text-muted-foreground">Free trial</p>
            </div>
            <div className="p-4 border-x border-border">
              <p className="text-2xl font-semibold text-primary">No</p>
              <p className="text-sm text-muted-foreground">Hidden fees</p>
            </div>
            <div className="p-4">
              <p className="text-2xl font-semibold text-primary">Cancel</p>
              <p className="text-sm text-muted-foreground">Anytime</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Copyright 2026 Pepper Ops. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
