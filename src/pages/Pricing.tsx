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
    <div className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-display text-sm">P</div>
            <span className="font-body font-medium text-lg tracking-tight">Pepper</span>
          </Link>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Link to="/dashboard" className="btn-primary bg-fg text-bg px-5 py-2.5 rounded-full font-body text-sm font-medium">
                Dashboard
              </Link>
            ) : (
              <Link to="/sign-in" className="btn-primary bg-fg text-bg px-5 py-2.5 rounded-full font-body text-sm font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-accent text-sm tracking-widest uppercase mb-4">Pricing</p>
          <h1 className="font-display text-4xl md:text-6xl mb-6">Simple, transparent pricing</h1>
          <p className="font-body text-muted text-lg max-w-2xl mx-auto">
            One plan, everything included. No hidden fees. Cancel anytime.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-display text-2xl">Pro</h3>
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-body">Popular</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-display">$99</span>
                <span className="text-muted font-body">/month</span>
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
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="font-body text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="btn-primary w-full text-center px-8 py-4 bg-fg text-bg font-medium rounded-full disabled:opacity-50"
              >
                {loading ? 'Loading...' : isSignedIn ? 'Subscribe Now' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted text-sm font-body">
            Copyright 2026 Pepper Ops. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
