import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Leaf, Cpu, BarChart3, ArrowRight, Microscope,
  Sprout, CloudSun, Globe, CheckCircle2, Scan, Shield
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { translateClassification } from '../utils/localization'

const UI_TEXT = {
  en: {
    platform: 'AgroSense AI Platform',
    heroTitle1: 'See What Is', heroTitle2: 'Hurting', heroTitle3: 'Your Crops.',
    heroDesc: 'Upload leaf and stem images to detect disease, estimate severity, and get treatment guidance in seconds.',
    analyzeBtn: 'Analyse My Crops', accuracy: 'Accuracy', trainingImages: 'Training Images', processing: 'Processing', analyzingLeaf: 'Analyzing Leaf...', alert: 'Alert', earlyBlight: 'Early Blight Detected',
    sectionLabel: 'Platform Features', sectionTitle: 'About', sectionAccent: 'AgroSense AI',
    cropsTitle: 'Crops', cropsAccent: 'Supported', howTitle: 'How It', howAccent: 'Works', classTitle: 'Five-Level', classAccent: 'Health Classification',
    footerTag: 'Intelligent Crop Health Platform', copyright: '© 2026 AgroSense AI · All rights reserved', analyzeCrop: 'Analyze',
    features: [
      { title: 'Multi-Organ Analysis', desc: 'Leaf and stem signals are processed together for a fuller plant health picture.' },
      { title: 'MobileNetV2 CNN', desc: 'Fast image analysis tuned for crop disease detection.' },
      { title: 'Color Deviation Index', desc: 'CDI tracks crop stress through visual color changes.' },
      { title: 'Adaptive Fusion', desc: 'Signals are fused to improve the final diagnosis.' },
      { title: 'Live Weather Intel', desc: 'Weather context helps farmers understand local disease risk.' },
      { title: '4-Language Support', desc: 'English, Hindi, Marathi, and Telugu are available across the app.' },
    ],
    steps: [
      { step: '01', title: 'Upload Images', desc: 'Add clear leaf and/or stem images from your field.' },
      { step: '02', title: 'AI Analysis', desc: 'The model inspects disease signals, stem stress, and CDI patterns.' },
      { step: '03', title: 'Get Results', desc: 'You receive health scores, severity, and next-step recommendations.' },
    ],
    classes: [
      { key: 'Healthy', desc: 'No intervention needed' },
      { key: 'Preventive', desc: 'Monitor and use preventive care' },
      { key: 'Treatable', desc: 'Treatment is recommended' },
      { key: 'Critical', desc: 'Urgent attention required' },
      { key: 'Remove', desc: 'Remove the plant to protect nearby crops' },
    ],
    crops: ['Tomato', 'Cotton', 'Grapes', 'Chilly', 'Capsicum', 'Maize', 'Cabbage', 'Corn', 'Bottle Gourd'],
  },
  hi: {
    platform: 'एग्रोसेंस एआई प्लेटफ़ॉर्म',
    heroTitle1: 'देखें क्या', heroTitle2: 'नुकसान पहुँचा रहा है', heroTitle3: 'आपकी फसल को।',
    heroDesc: 'पत्ती और तना छवियाँ अपलोड करें, रोग पहचानें, गंभीरता मापें और कुछ ही सेकंड में उपचार सुझाव पाएँ।',
    analyzeBtn: 'मेरी फसल का विश्लेषण करें', accuracy: 'सटीकता', trainingImages: 'प्रशिक्षण छवियाँ', processing: 'प्रोसेसिंग', analyzingLeaf: 'पत्ती का विश्लेषण...', alert: 'अलर्ट', earlyBlight: 'अर्ली ब्लाइट पाया गया',
    sectionLabel: 'प्लेटफ़ॉर्म विशेषताएँ', sectionTitle: 'एग्रोसेंस एआई', sectionAccent: 'के बारे में',
    cropsTitle: 'समर्थित', cropsAccent: 'फसलें', howTitle: 'यह कैसे', howAccent: 'काम करता है', classTitle: 'पाँच-स्तरीय', classAccent: 'स्वास्थ्य वर्गीकरण',
    footerTag: 'स्मार्ट फसल स्वास्थ्य प्लेटफ़ॉर्म', copyright: '© 2026 AgroSense AI · सर्वाधिकार सुरक्षित', analyzeCrop: 'विश्लेषण करें',
    features: [
      { title: 'मल्टी-ऑर्गन विश्लेषण', desc: 'पत्ती और तना संकेतों को साथ में प्रोसेस कर बेहतर स्वास्थ्य चित्र मिलता है।' },
      { title: 'MobileNetV2 CNN', desc: 'फसल रोग पहचान के लिए तेज़ छवि विश्लेषण।' },
      { title: 'रंग विचलन सूचकांक', desc: 'CDI रंग बदलावों के जरिए फसल तनाव मापता है।' },
      { title: 'एडैप्टिव फ्यूज़न', desc: 'अंतिम निदान को बेहतर बनाने के लिए संकेतों को जोड़ा जाता है।' },
      { title: 'लाइव मौसम जानकारी', desc: 'मौसम संदर्भ स्थानीय रोग जोखिम समझने में मदद करता है।' },
      { title: '4-भाषा समर्थन', desc: 'पूरा ऐप अंग्रेज़ी, हिंदी, मराठी और तेलुगु में उपलब्ध है।' },
    ],
    steps: [
      { step: '01', title: 'छवियाँ अपलोड करें', desc: 'अपने खेत से साफ पत्ती और/या तना छवियाँ जोड़ें।' },
      { step: '02', title: 'एआई विश्लेषण', desc: 'मॉडल रोग संकेत, तना तनाव और CDI पैटर्न की जाँच करता है।' },
      { step: '03', title: 'परिणाम पाएँ', desc: 'आपको स्वास्थ्य स्कोर, गंभीरता और आगे की सलाह मिलती है।' },
    ],
    classes: [
      { key: 'Healthy', desc: 'हस्तक्षेप की आवश्यकता नहीं' },
      { key: 'Preventive', desc: 'निगरानी और निवारक देखभाल करें' },
      { key: 'Treatable', desc: 'उपचार की सिफारिश की जाती है' },
      { key: 'Critical', desc: 'तुरंत ध्यान आवश्यक' },
      { key: 'Remove', desc: 'पास की फसलों की रक्षा के लिए पौधा हटाएँ' },
    ],
    crops: ['टमाटर', 'कपास', 'अंगूर', 'मिर्च', 'शिमला मिर्च', 'मक्का', 'पत्तागोभी', 'कॉर्न', 'लौकी'],
  },
  mr: {
    platform: 'AgroSense AI प्लॅटफॉर्म',
    heroTitle1: 'तुमच्या पिकाला', heroTitle2: 'काय त्रास देत आहे', heroTitle3: 'ते पाहा.',
    heroDesc: 'पान आणि खोड प्रतिमा अपलोड करा, रोग ओळखा, तीव्रता मोजा आणि काही सेकंदांत उपचार सूचना मिळवा.',
    analyzeBtn: 'माझ्या पिकाचे विश्लेषण करा', accuracy: 'अचूकता', trainingImages: 'प्रशिक्षण प्रतिमा', processing: 'प्रक्रिया', analyzingLeaf: 'पानाचे विश्लेषण...', alert: 'अलर्ट', earlyBlight: 'अर्ली ब्लाइट आढळला',
    sectionLabel: 'प्लॅटफॉर्म वैशिष्ट्ये', sectionTitle: 'AgroSense AI', sectionAccent: 'विषयी',
    cropsTitle: 'समर्थित', cropsAccent: 'पिके', howTitle: 'हे कसे', howAccent: 'काम करते', classTitle: 'पाच-स्तरीय', classAccent: 'आरोग्य वर्गीकरण',
    footerTag: 'स्मार्ट पीक आरोग्य प्लॅटफॉर्म', copyright: '© 2026 AgroSense AI · सर्व हक्क राखीव', analyzeCrop: 'विश्लेषण करा',
    features: [
      { title: 'मल्टी-ऑर्गन विश्लेषण', desc: 'पान आणि खोड संकेत एकत्र प्रक्रिया करून अधिक चांगले आरोग्य चित्र मिळते.' },
      { title: 'MobileNetV2 CNN', desc: 'पीक रोग ओळखण्यासाठी जलद प्रतिमा विश्लेषण.' },
      { title: 'रंग विचलन निर्देशांक', desc: 'CDI रंग बदलांद्वारे पिकावरील ताण ओळखतो.' },
      { title: 'अ‍ॅडॅप्टिव फ्यूजन', desc: 'अंतिम निदान सुधारण्यासाठी संकेत एकत्र केले जातात.' },
      { title: 'लाइव्ह हवामान माहिती', desc: 'हवामान संदर्भ स्थानिक रोग धोका समजण्यास मदत करतो.' },
      { title: '4-भाषा समर्थन', desc: 'संपूर्ण अॅप इंग्रजी, हिंदी, मराठी आणि तेलुगूमध्ये उपलब्ध आहे.' },
    ],
    steps: [
      { step: '01', title: 'प्रतिमा अपलोड करा', desc: 'शेतातील स्पष्ट पान आणि/किंवा खोड प्रतिमा जोडा.' },
      { step: '02', title: 'एआय विश्लेषण', desc: 'मॉडेल रोग संकेत, खोड ताण आणि CDI नमुने तपासते.' },
      { step: '03', title: 'निकाल मिळवा', desc: 'तुम्हाला आरोग्य स्कोर, तीव्रता आणि पुढील शिफारसी मिळतात.' },
    ],
    classes: [
      { key: 'Healthy', desc: 'हस्तक्षेपाची गरज नाही' },
      { key: 'Preventive', desc: 'निगराणी आणि प्रतिबंधक काळजी घ्या' },
      { key: 'Treatable', desc: 'उपचाराची शिफारस केली जाते' },
      { key: 'Critical', desc: 'त्वरित लक्ष आवश्यक' },
      { key: 'Remove', desc: 'शेजारच्या पिकांचे संरक्षण करण्यासाठी झाड काढा' },
    ],
    crops: ['टोमॅटो', 'कापूस', 'द्राक्षे', 'मिरची', 'ढोबळी मिरची', 'मका', 'कोबी', 'कॉर्न', 'दुधी भोपळा'],
  },
  te: {
    platform: 'AgroSense AI ప్లాట్‌ఫారం',
    heroTitle1: 'మీ పంటకు', heroTitle2: 'ఏం నష్టం కలిగిస్తోంది', heroTitle3: 'అది చూడండి.',
    heroDesc: 'ఆకు మరియు కాండం చిత్రాలను అప్‌లోడ్ చేసి వ్యాధిని గుర్తించండి, తీవ్రత అంచనా వేయండి, కొన్ని సెకండ్లలో చికిత్స సూచనలు పొందండి.',
    analyzeBtn: 'నా పంటను విశ్లేషించండి', accuracy: 'ఖచ్చితత్వం', trainingImages: 'శిక్షణ చిత్రాలు', processing: 'ప్రాసెసింగ్', analyzingLeaf: 'ఆకు విశ్లేషణ...', alert: 'అలర్ట్', earlyBlight: 'ఎర్లీ బ్లైట్ గుర్తించబడింది',
    sectionLabel: 'ప్లాట్‌ఫారం లక్షణాలు', sectionTitle: 'AgroSense AI', sectionAccent: 'గురించి',
    cropsTitle: 'మద్దతు ఉన్న', cropsAccent: 'పంటలు', howTitle: 'ఇది ఎలా', howAccent: 'పనిచేస్తుంది', classTitle: 'ఐదు-స్థాయి', classAccent: 'ఆరోగ్య వర్గీకరణ',
    footerTag: 'స్మార్ట్ పంట ఆరోగ్య ప్లాట్‌ఫారం', copyright: '© 2026 AgroSense AI · అన్ని హక్కులు రిజర్వు', analyzeCrop: 'విశ్లేషించండి',
    features: [
      { title: 'మల్టీ-ఆర్గన్ విశ్లేషణ', desc: 'ఆకు మరియు కాండం సంకేతాలను కలిపి విశ్లేషించడం వల్ల మంచి ఆరోగ్య దృశ్యం లభిస్తుంది.' },
      { title: 'MobileNetV2 CNN', desc: 'పంట వ్యాధి గుర్తింపుకు వేగవంతమైన చిత్రం విశ్లేషణ.' },
      { title: 'రంగ మార్పు సూచిక', desc: 'CDI రంగ మార్పుల ఆధారంగా పంట ఒత్తిడిని కొలుస్తుంది.' },
      { title: 'అడాప్టివ్ ఫ్యూజన్', desc: 'చివరి నిర్ధారణను మెరుగుపరచడానికి సంకేతాలు కలపబడతాయి.' },
      { title: 'లైవ్ వాతావరణ సమాచారం', desc: 'వాతావరణ సందర్భం స్థానిక వ్యాధి ప్రమాదాన్ని అర్థం చేసుకోవడంలో సహాయపడుతుంది.' },
      { title: '4-భాషల మద్దతు', desc: 'మొత్తం యాప్ ఇంగ్లీష్, హిందీ, మరాఠీ మరియు తెలుగులో అందుబాటులో ఉంది.' },
    ],
    steps: [
      { step: '01', title: 'చిత్రాలు అప్‌లోడ్ చేయండి', desc: 'మీ పొలం నుండి స్పష్టమైన ఆకు మరియు/లేదా కాండం చిత్రాలను జోడించండి.' },
      { step: '02', title: 'ఏఐ విశ్లేషణ', desc: 'మోడల్ వ్యాధి సంకేతాలు, కాండం ఒత్తిడి మరియు CDI నమూనాలను పరిశీలిస్తుంది.' },
      { step: '03', title: 'ఫలితాలు పొందండి', desc: 'మీకు ఆరోగ్య స్కోర్, తీవ్రత మరియు తదుపరి సూచనలు లభిస్తాయి.' },
    ],
    classes: [
      { key: 'Healthy', desc: 'చర్య అవసరం లేదు' },
      { key: 'Preventive', desc: 'గమనించి నివారణ చర్యలు తీసుకోండి' },
      { key: 'Treatable', desc: 'చికిత్స సిఫారసు చేయబడింది' },
      { key: 'Critical', desc: 'తక్షణ శ్రద్ధ అవసరం' },
      { key: 'Remove', desc: 'పక్క పంటలను కాపాడటానికి మొక్కను తొలగించండి' },
    ],
    crops: ['టమోటా', 'పత్తి', 'ద్రాక్ష', 'మిర్చి', 'క్యాప్సికం', 'మొక్కజొన్న', 'క్యాబేజీ', 'కార్న్', 'సొరకాయ'],
  },
}

const featureMeta = [
  { icon: Microscope, color: '#34d399' },
  { icon: Cpu, color: '#38bdf8' },
  { icon: BarChart3, color: '#f59e0b' },
  { icon: Shield, color: '#34d399' },
  { icon: CloudSun, color: '#38bdf8' },
  { icon: Globe, color: '#f59e0b' },
]

const cropImages = [
  { slug: 'tomato', img: '/crops/tomato.png' },
  { slug: 'cotton', img: '/crops/cotton.png' },
  { slug: 'grapes', img: '/crops/grapes.png' },
  { slug: 'chilly', img: '/crops/chilly.png' },
  { slug: 'capsicum', img: '/crops/capsicum.png' },
  { slug: 'maize', img: '/crops/maize.png' },
  { slug: 'cabbage', img: '/crops/cabbage.jpg?v=2' },
  { slug: 'corn', img: '/crops/corn.jpg?v=2' },
  { slug: 'bottle-gourd', img: '/crops/bottle_guard.png' },
]

const classColors = {
  Healthy: '#34d399',
  Preventive: '#38bdf8',
  Treatable: '#f59e0b',
  Critical: '#f43f5e',
  Remove: '#a855f7',
}

function SectionHeader({ label, title, accent }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
      {label && <div className="sec-label mb-4">{label}</div>}
      <h2 className="font-display leading-tight" style={{ fontSize: 'clamp(30px, 5vw, 50px)', color: '#e8f5ee' }}>
        {title} <span className="text-glow">{accent}</span>
      </h2>
    </motion.div>
  )
}

export default function LandingPage({ lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const { user } = useAuth()
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const handleAnalyzeClick = () => {
    if (user) navigate('/diagnose')
    else navigate('/diagnose')
  }

  return (
    <div className="overflow-hidden relative">
      <section ref={heroRef} className="relative min-h-screen flex items-center px-6 pt-24 pb-20">
        <div className="absolute -left-16 top-20 h-80 w-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.12), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -right-16 bottom-20 h-96 w-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="badge mb-6 inline-flex" style={{ color: '#34d399', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-em-400 animate-breathe" />
              {t.platform}
              <span className="w-1.5 h-1.5 rounded-full bg-em-400 animate-breathe" />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }} className="font-display leading-[1.05] mb-6" style={{ fontSize: 'clamp(44px, 6vw, 76px)' }}>
              <span style={{ color: '#c8e8d6' }}>{t.heroTitle1} </span>
              <span className="text-glow">{t.heroTitle2}</span>
              <br />
              <span style={{ color: '#c8e8d6' }}>{t.heroTitle3}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }} className="text-lg mb-10 leading-relaxed max-w-lg" style={{ color: '#4d6e5c', fontWeight: 300 }}>
              {t.heroDesc}
            </motion.p>

            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.32 }} onClick={handleAnalyzeClick} className="btn-primary gap-2.5 group px-8 py-4 text-[15px] w-full sm:w-auto justify-center inline-flex">
              <Sprout size={17} color="#011a0e" />
              {t.analyzeBtn}
              <ArrowRight size={15} color="#011a0e" className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

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

          <motion.div style={{ y: heroY, opacity: heroOpacity }} initial={{ opacity: 0, scale: 0.9, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative">
            <div className="glass-card p-4 rounded-3xl relative overflow-hidden" style={{ background: 'rgba(52,211,153,0.03)' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-em-500/10 to-sky-500/10 pointer-events-none" />
              <img src="/hero-crop.png" alt="AgroSense AI hero" className="w-full h-[500px] object-cover rounded-2xl" />
              <div className="absolute top-8 -left-6 glass-bright px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-float" style={{ animationDelay: '0s' }}>
                <Scan size={20} color="#34d399" />
                <div>
                  <div className="text-xs font-mono text-em-200">{t.processing}</div>
                  <div className="text-sm font-display text-white">{t.analyzingLeaf}</div>
                </div>
              </div>
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

      <section className="py-24 px-6 relative" style={{ background: 'linear-gradient(to bottom, transparent, rgba(52,211,153,0.02))' }}>
        <div className="max-w-6xl mx-auto relative">
          <SectionHeader label={t.sectionLabel} title={t.sectionTitle} accent={t.sectionAccent} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.map(({ title, desc }, i) => {
              const meta = featureMeta[i]
              const Icon = meta.icon
              return (
                <motion.div key={title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-7">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative" style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}28` }}>
                    <Icon size={22} style={{ color: meta.color }} />
                  </div>
                  <h3 className="font-display text-base mb-2.5" style={{ color: '#c0e0d0' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c' }}>{desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title={t.cropsTitle} accent={t.cropsAccent} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {cropImages.map(({ slug, img }, i) => {
              const cropName = t.crops[i]
              return (
                <motion.div key={slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass-sm group relative overflow-hidden rounded-2xl aspect-[16/10] cursor-pointer" onClick={() => navigate(`/diagnose?crop=${encodeURIComponent(slug.replace('-', ' '))}`)}>
                  <img src={img} alt={cropName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020906] via-[#020906]/30 to-transparent opacity-90" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                    <span className="font-display text-xl tracking-wide" style={{ color: '#e8f5ee' }}>{cropName}</span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center glass-card group-hover:scale-110 transition-transform" style={{ background: 'rgba(52,211,153,0.15)' }}>
                      <CheckCircle2 size={14} color="#34d399" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-em-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-display text-sm">{t.analyzeCrop} {cropName}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative" style={{ background: 'linear-gradient(to top, transparent, rgba(52,211,153,0.02))' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader title={t.howTitle} accent={t.howAccent} />
          <div className="grid md:grid-cols-3 gap-6">
            {t.steps.map(({ step, title, desc }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-card p-8 text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-700 mx-auto mb-4" style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.30)', color: '#34d399', fontFamily: 'Space Mono' }}>{step}</div>
                <h3 className="font-display text-lg mb-3" style={{ color: '#c0e0d0' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title={t.classTitle} accent={t.classAccent} />
          <div className="glass-bright p-8 space-y-4">
            {t.classes.map(({ key, desc }, i) => {
              const color = classColors[key]
              const pct = [5, 25, 55, 82, 100][i]
              return (
                <motion.div key={key} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-5 group">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 12px ${color}80` }} />
                  <div className="w-28 flex-shrink-0"><span className="text-sm font-600" style={{ color, fontFamily: 'Outfit', letterSpacing: '0.05em' }}>{translateClassification(key, lang)}</span></div>
                  <div className="flex-1">
                    <div className="hbar">
                      <motion.div className="hbar-fill" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.1 + 0.3 }} style={{ background: `linear-gradient(90deg, ${color}55, ${color})`, boxShadow: `0 0 10px ${color}60` }} />
                    </div>
                  </div>
                  <div className="text-sm w-48 text-right hidden sm:block" style={{ color: '#2e4a3a' }}>{desc}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 mt-10" style={{ borderTop: '1px solid rgba(52,211,153,0.08)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-em-600 to-em-300 flex items-center justify-center">
              <Leaf size={14} color="#011a0e" />
            </div>
            <div>
              <span className="font-display text-sm text-glow block leading-tight">AgroSense AI</span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color: '#2a4a35' }}>{t.footerTag}</span>
            </div>
          </div>
          <p className="text-xs font-mono" style={{ color: '#1e3028' }}>{t.copyright}</p>
          <div className="flex gap-6">
            {[['Diagnose', '/diagnose'], ['Weather', '/weather'], ['History', '/history'], ['About', '/about']].map(([label, path]) => (
              <Link key={path} to={path} className="text-xs font-500 transition-colors duration-200" style={{ color: '#2a4035', fontFamily: 'Inter' }} onMouseEnter={(e) => { e.target.style.color = '#34d399' }} onMouseLeave={(e) => { e.target.style.color = '#2a4035' }}>
                {label === 'Diagnose' ? t.analyzeBtn : label === 'Weather' ? (lang === 'hi' ? 'मौसम' : lang === 'mr' ? 'हवामान' : lang === 'te' ? 'వాతావరణం' : 'Weather') : label === 'History' ? (lang === 'hi' ? 'इतिहास' : lang === 'mr' ? 'इतिहास' : lang === 'te' ? 'చరిత్ర' : 'History') : (lang === 'hi' ? 'अबाउट' : lang === 'mr' ? 'अबाउट' : lang === 'te' ? 'గురించి' : 'About')}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
