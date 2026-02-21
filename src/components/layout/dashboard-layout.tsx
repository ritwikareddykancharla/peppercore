import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-[260px] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
