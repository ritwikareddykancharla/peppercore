import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Clock, Mail, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  { num: 1, title: 'Detect', description: 'Pepper receives signals from your tools in real time.' },
  { num: 2, title: 'Classify', description: 'What is this? Who sent it? Why does it matter?' },
  { num: 3, title: 'Contextualize', description: 'Pulls everything it knows about this person and situation.' },
  { num: 4, title: 'Decide', description: 'Determines the optimal action with a confidence score.' },
  { num: 5, title: 'Execute', description: 'Acts immediately or escalates with full context.' },
]

const capabilities = [
  {
    icon: Mail,
    title: 'Email Operations',
    description: 'Your inbox, managed by intelligence. No email sits unaddressed.',
    features: ['Auto-responses to leads', 'Context-aware replies', 'Smart escalation'],
  },
  {
    icon: DollarSign,
    title: 'Revenue',
    description: 'Stop revenue leakage. Track invoices and send timely reminders.',
    features: ['Payment reminders', 'Invoice tracking', 'Collection automation'],
  },
  {
    icon: Clock,
    title: 'Scheduling',
    description: 'Meeting requests handled automatically with your preferences.',
    features: ['Auto-scheduling', 'Conflict detection', 'Calendar sync'],
  },
]

const metrics = [
  { value: '94%', label: 'Automation rate' },
  { value: '2.4h', label: 'Avg response time' },
  { value: '4.2k', label: 'Businesses running' },
  { value: '$2.1M', label: 'Revenue recovered' },
]

export default function Landing() {
  const [activeStep, setActiveStep] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0)
  const typeWords = ['analytical', 'autonomous', 'intelligent', 'efficient']
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const currentWord = typeWords[currentTypeIndex]
    let charIndex = 0
    
    const typeInterval = setInterval(() => {
      if (charIndex <= currentWord.length) {
        setTypedText(currentWord.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setCurrentTypeIndex((prev) => (prev + 1) % typeWords.length)
          setTypedText('')
        }, 1500)
      }
    }, 80)
    
    return () => clearInterval(typeInterval)
  }, [currentTypeIndex])

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

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#capabilities" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Capabilities
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <Link to="/dashboard" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>

          <button 
            className="md:hidden p-2 hover:bg-muted rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border px-6 py-4 space-y-4">
            <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground">How it works</a>
            <a href="#capabilities" className="block text-sm text-muted-foreground hover:text-foreground">Capabilities</a>
            <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground">Pricing</a>
            <Link to="/dashboard" className="btn-primary block text-center text-sm">Get Started</Link>
          </div>
        )}
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-widest mb-6">
                Autonomous Operations
              </p>
              <h1 className="text-display-2 mb-6">
                Your business,<br />
                <span className="text-muted-foreground italic">run by itself.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Pepper connects to your tools and runs your operations continuously —
                emails sent, invoices chased, meetings booked — without you asking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="btn-primary text-center">
                  Start Free Trial
                </Link>
                <button className="btn-secondary flex items-center justify-center gap-2">
                  <span>Watch Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="code-window">
                <div className="code-window-header">
                  <div className="code-window-dot bg-red-400" />
                  <div className="code-window-dot bg-yellow-400" />
                  <div className="code-window-dot bg-green-400" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">pepper-ops.sh</span>
                </div>
                <div className="code-window-content">
                  <pre className="text-sm">
                    <code>
                      <span className="text-muted-foreground"># Pepper is </span>
                      <span className="text-primary font-medium">{typedText}</span>
                      <span className="animate-type">|</span>
                      <br /><br />
                      <span className="text-muted-foreground"># Auto-process emails</span><br />
                      <span className="text-primary">pepper</span> process emails --auto<br /><br />
                      <span className="text-muted-foreground"># Chase overdue invoices</span><br />
                      <span className="text-primary">pepper</span> invoices remind --escalate<br /><br />
                      <span className="text-muted-foreground"># Schedule meetings</span><br />
                      <span className="text-primary">pepper</span> schedule --preferences
                    </code>
                  </pre>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium shadow-glow-primary">
                <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                All systems running
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-3xl font-semibold text-primary mb-1">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">How It Works</p>
            <h2 className="text-display-3 mb-4">The five-step loop</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every event runs through this loop — a new email, an overdue invoice, an abandoned cart.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {steps.map((step, i) => (
              <button
                key={step.num}
                className={cn(
                  'rounded-xl p-6 text-left transition-all border',
                  activeStep === i
                    ? 'bg-card border-primary/30 shadow-medium'
                    : 'border-transparent hover:border-border'
                )}
                onMouseEnter={() => setActiveStep(i)}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-4 font-semibold transition-colors',
                  activeStep === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {step.num}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="capabilities" className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Capabilities</p>
            <h2 className="text-display-3">What Pepper handles every day</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div key={cap.title} className="bg-card rounded-xl border border-border p-8 hover:border-primary/20 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-6">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{cap.title}</h3>
                  <p className="text-muted-foreground mb-6">{cap.description}</p>
                  <ul className="space-y-3">
                    {cap.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="text-display-3 mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">One plan, everything included. No hidden fees.</p>
          </div>

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
                  {['Unlimited email handling', 'Invoice and payment tracking', 'Smart scheduling assistant', 'Custom policies and rules', 'Priority support'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/dashboard" className="btn-primary w-full block text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-display-3 mb-6">Ready to save hours every week?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of small business owners who have automated their operations with Pepper.
          </p>
          <Link to="/dashboard" className="btn-primary text-base">
            Try Demo Free
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  P
                </div>
                <span className="font-semibold text-lg">Pepper</span>
              </div>
              <p className="text-sm text-muted-foreground">Autonomous Operations for Small Business</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#capabilities" className="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Copyright 2026 Pepper Ops. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
