import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppNavbarProps {
  subtitle?: string
}

export function AppNavbar({ subtitle = 'Revenue and operations control center' }: AppNavbarProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-border/50 bg-charcoal/95 backdrop-blur-md text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-xl font-semibold shadow-lg shadow-accent/20">
            P
          </div>
          <div>
            <h1 className="font-display text-xl">Pepper Ops</h1>
            <p className="text-xs text-white/50">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-white">
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  )
}
