import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Mail, Clock, ArrowRight, Zap, Calendar } from 'lucide-react'

const steps = [
  { num: 1, title: 'Detect', description: 'Pepper receives signals from your tools in real time.' },
  { num: 2, title: 'Classify', description: 'What is this? Who sent it? Why does it matter?' },
  { num: 3, title: 'Contextualize', description: 'Pulls everything it knows about this person and situation.' },
  { num: 4, title: 'Decide', description: 'Determines the optimal action with a confidence score.' },
  { num: 5, title: 'Execute', description: 'Acts immediately or escalates with full context.' },
]

const capabilities = [
  {
    id: 'email',
    title: 'Email Operations',
    heading: 'Your inbox, managed by intelligence',
    description: 'Pepper reads every incoming email, understands what it\'s asking for, and acts. No email sits unaddressed. No lead waits 6 hours for a reply.',
    features: [
      'New leads get warm, personalized responses within minutes',
      'Client questions answered with full context from their history',
      'Complex questions escalate to you with a draft ready',
    ],
  },
  {
    id: 'scheduling',
    title: 'Scheduling',
    heading: 'Scheduling that runs itself',
    description: 'The back-and-forth of finding a time costs more in mental energy than the meeting itself. Pepper handles the entire scheduling surface.',
    features: [
      'Meeting requests handled automatically with your preferences',
      'Cancellations detected and rescheduled without you knowing',
      'Conflicts flagged before they become problems',
    ],
  },
  {
    id: 'revenue',
    title: 'Revenue',
    heading: 'Revenue leakage, stopped',
    description: 'Most small businesses don\'t realize how much money they lose because nobody followed up at the right time. Pepper monitors every invoice.',
    features: [
      'Reminders escalate appropriately — friendly to firm',
      'Payment history informs tone and timing',
      'You see the result — invoice paid — without being involved',
    ],
  },
]

const activityItems = [
  { icon: 'check', text: 'Follow-up sent to Sarah M.', time: '2 min ago', color: 'green' },
  { icon: 'mail', text: 'Invoice #892 reminder sent', time: '15 min ago', color: 'accent' },
  { icon: 'calendar', text: 'Meeting confirmed with David K.', time: '1 hour ago', color: 'blue' },
]

export default function Landing() {
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState('email')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollProgress = Math.min(scrollY / 3000, 1)

  return (
    <div className="min-h-screen bg-bg text-fg overflow-x-hidden">
      <div className="grain" />
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-display text-sm">P</div>
            <span className="font-body font-medium text-lg tracking-tight">Pepper</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="font-body text-sm text-muted hover:text-fg transition-colors">How it works</a>
            <a href="#capabilities" className="font-body text-sm text-muted hover:text-fg transition-colors">Capabilities</a>
            <a href="#pricing" className="font-body text-sm text-muted hover:text-fg transition-colors">Pricing</a>
            <Link to="/dashboard" className="btn-primary bg-fg text-bg px-5 py-2.5 rounded-full font-body text-sm font-medium">
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-bg border-b border-border px-6 py-4 space-y-4">
            <a href="#how-it-works" className="block font-body text-sm text-muted hover:text-fg transition-colors">How it works</a>
            <a href="#capabilities" className="block font-body text-sm text-muted hover:text-fg transition-colors">Capabilities</a>
            <a href="#pricing" className="block font-body text-sm text-muted hover:text-fg transition-colors">Pricing</a>
            <Link to="/dashboard" className="block btn-primary bg-fg text-bg px-5 py-2.5 rounded-full font-body text-sm font-medium text-center">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-warm/50 rounded-full blur-2xl animate-float" style={{ animationDelay: '-2s' }} />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-linen rounded-full blur-xl animate-float" style={{ animationDelay: '-4s' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl">
            <p className="fade-up font-body text-muted text-sm tracking-widest uppercase mb-6">
              Autonomous Operations
            </p>

            <h1 className="fade-up delay-1 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8">
              Your business,<br />
              <span className="italic text-muted">run by itself.</span>
            </h1>

            <p className="fade-up delay-2 font-body text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
              Pepper connects to your tools and runs your operations continuously —
              emails sent, invoices chased, meetings booked — without you asking.
              Five minutes a day. Everything else handled.
            </p>

            <div className="fade-up delay-3 flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard" className="btn-primary bg-fg text-bg px-8 py-4 rounded-full font-body font-medium text-base text-center">
                Start Free Trial
              </Link>
              <button className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-border hover:border-muted transition-colors font-body">
                <span>Watch Demo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="fade-up delay-4 mt-16 flex items-center gap-8 text-muted">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-body text-sm">2,847 businesses running</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <span className="hidden sm:block font-body text-sm">4.9/5 from 380 reviews</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-warm/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="fade-up font-body text-accent text-sm tracking-widest uppercase mb-4">The Problem</p>
            <h2 className="fade-up delay-1 font-display text-3xl md:text-5xl leading-tight mb-8">
              There is a moment every<br />small business owner knows.
            </h2>
          </div>

          <div className="fade-up delay-2 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 md:p-12 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-linen rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

              <p className="font-body text-lg md:text-xl leading-relaxed text-muted mb-8">
                It's 11pm. The work that actually grows the business — the creative work,
                the strategic work, the reason you started this thing — is untouched.
                Instead you spent the day answering emails, chasing invoices, rescheduling meetings.
              </p>

              <p className="font-body text-lg md:text-xl leading-relaxed text-muted mb-8">
                And the cruel irony is: <span className="text-fg font-medium">none of that work required you.</span>
                It required someone. But not specifically you.
              </p>

              <div className="pt-8 border-t border-border">
                <p className="font-body text-base text-muted">
                  Large companies solved this with operations managers and chiefs of staff.
                  Small businesses can't afford that. So the founder becomes the ops manager.
                  And the business suffers for it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <p className="fade-up font-body text-accent text-sm tracking-widest uppercase mb-4">What Pepper Is</p>
              <h2 className="fade-up delay-1 font-display text-3xl md:text-4xl leading-tight mb-8">
                An autonomous operations system that runs your business in the background.
              </h2>

              <div className="fade-up delay-2 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-linen flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-body font-medium mb-1">Connects to your tools</h3>
                    <p className="font-body text-muted text-sm">Gmail, Stripe, Google Calendar — works with what you already use.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-linen flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-body font-medium mb-1">Runs continuously</h3>
                    <p className="font-body text-muted text-sm">Not when you ask. Always. In the background. Without prompting.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-linen flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-body font-medium mb-1">Acts on your behalf</h3>
                    <p className="font-body text-muted text-sm">Emails sent, meetings booked, invoices chased — in your voice, by your rules.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-up delay-3 relative">
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl shadow-fg/5">
                <div className="bg-warm px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="font-body text-xs text-muted">Dashboard — Today</span>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-bg rounded-lg p-4">
                      <p className="font-body text-xs text-muted mb-1">Actions Today</p>
                      <p className="font-display text-2xl">47</p>
                    </div>
                    <div className="bg-bg rounded-lg p-4">
                      <p className="font-body text-xs text-muted mb-1">Pending</p>
                      <p className="font-display text-2xl">3</p>
                    </div>
                    <div className="bg-bg rounded-lg p-4">
                      <p className="font-body text-xs text-muted mb-1">Time Saved</p>
                      <p className="font-display text-2xl">4.2h</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activityItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-bg rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.color === 'green' ? 'bg-green-100' : item.color === 'accent' ? 'bg-accent/10' : 'bg-blue-100'
                        }`}>
                          {item.icon === 'check' && <Check className="w-3.5 h-3.5 text-green-500" />}
                          {item.icon === 'mail' && <Mail className="w-3.5 h-3.5 text-accent" />}
                          {item.icon === 'calendar' && <Calendar className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm truncate">{item.text}</p>
                          <p className="font-body text-xs text-muted">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-fg text-bg px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-body text-xs font-medium">All systems running</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 md:py-32 bg-warm/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="fade-up font-body text-accent text-sm tracking-widest uppercase mb-4">How It Works</p>
            <h2 className="fade-up delay-1 font-display text-3xl md:text-5xl leading-tight mb-6">
              The five-step loop
            </h2>
            <p className="fade-up delay-2 font-body text-muted text-lg">
              Every event runs through this loop — a new email, an overdue invoice, an abandoned cart.
              Pepper detects, understands, decides, and acts.
            </p>
          </div>

          <div className="fade-up delay-3 relative max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`rounded-xl p-6 cursor-pointer border transition-all ${
                    activeStep === i
                      ? 'bg-card border-accent/30 scale-[1.02]'
                      : 'border-transparent hover:border-border'
                  }`}
                  onMouseEnter={() => setActiveStep(i)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors font-body font-medium ${
                    activeStep === i ? 'bg-accent text-white' : 'bg-linen'
                  }`}>
                    {step.num}
                  </div>
                  <h3 className="font-display text-xl mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-muted">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-card rounded-2xl border border-border p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 font-display">
                  {steps[activeStep].num}
                </div>
                <div>
                  <h3 className="font-display text-xl mb-2">{steps[activeStep].title}</h3>
                  <p className="font-body text-muted">{steps[activeStep].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="fade-up font-body text-accent text-sm tracking-widest uppercase mb-4">Capabilities</p>
            <h2 className="fade-up delay-1 font-display text-3xl md:text-5xl leading-tight">
              What Pepper handles every day
            </h2>
          </div>

          <div className="fade-up delay-2 flex flex-wrap justify-center gap-4 mb-12">
            {capabilities.map((cap) => (
              <button
                key={cap.id}
                onClick={() => setActiveTab(cap.id)}
                className={`font-body text-sm py-2 px-1 transition-colors relative ${
                  activeTab === cap.id ? 'text-fg' : 'text-muted'
                }`}
              >
                {cap.title}
                {activeTab === cap.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>

          <div className="fade-up delay-3">
            {capabilities.map((cap) => (
              <div key={cap.id} className={`grid md:grid-cols-2 gap-8 items-center ${activeTab === cap.id ? '' : 'hidden'}`}>
                <div className="order-2 md:order-1">
                  <h3 className="font-display text-2xl md:text-3xl mb-6">{cap.heading}</h3>
                  <p className="font-body text-muted mb-6">{cap.description}</p>
                  <ul className="space-y-4">
                    {cap.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="font-body text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-1 md:order-2 bg-card rounded-2xl p-6 border border-border">
                  <div className="space-y-4">
                    <div className="bg-bg rounded-lg p-4">
                      <p className="font-body text-xs text-muted mb-2">Incoming request</p>
                      <p className="font-body text-sm text-muted">"Hi, I saw your pricing page and had a question about..."</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                    <div className="bg-bg rounded-lg p-4 border-l-2 border-accent">
                      <p className="font-body text-xs text-muted mb-2">Pepper action</p>
                      <p className="font-body text-sm mb-1 font-medium">"Hi there, great to hear from you! Thanks for reaching out..."</p>
                      <p className="font-body text-xs text-muted mt-2">Contact created. Follow-up scheduled.</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 md:py-32 bg-warm/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="fade-up font-body text-accent text-sm tracking-widest uppercase mb-4">Pricing</p>
            <h2 className="fade-up delay-1 font-display text-3xl md:text-5xl leading-tight mb-6">
              Simple, transparent pricing
            </h2>
            <p className="fade-up delay-2 font-body text-muted text-lg">
              One plan, everything included. No hidden fees.
            </p>
          </div>

          <div className="fade-up delay-3 max-w-md mx-auto">
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
                  {['Unlimited email handling', 'Invoice and payment tracking', 'Smart scheduling assistant', 'Custom policies and rules', 'Priority support'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="font-body text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/dashboard"
                  className="btn-primary block text-center px-8 py-4 bg-fg text-bg font-medium rounded-full"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="fade-up font-display text-4xl md:text-5xl mb-6">Ready to Save Hours Every Week?</h2>
          <p className="fade-up delay-1 font-body text-xl text-muted mb-10 max-w-2xl mx-auto">
            Join thousands of small business owners who have automated their operations with Pepper.
          </p>
          <Link
            to="/dashboard"
            className="fade-up delay-2 btn-primary inline-block px-10 py-5 bg-fg text-bg font-medium rounded-full text-lg"
          >
            Try Demo Free
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-display text-sm">P</div>
                <span className="font-body font-medium text-lg">Pepper</span>
              </div>
              <p className="text-muted font-body text-sm">Autonomous Operations for Small Business</p>
            </div>
            <div>
              <h4 className="font-body font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#capabilities" className="text-muted hover:text-fg transition-colors font-body text-sm">Features</a></li>
                <li><a href="#pricing" className="text-muted hover:text-fg transition-colors font-body text-sm">Pricing</a></li>
                <li><Link to="/dashboard" className="text-muted hover:text-fg transition-colors font-body text-sm">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-body font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted hover:text-fg transition-colors font-body text-sm">About</a></li>
                <li><a href="#" className="text-muted hover:text-fg transition-colors font-body text-sm">Blog</a></li>
                <li><a href="#" className="text-muted hover:text-fg transition-colors font-body text-sm">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-body font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted hover:text-fg transition-colors font-body text-sm">Privacy</a></li>
                <li><a href="#" className="text-muted hover:text-fg transition-colors font-body text-sm">Terms</a></li>
              </ul>
            </div>
          </div>
          <p className="text-center text-muted text-sm font-body">
            Copyright 2026 Pepper Ops. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #C47D5E, #D4A088);
          z-index: 1001;
          transform-origin: left;
        }
        
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>
    </div>
  )
}
