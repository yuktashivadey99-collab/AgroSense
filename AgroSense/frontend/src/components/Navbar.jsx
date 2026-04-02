import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Menu, X, Globe, ChevronDown, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

const navItems = [
  { label: 'Diagnose', path: '/diagnose' },
  { label: 'Weather', path: '/weather' },
  { label: 'History', path: '/history' },
  { label: 'About', path: '/about' },
]

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

export default function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [authModal, setAuthModal] = useState({ open: false, tab: 'signin' })
  const location = useLocation()
  const { user, signOut } = useAuth()
  const userRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setLangOpen(false); setUserOpen(false) }, [location])

  // Close user dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
  const openAuth = (tab = 'signin') => { setAuthModal({ open: true, tab }); setMobileOpen(false) }

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-em-950/30 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-em-600 to-em-400 flex items-center justify-center group-hover:shadow-[0_0_22px_rgba(52,211,153,0.55)] transition-all duration-300">
                <Leaf size={16} style={{ color: '#022c22' }} />
              </div>
              <div className="absolute -inset-1 bg-em-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="font-display text-base font-700 text-glow block leading-tight">AgroSense</span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase block" style={{ color: '#2d5040' }}>AI Platform</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ label, path }) => (
              <Link key={path} to={path} className={`nav-link ${location.pathname === path ? 'active' : ''}`}>
                {label}
                {location.pathname === path && (
                  <motion.span
                    layoutId="nav-ul"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-em-400 to-transparent"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-sm text-xs font-mono hover:border-em-400/30 transition-all"
                style={{ color: '#6ee7b7' }}
              >
                <Globe size={12} style={{ color: '#34d399' }} />
                <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-full mt-2 w-44 glass-bright shadow-2xl overflow-hidden z-50"
                    style={{ borderRadius: '14px' }}
                  >
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                          lang === l.code
                            ? 'bg-em-400/12 text-em-400'
                            : 'text-ink-200 hover:bg-em-400/08'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                        {lang === l.code && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-em-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Area */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass-sm transition-all hover:border-em-400/30"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-display"
                    style={{ background: 'linear-gradient(135deg, #059669, #34d399)', color: '#022c22' }}>
                    {user.avatar}
                  </div>
                  <span className="text-sm font-medium max-w-[80px] truncate" style={{ color: '#ddeee5' }}>{user.name}</span>
                  <ChevronDown size={12} style={{ color: '#4d7a62' }} className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-bright shadow-2xl z-50 overflow-hidden"
                      style={{ borderRadius: '14px' }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(52,211,153,0.1)' }}>
                        <p className="text-sm font-medium" style={{ color: '#ddeee5' }}>{user.name}</p>
                        <p className="text-xs truncate" style={{ color: '#4d7a62' }}>{user.email}</p>
                      </div>
                      <button
                        onClick={() => { signOut(); setUserOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-colors hover:bg-red-500/10"
                        style={{ color: '#f87171' }}
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('signin')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.05)' }}
                >
                  <LogIn size={14} />
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('diagnose')}
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Analyze Crop
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 transition-colors" style={{ color: '#5a7a68' }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="fixed inset-x-0 top-[60px] z-40 glass border-b border-em-950/20 md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navItems.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-3 rounded-xl text-sm font-500 transition-all ${
                    location.pathname === path
                      ? 'bg-em-400/12 text-em-400'
                      : 'text-ink-300 hover:bg-em-400/07 hover:text-em-300'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="flex flex-wrap gap-1.5 pt-2 px-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      lang === l.code
                        ? 'bg-em-400/18 text-em-400 border border-em-400/30'
                        : 'glass-sm text-ink-400'
                    }`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
              {user ? (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(52,211,153,0.07)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #059669, #34d399)', color: '#022c22' }}>
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#ddeee5' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: '#4d7a62' }}>{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all"
                    style={{ color: '#f87171', background: 'rgba(248,113,113,0.07)' }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openAuth('signin')}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium"
                    style={{ color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.05)' }}
                  >
                    <LogIn size={14} /> Sign In
                  </button>
                  <button onClick={() => openAuth('diagnose')} className="btn-primary text-sm text-center">
                    Analyze Crop
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ open: false, tab: 'signin' })}
        defaultTab={authModal.tab === 'diagnose' ? 'signin' : authModal.tab}
      />
    </>
  )
}