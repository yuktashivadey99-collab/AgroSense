import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Leaf, Cpu, Zap, Shield, BarChart3, ArrowRight,
  Microscope, Sprout, CloudSun, Globe, CheckCircle2, Scan
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const UI_TEXT = {
  en: {
    platform: 'AgroSense AI Platform',
    heroTitle1: 'See What\'s',
    heroTitle2: 'Killing',
    heroTitle3: 'Your Crops.',
    heroDesc: 'Upload leaf & stem images. AgroSense AI analyses disease type, severity and CDI — then delivers precise treatment recommendations in seconds.',
    analyzeBtn: 'Analyse My Crops',
    accuracy: 'Accuracy',
    trainingImages: 'Training Images',
    processing: 'Processing',
    analyzingLeaf: 'Analyzing Leaf...',
    alert: 'Alert',
    earlyBlight: 'Early Blight Detected',
    sectionLabel: 'Platform Features',
    sectionTitle: 'About',
    sectionAccent: 'AgroSense AI',
    features: [
      { title: 'Multi-Organ Analysis', desc: 'Simultaneous leaf & stem image analysis for comprehensive plant health assessment.' },
      { title: 'MobileNetV2 CNN', desc: 'State-of-the-art CNN fine-tuned on 50,000+ crop disease images for high precision.' },
      { title: 'Color Deviation Index', desc: 'Proprietary CDI metric quantifies plant stress at pixel-precision colour analysis.' },
      { title: 'Adaptive Fusion', desc: 'Weighted decision fusion of leaf, stem and CDI signals for maximum diagnostic accuracy.' },
      { title: 'Live Weather Intel', desc: 'Real-time weather data integrated to contextualise disease spread risk in your region.' },
      { title: '4-Language Support', desc: 'Full UI localisation in English, Hindi, Marathi, and Telugu. Designed for Indian farmers first.' }
    ]
  },
  hi: {
    platform: 'एग्रोसेन्स एआई प्लेटफॉर्म',
    heroTitle1: 'देखें कि क्या',
    heroTitle2: 'मार रहा है',
    heroTitle3: 'आपकी फसलें।',
    heroDesc: 'पत्ती और तना की छवियां अपलोड करें। एग्रोसेन्स एआई रोग प्रकार, गंभीरता और सीडीआई का विश्लेषण करता है — फिर सेकंडों में सटीक उपचार सिफारिशें देता है।',
    analyzeBtn: 'मेरी फसल का विश्लेषण करें',
    accuracy: 'सटीकता',
    trainingImages: 'प्रशिक्षण छवियां',
    processing: 'प्रोसेसिंग',
    analyzingLeaf: 'पत्ती का विश्लेषण...',
    alert: 'अलर्ट',
    earlyBlight: 'शीघ्र ब्लाइट का पता चला',
    sectionLabel: 'प्लेटफॉर्म विशेषताएं',
    sectionTitle: 'के बारे में',
    sectionAccent: 'एग्रोसेन्स एआई',
    features: [
      { title: 'बहु-अंग विश्लेषण', desc: 'समग्र पौधे स्वास्थ्य मूल्यांकन के लिए पत्ती और तना छवि विश्लेषण एक साथ।' },
      { title: 'मोबाइलनेटवी2 सीएनएन', desc: 'उच्च सटीकता के लिए 50,000+ फसल रोग छवियों पर फाइन-ट्यून्ड अत्याधुनिक सीएनएन।' },
      { title: 'रंग विचलन सूचकांक', desc: 'स्वामित्व सीडीआई मीट्रिक पिक्सेल-सटीक रंग विश्लेषण के साथ पौधे के तनाव को मात्रात्मक करता है।' },
      { title: 'अनुकूलनीय फ्यूजन', desc: 'अधिकतम नैदानिक सटीकता के लिए पत्ती, तना और सीडीआई संकेतों का भारित निर्णय फ्यूजन।' },
      { title: 'लाइव मौसम इंटेल', desc: 'आपके क्षेत्र में रोग प्रसार जोखिम को संदर्भित करने के लिए एकीकृत वास्तविक समय मौसम डेटा।' },
      { title: '4-भाषा समर्थन', desc: 'अंग्रेजी, हिंदी, मराठी और तेलुगु में पूर्ण यूआई स्थानीयकरण। पहले भारतीय किसानों के लिए डिज़ाइन किया गया।' }
    ]
  },
  mr: {
    platform: 'एग्रोसेन्स एआय प्लॅटफॉर्म',
    heroTitle1: 'पाहा की काय',
    heroTitle2: 'मारत आहे',
    heroTitle3: 'तुमच्या पिकांना।',
    heroDesc: 'पान आणि खोड प्रतिमा अपलोड करा. एग्रोसेन्स एआय रोग प्रकार, तीव्रता आणि सीडीआय विश्लेषण करते — नंतर सेकंदात अचूक उपचार शिफारसी देते.',
    analyzeBtn: 'माझ्या पिकांचे विश्लेषण करा',
    accuracy: 'अचूकता',
    trainingImages: 'प्रशिक्षण प्रतिमा',
    processing: 'प्रोसेसिंग',
    analyzingLeaf: 'पानाचे विश्लेषण...',
    alert: 'अलर्ट',
    earlyBlight: 'लवकर ब्लाइट आढळले',
    sectionLabel: 'प्लॅटफॉर्म वैशिष्ट्ये',
    sectionTitle: 'विषयी',
    sectionAccent: 'एग्रोसेन्स एआय',
    features: [
      { title: 'बहु-अवयव विश्लेषण', desc: 'सर्वसमावेशक वनस्पती आरोग्य मूल्यांकनासाठी पान आणि खोड प्रतिमा विश्लेषण एकाच वेळी.' },
      { title: 'मोबाइलनेटव्ही2 सीएनएन', desc: 'उच्च अचूकतेसाठी 50,000+ पिक रोग प्रतिमांवर फाइन-ट्यून्ड अत्याधुनिक सीएनएन.' },
      { title: 'रंग विचलन निर्देशांक', desc: 'मालकी सीडीआय मेट्रिक पिक्सेल-प्रेसिजन रंग विश्लेषणासह वनस्पती तणाव क्वांटिफाई करते.' },
      { title: 'अनुकूल फ्यूजन', desc: 'कमाल निदानात्मक अचूकतेसाठी पान, खोड आणि सीडीआय संकेतांचे भारित निर्णय फ्यूजन.' },
      { title: 'लाइव हवामान इंटेल', desc: 'तुमच्या प्रदेशात रोग प्रसार धोका संदर्भित करण्यासाठी एकत्रित केलेले रिअल-टाइम हवामान डेटा.' },
      { title: '4-भाषा समर्थन', desc: 'इंग्रजी, हिंदी, मराठी आणि तेलुगु मध्ये पूर्ण यूआय स्थानिकीकरण. प्रथम भारतीय शेतकऱ्यांसाठी डिझाइन केले.' }
    ]
  },
  te: {
    platform: 'అగ్రోసెన్స్ ఎఐ ప్లాట్‌ఫారమ్',
    heroTitle1: 'ఏమి చూడండి',
    heroTitle2: 'చంపుతోంది',
    heroTitle3: 'మీ పంటలను.',
    heroDesc: 'ఆకు మరియు కాండం చిత్రాలను అప్‌లోడ్ చేయండి. అగ్రోసెన్స్ ఎఐ వ్యాధి రకం, తీవ్రత మరియు సీడీఐను విశ్లేషిస్తుంది — తర్వాత సెకన్లలో ఖచ్చితమైన చికిత్స సిఫార్సులను అందిస్తుంది.',
    analyzeBtn: 'నా పంటలను విశ్లేషించు',
    accuracy: 'ఖచ్చితత్వం',
    trainingImages: 'శిక్షణ చిత్రాలు',
    processing: 'ప్రాసెసింగ్',
    analyzingLeaf: 'ఆకు విశ్లేషిస్తోంది...',
    alert: 'హెచ్చరిక',
    earlyBlight: 'ప్రారంభ బ్లైట్ కనుగొనబడింది',
    sectionLabel: 'ప్లాట్‌ఫారమ్ లక్షణాలు',
    sectionTitle: 'గురించి',
    sectionAccent: 'అగ్రోసెన్స్ ఎఐ',
    features: [
      { title: 'బహుళ-అవయవ విశ్లేషణ', desc: 'సమగ్ర మొక్క ఆరోగ్య మూల్యాంకనం కోసం ఆకు మరియు కాండం చిత్ర విశ్లేషణ ఏకకాలంలో.' },
      { title: 'మొబైల్‌నెట్‌వర్క్‌వి2 సీఎన్‌ఎన్', desc: 'అధిక ఖచ్చితత్వం కోసం 50,000+ పంట వ్యాధి చిత్రాలపై ఫైన్-ట్యూన్డ్ అత్యాధునిక సీఎన్‌ఎన్.' },
      { title: 'రంగ విచలన సూచిక', desc: 'స్వంత సీడీఐ మెట్రిక్ పిక్సెల్-ఖచ్చితమైన రంగ విశ్లేషణతో మొక్క ఒత్తిడిని క్వాంటిఫై చేస్తుంది.' },
      { title: 'అనుకూల ఫ్యూజన్', desc: 'గరిష్ట నిర్ధారణ ఖచ్చితత్వం కోసం ఆకు, కాండం మరియు సీడీఐ సిగ్నల్స్ యొక్క బరువు నిర్ణయ ఫ్యూజన్.' },
      { title: 'లైవ్ వాతావరణ ఇంటెల్', desc: 'మీ ప్రాంతంలో వ్యాధి వ్యాప్తి ప్రమాదాన్ని సందర్భీకరించడానికి వాస్తవ-సమయ వాతావరణ డేటా ఏకీకృతం.' },
      { title: '4-భాషా మద్దతు', desc: 'ఇంగ్లీష్, హిందీ, మరాఠీ మరియు తెలుగు లలో పూర్తి యూఐ స్థానికీకరణ. మొదట భారతీయ రైతుల కోసం రూపొందించబడింది.' }
    ]
  }
}

const features = [
  { icon: Microscope, title: 'Multi-Organ Analysis',  desc: 'Simultaneous leaf & stem image analysis for comprehensive plant health assessment.', col: 'em' },
  { icon: Cpu,        title: 'MobileNetV2 CNN',       desc: 'State-of-the-art CNN fine-tuned on 50,000+ crop disease images for high precision.', col: 'sky' },
  { icon: BarChart3,  title: 'Color Deviation Index', desc: 'Proprietary CDI metric quantifies plant stress at pixel-precision colour analysis.', col: 'em' },
  { icon: Shield,     title: 'Adaptive Fusion',       desc: 'Weighted decision fusion of leaf, stem and CDI signals for maximum diagnostic accuracy.', col: 'gold' },
  { icon: CloudSun,   title: 'Live Weather Intel',    desc: 'Real-time weather data integrated to contextualise disease spread risk in your region.', col: 'sky' },
  { icon: Globe,      title: '4-Language Support',    desc: 'Full UI localisation in English, Hindi, Marathi, and Telugu. Designed for Indian farmers first.', col: 'em' },
]

const classifications = [
  { label: 'Healthy',    color: '#34d399', pct: 5,   desc: 'No intervention needed'        },
  { label: 'Preventive', color: '#38bdf8', pct: 25,  desc: 'Monitor & preventive care'     },
  { label: 'Treatable',  color: '#f59e0b', pct: 55,  desc: 'Treatment recommended'         },
  { label: 'Critical',   color: '#f43f5e', pct: 82,  desc: 'Urgent attention required'     },
  { label: 'Remove',     color: '#a855f7', pct: 100, desc: 'Quarantine & remove plant'     },
]

function Orb({ style, size = 400, delay = 0 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, ...style }}
      animate={{ scale: [1, 1.10, 1], x: [0, 24, 0], y: [0, -24, 0] }}
      transition={{ duration: 12 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

function SectionHeader({ label, title, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      {label && <div className="sec-label mb-4">{label}</div>}
      <h2 className="font-display leading-tight" style={{ fontSize: 'clamp(30px, 5vw, 50px)', color: '#e8f5ee' }}>
        {title} <span className="text-glow">{accent}</span>
      </h2>
    </motion.div>
  )
}

export default function LandingPage({ lang = 'en', onSignInClick }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const { user } = useAuth()
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.80], [1, 0])

  const colMap = { em: '#34d399', sky: '#38bdf8', gold: '#f59e0b' }

  const handleAnalyzeClick = () => {
    if (user) {
      navigate('/diagnose')
    } else {
      onSignInClick()
    }
  }

  return (
    <div className="overflow-hidden relative">

      {/* ── 1. HERO (Main Title + Image side-by-side) ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center px-6 pt-24 pb-20"
      >
        {/* Ambient blobs */}
        <Orb style={{ top: '10%', left: '-5%', background: 'radial-gradient(circle, rgba(52,211,153,0.14), transparent 70%)', filter: 'blur(70px)' }} size={700} delay={0} />
        <Orb style={{ bottom: '15%', right: '-8%', background: 'radial-gradient(circle, rgba(56,189,248,0.06), transparent 70%)', filter: 'blur(90px)' }} size={600} delay={5} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020906]" style={{ pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Hero Text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="badge mb-6 inline-flex"
              style={{ color: '#34d399', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.25)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-em-400 animate-breathe" />
              {t.platform}
              <span className="w-1.5 h-1.5 rounded-full bg-em-400 animate-breathe" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(44px, 6vw, 76px)' }}
            >
              <span style={{ color: '#c8e8d6' }}>{t.heroTitle1} </span>
              <span className="text-glow">{t.heroTitle2}</span>
              <br />
              <span style={{ color: '#c8e8d6' }}>{t.heroTitle3}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
              className="text-lg mb-10 leading-relaxed max-w-lg"
              style={{ color: '#4d6e5c', fontWeight: 300 }}
            >
              {t.heroDesc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.32 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/diagnose" className="btn-primary gap-2.5 group px-8 py-4 text-[15px] w-full sm:w-auto justify-center">
                <Sprout size={17} color="#011a0e" />
                {t.analyzeBtn}
                <ArrowRight size={15} color="#011a0e" className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Quick Stats below CTA */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="mt-10 flex gap-6">
              <div>
                <div className="font-display text-2xl text-glow-sky">97.3%</div>
                <div className="text-xs font-mono" style={{ color: '#3d5a47' }}>{t.accuracy}</div>
              </div>
              <div>
                <div className="font-display text-2xl text-glow">50K+</div>
                <div className="text-xs font-mono" style={{ color: '#3d5a47' }}>{t.trainingImages}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            initial={{ opacity: 0, scale: 0.9, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Glossy overlay effect for the image */}
            <div className="glass-card p-4 rounded-3xl relative overflow-hidden" style={{ background: 'rgba(52,211,153,0.03)' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-em-500/10 to-sky-500/10 pointer-events-none" />
              <img
                src="/hero-crop.png"
                alt="AgroSense AI Scanning Crop"
                className="w-full h-[500px] object-cover rounded-2xl"
              />
              {/* Floating element 1 */}
              <div className="absolute top-8 -left-6 glass-bright px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-float" style={{ animationDelay: '0s' }}>
                <Scan size={20} color="#34d399" />
                <div>
                  <div className="text-xs font-mono text-em-200">{t.processing}</div>
                  <div className="text-sm font-display text-white">{t.analyzingLeaf}</div>
                </div>
              </div>
              {/* Floating element 2 */}
              <div className="absolute bottom-12 -right-6 glass-bright px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-float" style={{ animationDelay: '2s' }}>
                <CheckCircle2 size={20} color="#34d399" />
                <div>
                  <div className="text-xs font-mono text-em-200">{t.alert}</div>
                  <div className="text-sm font-display text-white">{t.earlyBlight}</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>


      {/* ── 2. ABOUT THE WEBSITE / FEATURES ─────────────────────────────────────── */}
      <section className="py-24 px-6 relative" style={{ background: 'linear-gradient(to bottom, transparent, rgba(52,211,153,0.02))' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(52,211,153,0.03), transparent)'
        }} />
        <div className="max-w-6xl mx-auto relative">
          <SectionHeader label={t.sectionLabel} title={t.sectionTitle} accent={t.sectionAccent} />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.map(({ title, desc }, i) => {
              const feature = features[i] || features[0]
              const c = colMap[feature.col] || '#34d399'
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="glass-card p-7"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative"
                    style={{ background: `${c}12`, border: `1px solid ${c}28` }}>
                    <feature.icon size={22} style={{ color: c }} />
                    <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `0 0 20px ${c}20` }} />
                  </div>
                  <h3 className="font-display text-base mb-2.5" style={{ color: '#c0e0d0' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c' }}>{desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 3. CROPS SUPPORTED ──────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="" title="Crops" accent="Supported" />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Tomato', img: '/crops/tomato.png' },
              { name: 'Cotton', img: '/crops/cotton.png' },
              { name: 'Grapes', img: '/crops/grapes.png' },
              { name: 'Chilly', img: '/crops/chilly.png' },
              { name: 'Capsicum', img: '/crops/capsicum.png' },
              { name: 'Maize', img: '/crops/maize.png' },
              { name: 'Cabbage', img: '/crops/cabbage.jpg?v=2' },
              { name: 'Corn', img: '/crops/corn.jpg?v=2' },
              { name: 'Bottle Gourd', img: 'https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=800' },
            ].map(({ name, img }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-sm group relative overflow-hidden rounded-2xl aspect-[16/10] cursor-pointer"
                onClick={() => window.location.href = `/diagnose?crop=${encodeURIComponent(name.toLowerCase())}`}
              >
                <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020906] via-[#020906]/30 to-transparent opacity-90" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <span className="font-display text-xl tracking-wide" style={{ color: '#e8f5ee' }}>{name}</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center glass-card group-hover:scale-110 transition-transform" style={{ background: 'rgba(52,211,153,0.15)' }}>
                    <CheckCircle2 size={14} color="#34d399" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-em-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-display text-sm">Analyze {name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 relative" style={{ background: 'linear-gradient(to top, transparent, rgba(52,211,153,0.02))' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="" title="How It" accent="Works" />

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[17%] right-[17%] h-px z-0" style={{
              background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.25) 20%, rgba(52,211,153,0.25) 80%, transparent)'
            }} />

            {[
              { step: '01', title: 'Upload Images', desc: 'Submit leaf and/or stem photos. JPG, PNG, WebP accepted up to 10 MB per image.', emoji: '📸' },
              { step: '02', title: 'AI Analysis',   desc: 'MobileNetV2 CNN processes images via dual-pipeline architecture calculating disease probability.', emoji: '🧠' },
              { step: '03', title: 'Get Results',   desc: 'Receive disease classification, severity, overall health score and targeted treatment recommendations.', emoji: '📋' },
            ].map(({ step, title, desc, emoji }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass-card p-8 relative z-10 text-center"
              >
                <div className="text-4xl mb-5">{emoji}</div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-700 mx-auto mb-4"
                  style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.30)', color: '#34d399', fontFamily: 'Space Mono' }}
                >
                  {step}
                </div>
                <h3 className="font-display text-lg mb-3" style={{ color: '#c0e0d0' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FIVE-LEVEL HEALTH CLASSIFICATION ─────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="" title="Five-Level" accent="Health Classification" />

          <div className="glass-bright p-8 space-y-4">
            {classifications.map(({ label, color, pct, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-5 group"
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 12px ${color}80` }} />
                <div className="w-28 flex-shrink-0">
                  <span className="text-sm font-600" style={{ color, fontFamily: 'Outfit', letterSpacing: '0.05em' }}>{label}</span>
                </div>
                <div className="flex-1">
                  <div className="hbar">
                    <motion.div
                      className="hbar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct || 5}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.1 + 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ background: `linear-gradient(90deg, ${color}55, ${color})`, boxShadow: `0 0 10px ${color}60` }}
                    />
                  </div>
                </div>
                <div className="text-sm w-48 text-right hidden sm:block" style={{ color: '#2e4a3a' }}>{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER ───────────────────────────────────────── */}
      <footer className="py-10 px-6 mt-10" style={{ borderTop: '1px solid rgba(52,211,153,0.08)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-em-600 to-em-300 flex items-center justify-center">
              <Leaf size={14} color="#011a0e" />
            </div>
            <div>
              <span className="font-display text-sm text-glow block leading-tight">AgroSense AI</span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color: '#2a4a35' }}>Intelligent Crop Health Platform</span>
            </div>
          </div>
          <p className="text-xs font-mono" style={{ color: '#1e3028' }}>© 2025 AgroSense AI · All rights reserved</p>
          <div className="flex gap-6">
            {[['Diagnose', '/diagnose'], ['Weather', '/weather'], ['History', '/history'], ['About', '/about']].map(([l, p]) => (
              <Link key={p} to={p} className="text-xs font-500 transition-colors duration-200"
                style={{ color: '#2a4035', fontFamily: 'Inter' }}
                onMouseEnter={e => e.target.style.color = '#34d399'}
                onMouseLeave={e => e.target.style.color = '#2a4035'}
              >{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
