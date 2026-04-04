import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Phone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const UI_TEXT = {
  en: {
    title: 'Sign In to AgroSense',
    subtitle: 'Access crop analysis and personalized recommendations',
    email: 'Email Address',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Create Account',
    demoSignIn: 'Demo Sign In',
    name: 'Full Name',
    phone: 'Phone Number',
    haveAccount: 'Already have an account?',
    noAccount: 'Don\'t have an account?',
    switchToSignUp: 'Sign Up',
    switchToSignIn: 'Sign In',
    signingIn: 'Signing in...',
    creatingAccount: 'Creating account...'
  },
  hi: {
    title: 'एग्रोसेन्स में साइन इन करें',
    subtitle: 'फसल विश्लेषण और व्यक्तिगत सिफारिशों तक पहुंचें',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    signIn: 'साइन इन',
    signUp: 'खाता बनाएं',
    demoSignIn: 'डेमो साइन इन',
    name: 'पूरा नाम',
    phone: 'फोन नंबर',
    haveAccount: 'पहले से खाता है?',
    noAccount: 'खाता नहीं है?',
    switchToSignUp: 'साइन अप',
    switchToSignIn: 'साइन इन',
    signingIn: 'साइन इन हो रहा है...',
    creatingAccount: 'खाता बनाया जा रहा है...'
  },
  mr: {
    title: 'एग्रोसेन्समध्ये साइन इन करा',
    subtitle: 'पिक विश्लेषण आणि वैयक्तिक शिफारसींमध्ये प्रवेश करा',
    email: 'ईमेल पत्ता',
    password: 'पासवर्ड',
    signIn: 'साइन इन',
    signUp: 'खाते तयार करा',
    demoSignIn: 'डेमो साइन इन',
    name: 'पूर्ण नाव',
    phone: 'फोन नंबर',
    haveAccount: 'आधीपासून खाते आहे?',
    noAccount: 'खाते नाही?',
    switchToSignUp: 'साइन अप',
    switchToSignIn: 'साइन इन',
    signingIn: 'साइन इन होत आहे...',
    creatingAccount: 'खाते तयार होत आहे...'
  },
  te: {
    title: 'అగ్రోసెన్స్‌లో సైన్ ఇన్ చేయండి',
    subtitle: 'పంట విశ్లేషణ మరియు వ్యక్తిగత సిఫార్సులను యాక్సెస్ చేయండి',
    email: 'ఇమెయిల్ చిరునామా',
    password: 'పాస్‌వర్డ్',
    signIn: 'సైన్ ఇన్',
    signUp: 'ఖాతా సృష్టించు',
    demoSignIn: 'డెమో సైన్ ఇన్',
    name: 'పూర్తి పేరు',
    phone: 'ఫోన్ నంబర్',
    haveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    noAccount: 'ఖాతా లేదా?',
    switchToSignUp: 'సైన్ అప్',
    switchToSignIn: 'సైన్ ఇన్',
    signingIn: 'సైన్ ఇన్ అవుతోంది...',
    creatingAccount: 'ఖాతా సృష్టించబడుతోంది...'
  }
}

export default function SignInModal({ isOpen, onClose, lang = 'en' }) {
  const { signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  const t = UI_TEXT[lang] || UI_TEXT.en

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleDemoSignIn = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const demoUser = {
        id: 'demo-user',
        name: 'Demo Farmer',
        email: 'demo@agrosense.ai',
        phone: '+91 9876543210'
      }
      signIn(demoUser)
      toast.success('Demo sign in successful!')
      onClose()
      setLoading(false)
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500))

      const userData = {
        id: Date.now().toString(),
        name: isSignUp ? formData.name : 'User',
        email: formData.email,
        phone: isSignUp ? formData.phone : undefined
      }

      signIn(userData)
      toast.success(isSignUp ? 'Account created successfully!' : 'Sign in successful!')
      onClose()
    } catch (error) {
      toast.error('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.name}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.phone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="farmer@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isSignUp ? t.creatingAccount : t.signingIn}
                  </>
                ) : (
                  isSignUp ? t.signUp : t.signIn
                )}
              </button>

              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={loading}
                className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {t.demoSignIn}
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 pb-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  {isSignUp ? t.haveAccount : t.noAccount}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-green-600 hover:text-green-700 font-semibold ml-1"
                  >
                    {isSignUp ? t.switchToSignIn : t.switchToSignUp}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}