import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import DiagnosisPage from './pages/DiagnosisPage'
import HistoryPage from './pages/HistoryPage'
import AboutPage from './pages/AboutPage'
import WeatherPage from './pages/WeatherPage'

export default function App() {
  const [lang, setLang] = useState('en')

  return (
    <AuthProvider>
      <div className="min-h-screen relative">
        {/* Subtle noise overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
            opacity: 0.4,
          }}
        />

        <Navbar lang={lang} setLang={setLang} />

        <div className="relative z-[2]">
          <Routes>
            <Route path="/"         element={<LandingPage lang={lang} />} />
            <Route path="/diagnose" element={<DiagnosisPage lang={lang} />} />
            <Route path="/weather"  element={<WeatherPage lang={lang} />} />
            <Route path="/history"  element={<HistoryPage lang={lang} />} />
            <Route path="/about"    element={<AboutPage lang={lang} />} />
          </Routes>
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(14, 26, 20, 0.95)',
              color: '#ddeee5',
              border: '1px solid rgba(52, 211, 153, 0.2)',
              borderRadius: '14px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#022c22' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#1a0810' } },
          }}
        />
      </div>
    </AuthProvider>
  )
}