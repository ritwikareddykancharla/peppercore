import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import Landing from './pages/Landing'
import DashboardOverview from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Integrations from './pages/Integrations'
import Pricing from './pages/Pricing'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/dashboard" 
        element={
          <>
            <SignedIn>
              <DashboardLayout />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/pricing" element={<Pricing />} />
      <Route 
        path="/sign-in" 
        element={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" redirectUrl="/dashboard" />
          </div>
        } 
      />
      <Route 
        path="/sign-up" 
        element={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" redirectUrl="/dashboard" />
          </div>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
