import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
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
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <>
            <SignedIn>
              <Settings />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        } 
      />
      <Route path="/pricing" element={<Pricing />} />
      <Route 
        path="/sign-in" 
        element={
          <div className="min-h-screen bg-bg flex items-center justify-center">
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" redirectUrl="/dashboard" />
          </div>
        } 
      />
      <Route 
        path="/sign-up" 
        element={
          <div className="min-h-screen bg-bg flex items-center justify-center">
            <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" redirectUrl="/dashboard" />
          </div>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
