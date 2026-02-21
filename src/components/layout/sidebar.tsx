import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { 
  LayoutDashboard, 
  BarChart3, 
  Plug, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Mail,
  FileText,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const quickLinks = [
  { name: 'Inbox', href: '/dashboard?section=inbox', icon: Mail, badge: 3 },
  { name: 'Invoices', href: '/dashboard?section=invoices', icon: FileText, badge: 2 },
  { name: 'Notifications', href: '/dashboard?section=notifications', icon: Bell, badge: 5 },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' && !location.search
    }
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      <div className="flex h-full flex-col">
        <div className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                P
              </div>
              <span className="font-semibold text-lg text-sidebar-foreground">Pepper</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              P
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Navigation
              </p>
            )}
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'sidebar-link',
                    isActive(item.href) && 'sidebar-link-active',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </div>

          {!collapsed && (
            <div className="mt-6">
              <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quick Links
              </p>
              <div className="space-y-1">
                {quickLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="sidebar-link justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className={cn(
            'flex items-center',
            collapsed ? 'flex-col gap-3' : 'justify-between'
          )}>
            {!collapsed && (
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 rounded-full"
                  }
                }} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">Account</p>
                  <p className="text-xs text-muted-foreground truncate">Manage profile</p>
                </div>
              </div>
            )}
            {collapsed && (
              <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  avatarBox: "h-9 w-9 rounded-full"
                }
              }} />
            )}
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </aside>
  )
}
