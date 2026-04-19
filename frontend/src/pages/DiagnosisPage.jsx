import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Layers, Send, Loader2, Cpu, RotateCcw, Scan, CheckCircle2, Wifi, WifiOff } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '../components/ImageUpload'
import ResultCard from '../components/ResultCard'
import { apiClient } from '../utils/api'

const DEFAULT_SUPPORTED_CROPS = [
  'Apple',
  'Blueberry',
  'Bottleguard',
  'Cabbage',
  'Capsicum',
  'Cherry',
  'Chilly',
  'Corn',
  'Cotton',
  'Grape',
  'Maize',
  'Orange',
  'Peach',
  'Pepper Bell',
  'Potato',
  'Raspberry',
  'Soybean',
  'Squash',
  'Strawberry',
  'Tomato',
]

const STEP_LABELS = {
  en: ['Upload', 'Analyse', 'Results'],
  hi: ['अपलोड', 'विश्लेषण', 'परिणाम'],
  mr: ['अपलोड', 'विश्लेषण', 'निकाल'],
  te: ['అప్‌లోడ్', 'విశ్లేషణ', 'ఫలితాలు'],
}

const UI_TEXT = {
  en: {
    title: 'Crop Health', highlight: 'Diagnosis',
    sub: 'Upload leaf and/or stem images for AI-powered disease detection, severity estimation and treatment recommendations.',
    btn: 'Run Analysis', reset: 'Reset & Analyse New', analyzing: 'Analysing...',
    empty: 'Upload at least one image and click Run Analysis to get started.',
    howTitle: 'How Analysis Works',
    howDesc: 'Images are processed through our MobileNetV2 CNN pipeline. Leaf images detect disease type and confidence. Stem images check browning ratios. The CDI measures stress. All signals are fused into a final health classification.',
    leafLabel: 'Leaf Image', stemLabel: 'Stem Image (Optional)', uploadError: 'Upload at least one image',
    cropLabel: 'Selected Crop', cropPlaceholder: 'Choose the crop before scanning',
    cropRequired: 'Select the crop first so the model does not guess the wrong plant.',
    analysisComplete: 'Analysis complete!', analysisFailed: 'Analysis failed. Make sure the backend is running.',
    signInTitle: 'Sign In to Analyze',
    signInDesc: 'Crop diagnosis is available to signed-in users. Create a free account or sign in to access AI-powered disease detection.',
    signInButton: 'Sign In / Create Account',
    signInFootnote: 'All other features like Weather, History, and About remain freely accessible.',
    engineBadge: 'Multi-Organ Analysis Engine',
    processingText: 'Processing your images through our AI pipeline...',
    backendOnline: 'Backend live',
    backendOffline: 'Backend offline',
  },
  hi: {
    title: 'फसल स्वास्थ्य', highlight: 'निदान',
    sub: 'एआई-आधारित रोग पहचान, गंभीरता आकलन और उपचार सिफारिशों के लिए पत्ती और/या तना छवियां अपलोड करें।',
    btn: 'विश्लेषण चलाएँ', reset: 'रीसेट करें', analyzing: 'विश्लेषण हो रहा है...',
    empty: 'कम से कम एक छवि अपलोड करें और शुरू करने के लिए विश्लेषण चलाएँ।',
    howTitle: 'विश्लेषण कैसे काम करता है',
    howDesc: 'छवियों को MobileNetV2 CNN पाइपलाइन से प्रोसेस किया जाता है। पत्ती छवि रोग और विश्वास स्तर बताती है। तना छवि भूरापन मापती है। CDI तनाव मापता है।',
    leafLabel: 'पत्ती छवि', stemLabel: 'तना छवि (वैकल्पिक)', uploadError: 'कम से कम एक छवि अपलोड करें',
    cropLabel: 'चयनित फसल', cropPlaceholder: 'स्कैन से पहले फसल चुनें',
    cropRequired: 'पहले फसल चुनें ताकि मॉडल गलत पौधे का अनुमान न लगाए।',
    analysisComplete: 'विश्लेषण पूरा हुआ!', analysisFailed: 'विश्लेषण विफल। कृपया बैकएंड चल रहा है या नहीं जांचें।',
    signInTitle: 'विश्लेषण के लिए साइन इन करें',
    signInDesc: 'फसल निदान केवल साइन-इन उपयोगकर्ताओं के लिए उपलब्ध है। एआई रोग पहचान का उपयोग करने के लिए मुफ्त खाता बनाएं या साइन इन करें।',
    signInButton: 'साइन इन / खाता बनाएं',
    signInFootnote: 'मौसम, इतिहास और अबाउट जैसी अन्य सुविधाएँ सभी के लिए उपलब्ध हैं।',
    engineBadge: 'मल्टी-ऑर्गन विश्लेषण इंजन',
    processingText: 'आपकी छवियों को एआई पाइपलाइन में प्रोसेस किया जा रहा है...',
    backendOnline: 'बैकएंड लाइव',
    backendOffline: 'बैकएंड ऑफलाइन',
  },
  mr: {
    title: 'पीक आरोग्य', highlight: 'निदान',
    sub: 'एआय-आधारित रोग ओळख, तीव्रता मोजमाप आणि उपचार शिफारसींसाठी पान आणि/किंवा खोड प्रतिमा अपलोड करा.',
    btn: 'विश्लेषण चालवा', reset: 'रीसेट करा', analyzing: 'विश्लेषण सुरू आहे...',
    empty: 'किमान एक प्रतिमा अपलोड करा आणि विश्लेषण सुरू करा.',
    howTitle: 'विश्लेषण कसे काम करते',
    howDesc: 'प्रतिमा MobileNetV2 CNN पाइपलाइनद्वारे प्रक्रिया केल्या जातात. पान प्रतिमा रोग आणि विश्वास दाखवते. खोड प्रतिमा तपकिरीपणा मोजते. CDI ताण मोजतो.',
    leafLabel: 'पान प्रतिमा', stemLabel: 'खोड प्रतिमा (पर्यायी)', uploadError: 'किमान एक प्रतिमा अपलोड करा',
    cropLabel: 'निवडलेले पीक', cropPlaceholder: 'स्कॅन करण्यापूर्वी पीक निवडा',
    cropRequired: 'मॉडेल चुकीचे पीक ओळखू नये म्हणून आधी पीक निवडा.',
    analysisComplete: 'विश्लेषण पूर्ण झाले!', analysisFailed: 'विश्लेषण अयशस्वी. कृपया बॅकएंड चालू आहे का ते तपासा.',
    signInTitle: 'विश्लेषणासाठी साइन इन करा',
    signInDesc: 'पीक निदान हे फक्त साइन-इन वापरकर्त्यांसाठी उपलब्ध आहे. एआय रोग ओळख वापरण्यासाठी मोफत खाते तयार करा किंवा साइन इन करा.',
    signInButton: 'साइन इन / खाते तयार करा',
    signInFootnote: 'हवामान, इतिहास आणि अबाउट यांसारखी इतर वैशिष्ट्ये सर्वांसाठी खुली आहेत.',
    engineBadge: 'मल्टी-ऑर्गन विश्लेषण इंजिन',
    processingText: 'तुमच्या प्रतिमा एआय पाइपलाइनमधून प्रक्रिया केल्या जात आहेत...',
    backendOnline: 'बॅकएंड लाईव्ह',
    backendOffline: 'बॅकएंड ऑफलाइन',
  },
  te: {
    title: 'పంట ఆరోగ్యం', highlight: 'నిర్ధారణ',
    sub: 'ఏఐ ఆధారిత వ్యాధి గుర్తింపు, తీవ్రత అంచనా మరియు చికిత్స సూచనల కోసం ఆకు మరియు/లేదా కాండం చిత్రాలను అప్‌లోడ్ చేయండి.',
    btn: 'విశ్లేషణ ప్రారంభించండి', reset: 'రీ‌సెట్ చేయండి', analyzing: 'విశ్లేషణ జరుగుతోంది...',
    empty: 'కనీసం ఒక చిత్రం అప్‌లోడ్ చేసి విశ్లేషణ ప్రారంభించండి.',
    howTitle: 'విశ్లేషణ ఎలా పనిచేస్తుంది',
    howDesc: 'చిత్రాలు MobileNetV2 CNN పైప్‌లైన్ ద్వారా ప్రాసెస్ చేయబడతాయి. ఆకు చిత్రం వ్యాధి మరియు నమ్మకాన్ని చూపుతుంది. కాండం చిత్రం గోధుమరంగు మార్పును కొలుస్తుంది. CDI ఒత్తిడిని కొలుస్తుంది.',
    leafLabel: 'ఆకు చిత్రం', stemLabel: 'కాండం చిత్రం (ఐచ్చికం)', uploadError: 'కనీసం ఒక చిత్రం అప్‌లోడ్ చేయండి',
    cropLabel: 'ఎంచుకున్న పంట', cropPlaceholder: 'స్కాన్ చేయడానికి ముందు పంటను ఎంచుకోండి',
    cropRequired: 'మోడల్ తప్పు మొక్కను ఊహించకుండా ముందుగా పంటను ఎంచుకోండి.',
    analysisComplete: 'విశ్లేషణ పూర్తైంది!', analysisFailed: 'విశ్లేషణ విఫలమైంది. దయచేసి బ్యాక్‌ఎండ్ నడుస్తుందో చూడండి.',
    signInTitle: 'విశ్లేషణ కోసం సైన్ ఇన్ చేయండి',
    signInDesc: 'పంట నిర్ధారణ సైన్-ఇన్ చేసిన వినియోగదారులకు మాత్రమే అందుబాటులో ఉంటుంది. ఉచిత ఖాతా సృష్టించండి లేదా సైన్ ఇన్ చేయండి.',
    signInButton: 'సైన్ ఇన్ / ఖాతా సృష్టించండి',
    signInFootnote: 'వాతావరణం, చరిత్ర మరియు అబౌట్ వంటి ఇతర ఫీచర్లు అందరికీ అందుబాటులో ఉంటాయి.',
    engineBadge: 'మల్టీ-ఆర్గన్ విశ్లేషణ ఇంజిన్',
    processingText: 'మీ చిత్రాలు ఏఐ పైప్‌లైన్‌లో ప్రాసెస్ అవుతున్నాయి...',
    backendOnline: 'బ్యాక్‌ఎండ్ లైవ్',
    backendOffline: 'బ్యాక్‌ఎండ్ ఆఫ్‌లైన్',
  },
}

export default function DiagnosisPage({ lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const steps = STEP_LABELS[lang] || STEP_LABELS.en
  const { user } = useAuth()
  const [authModal, setAuthModal] = useState({ open: false })
  const [leafImage, setLeafImage] = useState(null)
  const [stemImage, setStemImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(0)
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [backendOnline, setBackendOnline] = useState(true)
  const [supportedCrops, setSupportedCrops] = useState(DEFAULT_SUPPORTED_CROPS)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const crop = urlParams.get('crop')
    if (crop) {
      const rawCrop = crop
        .replace(/\bgrapes\b/i, 'grape')
        .replace(/\bmaize\b/i, 'corn')
        .replace(/\bcapsicum\b/i, 'pepper bell')
        .replace(/\bbell pepper\b/i, 'pepper bell')
      const normalizedCrop = rawCrop
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
      const matchedCrop = DEFAULT_SUPPORTED_CROPS.find((item) => item.toLowerCase() === normalizedCrop.toLowerCase())
      setSelectedCrop(matchedCrop || normalizedCrop)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const loadSupportedCrops = async () => {
      try {
        const res = await apiClient.get('/api/crops', { timeout: 5000 })
        const crops = res.data?.crops
        if (mounted && Array.isArray(crops) && crops.length > 0) {
          setSupportedCrops(crops)
        }
      } catch {}
    }

    loadSupportedCrops()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const checkBackend = async () => {
      try {
        await apiClient.get('/health', { timeout: 5000 })
        if (mounted) setBackendOnline(true)
      } catch {
        if (mounted) setBackendOnline(false)
      }
    }

    checkBackend()
    const intervalId = window.setInterval(checkBackend, 30000)

    return () => {
      mounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const handleAnalyze = async () => {
    if (!selectedCrop) {
      toast.error(t.cropRequired)
      return
    }

    if (!leafImage && !stemImage) {
      toast.error(t.uploadError)
      return
    }

    setLoading(true)
    setStep(1)

    const fd = new FormData()
    if (leafImage) fd.append('leaf_image', leafImage)
    if (stemImage) fd.append('stem_image', stemImage)
    fd.append('crop_name', selectedCrop)

    try {
      const res = await apiClient.post('/api/analyze', fd, {
        // Do NOT set Content-Type manually — axios auto-sets multipart/form-data
        // with the correct boundary when FormData is passed
        timeout: 30000,
      })
      setBackendOnline(true)
      setResult(res.data)
      setStep(2)
      toast.success(t.analysisComplete)
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || t.analysisFailed
      setBackendOnline(false)
      toast.error(msg)
      setStep(0)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setLeafImage(null)
    setStemImage(null)
    setResult(null)
    setStep(0)
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 relative">
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, rgba(52,211,153,0.07), transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold mb-3" style={{ color: '#ddeee5' }}>{t.signInTitle}</h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: '#4d7a62' }}>{t.signInDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setAuthModal({ open: true })} className="btn-primary px-8 py-3 text-sm">
                {t.signInButton}
              </button>
            </div>
            <p className="mt-6 text-xs" style={{ color: '#2d5040' }}>{t.signInFootnote}</p>
          </motion.div>
        </div>
        <AuthModal isOpen={authModal.open} onClose={() => setAuthModal({ open: false })} defaultTab="signin" lang={lang} />
      </>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.06), transparent 70%)', filter: 'blur(50px)' }}
      />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="badge mb-6 mx-auto inline-flex" style={{ color: '#34d399', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.22)' }}>
            <Cpu size={11} color="#34d399" />
            {t.engineBadge}
          </div>
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
            style={{
              color: backendOnline ? '#34d399' : '#f87171',
              background: backendOnline ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
              border: backendOnline ? '1px solid rgba(52,211,153,0.18)' : '1px solid rgba(248,113,113,0.18)',
            }}
          >
            {backendOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            {backendOnline ? t.backendOnline : t.backendOffline}
          </div>
          <h1 className="font-display mb-4" style={{ fontSize: 'clamp(32px, 6vw, 56px)', color: '#e8f5ee' }}>
            {selectedCrop ? `${selectedCrop} ` : ''}
            {t.title} <span className="text-glow">{t.highlight}</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#4d6e5c' }}>{t.sub}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-600 transition-all ${i <= step ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                {i < step ? <CheckCircle2 size={14} /> : loading && i === 1 ? <Loader2 size={14} className="animate-spin" /> : i + 1}
              </div>
              <span className={`text-sm ${i <= step ? 'text-emerald-400' : 'text-gray-500'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-emerald-500' : 'bg-gray-600'}`} />}
            </div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-5 md:col-span-2">
                  <label className="block text-sm mb-2" style={{ color: '#9ac9b5' }}>{t.cropLabel}</label>
                  <select
                    value={selectedCrop || ''}
                    onChange={(e) => setSelectedCrop(e.target.value || null)}
                    className="w-full px-4 py-3 rounded-2xl outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(52,211,153,0.15)',
                      color: '#ddeee5',
                    }}
                  >
                    <option value="">{t.cropPlaceholder}</option>
                    {supportedCrops.map((crop) => (
                      <option key={crop} value={crop} style={{ color: '#0f172a' }}>
                        {crop}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs mt-2" style={{ color: '#6b7d75' }}>{t.cropRequired}</p>
                </div>
                <ImageUpload label={t.leafLabel} icon={Leaf} value={leafImage} onChange={setLeafImage} lang={lang} />
                <ImageUpload label={t.stemLabel} icon={Layers} value={stemImage} onChange={setStemImage} lang={lang} />
              </div>

              <div className="text-center">
                <motion.button
                  onClick={handleAnalyze}
                  disabled={!selectedCrop || (!leafImage && !stemImage)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl font-600 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                  style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', color: 'white', boxShadow: '0 8px 25px rgba(52, 211, 153, 0.3)' }}
                >
                  <Send size={20} />
                  {t.btn}
                </motion.button>
                <p className="text-sm mt-4" style={{ color: '#6b7d75' }}>{t.empty}</p>
              </div>

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
              <p className="text-sm" style={{ color: '#6b7d75' }}>{t.processingText}</p>
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
