import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Layers, Send, Loader2, AlertCircle, Cpu, RotateCcw, Scan, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '../components/ImageUpload'
import ResultCard from '../components/ResultCard'
import { apiClient } from '../utils/api'

const STEPS = ['Upload', 'Analyse', 'Results']

const UI_TEXT = {
  en: { title: 'Crop Health', highlight: 'Diagnosis', sub: 'Upload leaf and/or stem images for AI-powered disease detection, severity estimation and treatment recommendations.', btn: 'Run Analysis', reset: 'Reset & Analyse New', analyzing: 'Analysing...', empty: 'Upload at least one image and click Run Analysis to get started.', howTitle: 'How Analysis Works', howDesc: 'Images are processed through our MobileNetV2 CNN pipeline. Leaf images detect disease type and confidence. Stem images check browning ratios. The CDI measures stress. All signals are fused into a final health classification.', leafLabel: 'Leaf Image', stemLabel: 'Stem Image (Optional)', uploadError: 'Upload at least one image', analysisComplete: 'Analysis complete!', analysisFailed: 'Analysis failed. Make sure the backend is running.', demoResult: 'Showing demo result (backend unavailable)' },
  hi: { title: 'फसल स्वास्थ्य', highlight: 'निदान', sub: 'AI-आधारित रोग पहचान के लिए पत्ती और/या तना की छवियां अपलोड करें।', btn: 'विश्लेषण चलाएं', reset: 'रीसेट करें', analyzing: 'विश्लेषण हो रहा है...', empty: 'कम से कम एक छवि अपलोड करें।', howTitle: 'विश्लेषण कैसे काम करता है', howDesc: 'छवियों को MobileNetV2 CNN पाइपलाइन के माध्यम से संसाधित किया जाता है।', leafLabel: 'पत्ती की छवि', stemLabel: 'तना की छवि (वैकल्पिक)', uploadError: 'कम से कम एक छवि अपलोड करें', analysisComplete: 'विश्लेषण पूरा हुआ!', analysisFailed: 'विश्लेषण विफल। सुनिश्चित करें कि बैकएंड चल रहा है।', demoResult: 'डेमो परिणाम दिखा रहा है (बैकएंड अनुपलब्ध)' },
  mr: { title: 'पीक आरोग्य', highlight: 'निदान', sub: 'AI-आधारित रोग ओळखण्यासाठी पान आणि/किंवा खोड प्रतिमा अपलोड करा.', btn: 'विश्लेषण चालवा', reset: 'रीसेट करा', analyzing: 'विश्लेषण होत आहे...', empty: 'कमीतकमी एक प्रतिमा अपलोड करा.', howTitle: 'विश्लेषण कसे कार्य करते', howDesc: 'प्रतिमा MobileNetV2 CNN पाइपलाइनद्वारे प्रक्रिया केल्या जातात.', leafLabel: 'पान प्रतिमा', stemLabel: 'खोड प्रतिमा (पर्यायी)', uploadError: 'कमीतकमी एक प्रतिमा अपलोड करा', analysisComplete: 'विश्लेषण पूर्ण झाले!', analysisFailed: 'विश्लेषण अयशस्वी. बॅकएंड चालू आहे याची खात्री करा.', demoResult: 'डेमो परिणाम दाखवत आहे (बॅकएंड अनुपलब्ध)' },
  te: { title: 'పంట ఆరోగ్యం', highlight: 'నిర్ధారణ', sub: 'AI-ఆధారిత వ్యాధి గుర్తింపు కోసం ఆకు మరియు/లేదా కాండం చిత్రాలు అప్‌లోడ్ చేయండి.', btn: 'విశ్లేషణ నడపండి', reset: 'రీసెట్ చేయండి', analyzing: 'విశ్లేషిస్తోంది...', empty: 'కనీసం ఒక చిత్రం అప్‌లోడ్ చేయండి.', howTitle: 'విశ్లేషణ ఎలా పని చేస్తుంది', howDesc: 'చిత్రాలు MobileNetV2 CNN పైప్‌లైన్ ద్వారా ప్రాసెస్ చేయబడతాయి.', leafLabel: 'ఆకు చిత్రం', stemLabel: 'కాండం చిత్రం (ఐచ్ఛికం)', uploadError: 'కనీసం ఒక చిత్రం అప్‌లోడ్ చేయండి', analysisComplete: 'విశ్లేషణ పూర్తైంది!', analysisFailed: 'విశ్లేషణ విఫలమైంది. బ్యాకెండ్ నడుస్తోందని నిర్ధారించుకోండి.', demoResult: 'డెమో ఫలితాన్ని చూపిస్తోంది (బ్యాకెండ్ అందుబాటులో లేదు)' }
}

const demoResult = () => ({
  id: `demo-${Date.now()}`,
  disease_name: 'Demo Analysis Result',
  classification: 'Preventive',
  confidence: 0.82,
  health_score: 74,
  severity_score: 26,
  cdi_score: 0.31,
  leaf_result: {
    disease: 'Leaf stress detected',
    confidence: 0.82,
  },
  stem_result: null,
  prevention: [
    'Inspect the crop closely for early stress symptoms.',
    'Avoid overwatering and improve field drainage if needed.',
    'Monitor the next few days and re-run analysis when backend is available.',
  ],
  treatment: [
    'This is a temporary demo fallback while the live backend is unavailable.',
  ],
  fertilizer: [
    'Apply a balanced nutrient plan based on your field condition.',
  ],
  viability: 'This is a demo fallback result. Re-run the scan after the backend issue is fixed.',
})

export default function DiagnosisPage({ lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const { user } = useAuth()
  const [authModal, setAuthModal] = useState({ open: false })
  const [leafImage, setLeafImage] = useState(null)
  const [stemImage, setStemImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(0)
  const [selectedCrop, setSelectedCrop] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const crop = urlParams.get('crop')
    if (crop) {
      setSelectedCrop(crop.charAt(0).toUpperCase() + crop.slice(1))
    }
  }, [])

  const handleAnalyze = async () => {
    if (!leafImage && !stemImage) { toast.error(t.uploadError); return }
    setLoading(true); setStep(1)
    const fd = new FormData()
    if (leafImage) fd.append('leaf_image', leafImage)
    if (stemImage) fd.append('stem_image', stemImage)
    try {
      const res = await apiClient.post('/api/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 })
      setResult(res.data); setStep(2); toast.success(t.analysisComplete)
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || t.analysisFailed
      toast.error(msg)
      if (err.code === 'ERR_NETWORK' || (err.response?.status >= 500)) {
        setResult(demoResult()); setStep(2); toast.success(t.demoResult)
      } else { setStep(0) }
    } finally { setLoading(false) }
  }

  const reset = () => { setLeafImage(null); setStemImage(null); setResult(null); setStep(0) }

  // ── AUTH GUARD ────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 relative">
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(52,211,153,0.07), transparent 70%)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center max-w-md mx-auto"
          >
            {/* Lock icon */}
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold mb-3" style={{ color: '#ddeee5' }}>
              Sign In to Analyze
            </h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: '#4d7a62' }}>
              Crop diagnosis is available to signed-in users. Create a free account or sign in to access AI-powered disease detection.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setAuthModal({ open: true })}
                className="btn-primary px-8 py-3 text-sm"
              >
                Sign In / Create Account
              </button>
            </div>
            <p className="mt-6 text-xs" style={{ color: '#2d5040' }}>
              All other features — Weather, History, About — are freely accessible.
            </p>
          </motion.div>
        </div>
        <AuthModal
          isOpen={authModal.open}
          onClose={() => setAuthModal({ open: false })}
          defaultTab="signin"
        />
      </>
    )
  }
  // ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      {/* Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.06), transparent 70%)', filter: 'blur(50px)' }} />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="badge mb-6 mx-auto inline-flex" style={{ color: '#34d399', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.22)' }}>
            <Cpu size={11} color="#34d399" />
            Multi-Organ Analysis Engine
          </div>
          <h1 className="font-display mb-4" style={{ fontSize: 'clamp(32px, 6vw, 56px)', color: '#e8f5ee' }}>
            {selectedCrop ? `${selectedCrop} ` : ''}{t.title} <span className="text-glow">{t.highlight}</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#4d6e5c' }}>{t.sub}</p>
        </motion.div>

        {/* Step Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-600 transition-all ${i <= step ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                {i < step ? <CheckCircle2 size={14} /> : i === step ? <Loader2 size={14} className="animate-spin" /> : i + 1}
              </div>
              <span className={`text-sm ${i <= step ? 'text-emerald-400' : 'text-gray-500'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-emerald-500' : 'bg-gray-600'}`} />}
            </div>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">

              {/* Image Uploads */}
              <div className="grid md:grid-cols-2 gap-6">
                <ImageUpload
                  label={t.leafLabel}
                  icon={Leaf}
                  value={leafImage}
                  onChange={setLeafImage}
                  lang={lang}
                />
                <ImageUpload
                  label={t.stemLabel}
                  icon={Layers}
                  value={stemImage}
                  onChange={setStemImage}
                  lang={lang}
                />
              </div>

              {/* Analyze Button */}
              <div className="text-center">
                <motion.button
                  onClick={handleAnalyze}
                  disabled={!leafImage && !stemImage}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl font-600 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #34d399, #10b981)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(52, 211, 153, 0.3)'
                  }}
                >
                  <Send size={20} />
                  {t.btn}
                </motion.button>
                <p className="text-sm mt-4" style={{ color: '#6b7d75' }}>{t.empty}</p>
              </div>

              {/* How It Works */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8">
                <h3 className="font-display text-xl mb-4" style={{ color: '#e8f5ee' }}>{t.howTitle}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8ab89a' }}>{t.howDesc}</p>
              </motion.div>

            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.1)', border: '2px solid #34d399' }}>
                <Scan size={24} style={{ color: '#34d399' }} />
              </motion.div>
              <h3 className="font-display text-2xl mb-2" style={{ color: '#e8f5ee' }}>{t.analyzing}</h3>
              <p className="text-sm" style={{ color: '#6b7d75' }}>Processing your images through our AI pipeline...</p>
            </motion.div>
          )}

          {step === 2 && result && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ResultCard result={result} lang={lang} />
              <div className="text-center mt-8">
                <button onClick={reset} className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 mx-auto" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                  <RotateCcw size={16} />
                  {t.reset}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
