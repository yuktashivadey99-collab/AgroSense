import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Leaf, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const DEMO_USERS = [
  { email: 'farmer@agrosense.ai', password: 'agro1234', name: 'Demo Farmer' },
]

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin' }) {
  const { signIn } = useAuth()
  const [tab, setTab] = useState(defaultTab)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Fill in all fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900)) // simulate network

    // Check demo users OR accept any valid-looking credentials
    const demo = DEMO_USERS.find(u => u.email === form.email && u.password === form.password)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

    if (!emailValid) {
      toast.error('Enter a valid email address')
      setLoading(false)
      return
    }

    const userData = demo
      ? { name: demo.name, email: demo.email, avatar: demo.name[0].toUpperCase() }
      : { name: form.email.split('@')[0], email: form.email, avatar: form.email[0].toUpperCase() }

    signIn(userData)
    toast.success(`Welcome back, ${userData.name}! 🌱`)
    setLoading(false)
    onClose()
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Fill in all fields'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error('Enter a valid email'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))

    const userData = { name: form.name, email: form.email, avatar: form.name[0].toUpperCase() }
    signIn(userData)
    toast.success(`Account created! Welcome, ${form.name} 🌿`)
    setLoading(false)
    onClose()
  }

  // Reset form when switching tabs
  const switchTab = (t) => { setTab(t); setForm({ name: '', email: '', password: '' }); setShowPass(false) }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: 'rgba(5, 11, 8, 0.82)', backdropFilter: 'blur(14px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md relative"
            style={{
              background: 'rgba(10, 20, 15, 0.97)',
              border: '1px solid rgba(52, 211, 153, 0.18)',
              borderRadius: '24px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,211,153,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Top glow */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 260, height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)',
            }} />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl transition-colors"
              style={{ color: '#4d7a62', background: 'rgba(255,255,255,0.04)' }}
            >
              <X size={16} />
            </button>

            <div className="p-8 pt-7">
              {/* Logo */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                  <Leaf size={16} style={{ color: '#022c22' }} />
                </div>
                <div>
                  <span className="font-display text-sm font-bold block" style={{ color: '#ddeee5' }}>AgroSense</span>
                  <span className="text-[9px] font-mono tracking-widest uppercase block" style={{ color: '#2d5040' }}>AI Platform</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['signin', 'signup'].map(t => (
                  <button
                    key={t}
                    onClick={() => switchTab(t)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={tab === t
                      ? { background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }
                      : { color: '#5a7a68' }
                    }
                  >
                    {t === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              {/* Heading */}
              <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#ddeee5' }}>
                {tab === 'signin' ? 'Welcome back' : 'Join AgroSense'}
              </h2>
              <p className="text-sm mb-6" style={{ color: '#4d7a62' }}>
                {tab === 'signin'
                  ? 'Sign in to access AI crop analysis'
                  : 'Create your free account to get started'}
              </p>

              {/* Form */}
              <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="space-y-3">
                {tab === 'signup' && (
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4d7a62' }} />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={form.name}
                      onChange={set('name')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(52,211,153,0.15)',
                        color: '#ddeee5',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(52,211,153,0.45)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(52,211,153,0.15)'}
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4d7a62' }} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={set('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(52,211,153,0.15)',
                      color: '#ddeee5',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(52,211,153,0.45)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(52,211,153,0.15)'}
                  />
                </div>

                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4d7a62' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={form.password}
                    onChange={set('password')}
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(52,211,153,0.15)',
                      color: '#ddeee5',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(52,211,153,0.45)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(52,211,153,0.15)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#4d7a62' }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 mt-2"
                  style={{
                    background: loading ? 'rgba(52,211,153,0.15)' : 'linear-gradient(135deg, #059669, #34d399)',
                    color: loading ? '#34d399' : '#022c22',
                    border: loading ? '1px solid rgba(52,211,153,0.3)' : 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(52,211,153,0.3)',
                  }}
                >
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> {tab === 'signin' ? 'Signing in...' : 'Creating account...'}</>
                    : <>{tab === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                  }
                </button>
              </form>

              {/* Demo hint */}
              {tab === 'signin' && (
                <div className="mt-4 p-3 rounded-xl text-xs text-center" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.1)', color: '#4d7a62' }}>
                  Demo: <span style={{ color: '#34d399' }}>farmer@agrosense.ai</span> / <span style={{ color: '#34d399' }}>agro1234</span>
                </div>
              )}

              {/* Switch tab link */}
              <p className="text-center text-xs mt-4" style={{ color: '#4d7a62' }}>
                {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => switchTab(tab === 'signin' ? 'signup' : 'signin')} style={{ color: '#34d399' }}>
                  {tab === 'signin' ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}