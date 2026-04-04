import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Leaf, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const DEMO_USERS = [
  { email: 'farmer@agrosense.ai', password: 'agro1234', name: 'Demo Farmer' },
]

const UI_TEXT = {
  en: {
    platform: 'AI Platform',
    signIn: 'Sign In',
    signUp: 'Create Account',
    welcome: 'Welcome back',
    join: 'Join AgroSense',
    signInDesc: 'Sign in to access AI crop analysis',
    signUpDesc: 'Create your free account to get started',
    fullName: 'Full name',
    email: 'Email address',
    password: 'Password',
    signingIn: 'Signing in...',
    creating: 'Creating account...',
    demo: 'Demo:',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    createOne: 'Create one',
    signInLink: 'Sign in',
    fillFields: 'Fill in all fields',
    validEmail: 'Enter a valid email address',
    passwordLength: 'Password must be at least 6 characters',
    welcomeBack: 'Welcome back,',
    accountCreated: 'Account created! Welcome,',
  },
  hi: {
    platform: 'एआई प्लेटफॉर्म',
    signIn: 'साइन इन',
    signUp: 'खाता बनाएं',
    welcome: 'वापसी पर स्वागत है',
    join: 'AgroSense से जुड़ें',
    signInDesc: 'एआई फसल विश्लेषण के लिए साइन इन करें',
    signUpDesc: 'शुरू करने के लिए अपना मुफ्त खाता बनाएं',
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    signingIn: 'साइन इन हो रहा है...',
    creating: 'खाता बनाया जा रहा है...',
    demo: 'डेमो:',
    noAccount: 'क्या आपका खाता नहीं है?',
    haveAccount: 'क्या पहले से खाता है?',
    createOne: 'खाता बनाएं',
    signInLink: 'साइन इन',
    fillFields: 'सभी फ़ील्ड भरें',
    validEmail: 'मान्य ईमेल पता दर्ज करें',
    passwordLength: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
    welcomeBack: 'वापसी पर स्वागत है,',
    accountCreated: 'खाता बन गया! स्वागत है,',
  },
  mr: {
    platform: 'एआय प्लॅटफॉर्म',
    signIn: 'साइन इन',
    signUp: 'खाते तयार करा',
    welcome: 'पुन्हा स्वागत आहे',
    join: 'AgroSense मध्ये सामील व्हा',
    signInDesc: 'एआय पीक विश्लेषणासाठी साइन इन करा',
    signUpDesc: 'सुरुवात करण्यासाठी मोफत खाते तयार करा',
    fullName: 'पूर्ण नाव',
    email: 'ईमेल पत्ता',
    password: 'पासवर्ड',
    signingIn: 'साइन इन होत आहे...',
    creating: 'खाते तयार होत आहे...',
    demo: 'डेमो:',
    noAccount: 'खाते नाही?',
    haveAccount: 'आधीपासून खाते आहे?',
    createOne: 'खाते तयार करा',
    signInLink: 'साइन इन',
    fillFields: 'सर्व फील्ड भरा',
    validEmail: 'वैध ईमेल पत्ता टाका',
    passwordLength: 'पासवर्ड किमान 6 अक्षरांचा असावा',
    welcomeBack: 'पुन्हा स्वागत आहे,',
    accountCreated: 'खाते तयार झाले! स्वागत आहे,',
  },
  te: {
    platform: 'ఎఐ ప్లాట్‌ఫార్మ్',
    signIn: 'సైన్ ఇన్',
    signUp: 'ఖాతా సృష్టించండి',
    welcome: 'తిరిగి స్వాగతం',
    join: 'AgroSense లో చేరండి',
    signInDesc: 'ఏఐ పంట విశ్లేషణ కోసం సైన్ ఇన్ చేయండి',
    signUpDesc: 'ప్రారంభించడానికి మీ ఉచిత ఖాతా సృష్టించండి',
    fullName: 'పూర్తి పేరు',
    email: 'ఈమెయిల్ చిరునామా',
    password: 'పాస్‌వర్డ్',
    signingIn: 'సైన్ ఇన్ అవుతోంది...',
    creating: 'ఖాతా సృష్టించబడుతోంది...',
    demo: 'డెమో:',
    noAccount: 'ఖాతా లేదా?',
    haveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    createOne: 'ఒకటి సృష్టించండి',
    signInLink: 'సైన్ ఇన్',
    fillFields: 'అన్ని ఫీల్డ్‌లు పూరించండి',
    validEmail: 'చెల్లుబాటు అయ్యే ఈమెయిల్ చిరునామా నమోదు చేయండి',
    passwordLength: 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి',
    welcomeBack: 'తిరిగి స్వాగతం,',
    accountCreated: 'ఖాతా సృష్టించబడింది! స్వాగతం,',
  },
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin', lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const { signIn } = useAuth()
  const [tab, setTab] = useState(defaultTab)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    setTab(defaultTab)
  }, [defaultTab])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error(t.fillFields); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))

    const demo = DEMO_USERS.find((u) => u.email === form.email && u.password === form.password)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

    if (!emailValid) {
      toast.error(t.validEmail)
      setLoading(false)
      return
    }

    const userData = demo
      ? { name: demo.name, email: demo.email, avatar: demo.name[0].toUpperCase() }
      : { name: form.email.split('@')[0], email: form.email, avatar: form.email[0].toUpperCase() }

    signIn(userData)
    toast.success(`${t.welcomeBack} ${userData.name}!`)
    setLoading(false)
    onClose()
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error(t.fillFields); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error(t.validEmail); return }
    if (form.password.length < 6) { toast.error(t.passwordLength); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))

    const userData = { name: form.name, email: form.email, avatar: form.name[0].toUpperCase() }
    signIn(userData)
    toast.success(`${t.accountCreated} ${form.name}!`)
    setLoading(false)
    onClose()
  }

  const switchTab = (nextTab) => {
    setTab(nextTab)
    setForm({ name: '', email: '', password: '' })
    setShowPass(false)
  }

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
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 260, height: 2, background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)' }} />

            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl transition-colors" style={{ color: '#4d7a62', background: 'rgba(255,255,255,0.04)' }}>
              <X size={16} />
            </button>

            <div className="p-8 pt-7">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                  <Leaf size={16} style={{ color: '#022c22' }} />
                </div>
                <div>
                  <span className="font-display text-sm font-bold block" style={{ color: '#ddeee5' }}>AgroSense</span>
                  <span className="text-[9px] font-mono tracking-widest uppercase block" style={{ color: '#2d5040' }}>{t.platform}</span>
                </div>
              </div>

              <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['signin', 'signup'].map((item) => (
                  <button
                    key={item}
                    onClick={() => switchTab(item)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={tab === item ? { background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' } : { color: '#5a7a68' }}
                  >
                    {item === 'signin' ? t.signIn : t.signUp}
                  </button>
                ))}
              </div>

              <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#ddeee5' }}>
                {tab === 'signin' ? t.welcome : t.join}
              </h2>
              <p className="text-sm mb-6" style={{ color: '#4d7a62' }}>
                {tab === 'signin' ? t.signInDesc : t.signUpDesc}
              </p>

              <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="space-y-3">
                {tab === 'signup' && (
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4d7a62' }} />
                    <input
                      type="text"
                      placeholder={t.fullName}
                      value={form.name}
                      onChange={set('name')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(52,211,153,0.15)', color: '#ddeee5', fontFamily: 'DM Sans, sans-serif' }}
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4d7a62' }} />
                  <input
                    type="email"
                    placeholder={t.email}
                    value={form.email}
                    onChange={set('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(52,211,153,0.15)', color: '#ddeee5', fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>

                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4d7a62' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder={t.password}
                    value={form.password}
                    onChange={set('password')}
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(52,211,153,0.15)', color: '#ddeee5', fontFamily: 'DM Sans, sans-serif' }}
                  />
                  <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4d7a62' }}>
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
                  {loading ? <><Loader2 size={16} className="animate-spin" /> {tab === 'signin' ? t.signingIn : t.creating}</> : <>{tab === 'signin' ? t.signIn : t.signUp} <ArrowRight size={16} /></>}
                </button>
              </form>

              {tab === 'signin' && (
                <div className="mt-4 p-3 rounded-xl text-xs text-center" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.1)', color: '#4d7a62' }}>
                  {t.demo} <span style={{ color: '#34d399' }}>farmer@agrosense.ai</span> / <span style={{ color: '#34d399' }}>agro1234</span>
                </div>
              )}

              <p className="text-center text-xs mt-4" style={{ color: '#4d7a62' }}>
                {tab === 'signin' ? `${t.noAccount} ` : `${t.haveAccount} `}
                <button onClick={() => switchTab(tab === 'signin' ? 'signup' : 'signin')} style={{ color: '#34d399' }}>
                  {tab === 'signin' ? t.createOne : t.signInLink}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
