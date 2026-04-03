import { motion } from 'framer-motion'
import { Leaf, Cpu, Globe, CloudSun, BarChart3, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const UI_TEXT = {
  en: {
    badge: 'About AgroSense AI', title: 'Intelligent', titleAccent: 'Crop Health', titleSuffix: 'Platform',
    desc: 'AgroSense AI is an ML-powered platform built for Indian farmers and agricultural professionals. It combines computer vision, weather intelligence, and multilingual support to make precision agriculture easier to use.',
    missionTitle: 'Our Mission',
    missionText1: 'India loses a large share of crop yield to plant diseases that could be detected earlier. AgroSense AI brings expert-style crop diagnosis to a farmer’s phone.',
    missionText2: 'By combining image analysis with live weather signals, the platform helps farmers understand both what is happening to the crop and which field conditions are increasing the risk.',
    weatherTitle: 'Weather Intelligence',
    weatherDesc: 'Real-time weather monitoring with crop disease risk assessment helps farmers act before conditions worsen.',
    languageTitle: '4-Language Support',
    languageDesc: 'The interface is available in English, Hindi, Marathi, and Telugu so the app stays useful in the field.',
    techTitle: 'Technology Stack', ctaTitle: 'Ready to protect your harvest?', ctaDesc: 'Start a free analysis now and get instant crop health insights.', ctaBtn: 'Analyse Crops Free',
    stats: [
      { v: '97.3%', l: 'Detection Accuracy' },
      { v: '50K+', l: 'Training Images' },
      { v: '25+', l: 'Disease Classes' },
      { v: '4', l: 'Languages' },
    ],
    tech: [
      { name: 'MobileNetV2 CNN', desc: 'A lightweight CNN fine-tuned on crop disease imagery for fast plant diagnosis.' },
      { name: 'Color Deviation Index', desc: 'A stress indicator based on image color deviation to capture plant health changes.' },
      { name: 'Adaptive Signal Fusion', desc: 'Leaf, stem, and CDI signals are fused for stronger final predictions.' },
      { name: 'Open-Meteo Weather API', desc: 'Weather conditions are layered into the app to support disease risk awareness.' },
      { name: 'React + Framer Motion', desc: 'A responsive frontend with smooth interaction patterns.' },
      { name: 'FastAPI + MongoDB', desc: 'A Python backend with persistent diagnosis history storage.' },
    ]
  },
  hi: {
    badge: 'एग्रोसेंस एआई के बारे में', title: 'स्मार्ट', titleAccent: 'फसल स्वास्थ्य', titleSuffix: 'प्लेटफ़ॉर्म',
    desc: 'एग्रोसेंस एआई भारतीय किसानों और कृषि विशेषज्ञों के लिए बनाया गया एमएल-आधारित प्लेटफ़ॉर्म है। यह कंप्यूटर विज़न, मौसम जानकारी और बहुभाषी सहायता को जोड़ता है।',
    missionTitle: 'हमारा उद्देश्य',
    missionText1: 'भारत में फसल का बड़ा हिस्सा ऐसे रोगों से प्रभावित होता है जिन्हें पहले पहचाना जा सकता था। एग्रोसेंस एआई किसान के फोन तक विशेषज्ञ जैसी सहायता पहुंचाता है।',
    missionText2: 'छवि विश्लेषण और लाइव मौसम संकेतों को जोड़कर यह प्लेटफ़ॉर्म बताता है कि फसल में क्या हो रहा है और कौन सी परिस्थितियाँ जोखिम बढ़ा रही हैं।',
    weatherTitle: 'मौसम जानकारी', weatherDesc: 'रियल-टाइम मौसम निगरानी और रोग जोखिम आकलन किसानों को समय रहते कार्रवाई करने में मदद करते हैं।',
    languageTitle: '4-भाषा समर्थन', languageDesc: 'इंटरफ़ेस अंग्रेज़ी, हिंदी, मराठी और तेलुगु में उपलब्ध है ताकि ऐप खेत में भी उपयोगी रहे।',
    techTitle: 'तकनीकी आधार', ctaTitle: 'क्या आप अपनी फसल की रक्षा के लिए तैयार हैं?', ctaDesc: 'अभी मुफ्त विश्लेषण शुरू करें और तुरंत फसल स्वास्थ्य जानकारी पाएं।', ctaBtn: 'फसल का मुफ्त विश्लेषण',
    stats: [
      { v: '97.3%', l: 'पहचान सटीकता' },
      { v: '50K+', l: 'प्रशिक्षण छवियाँ' },
      { v: '25+', l: 'रोग वर्ग' },
      { v: '4', l: 'भाषाएँ' },
    ],
    tech: [
      { name: 'MobileNetV2 CNN', desc: 'तेज़ पौधा निदान के लिए crop disease imagery पर fine-tuned हल्का CNN।' },
      { name: 'Color Deviation Index', desc: 'पौधे के स्वास्थ्य में बदलाव पकड़ने वाला रंग-आधारित तनाव संकेतक।' },
      { name: 'Adaptive Signal Fusion', desc: 'मजबूत अंतिम पूर्वानुमान के लिए पत्ती, तना और CDI संकेतों को जोड़ा जाता है।' },
      { name: 'Open-Meteo Weather API', desc: 'रोग जोखिम की समझ बढ़ाने के लिए मौसम की परत जोड़ी गई है।' },
      { name: 'React + Framer Motion', desc: 'स्मूद इंटरैक्शन वाला responsive frontend।' },
      { name: 'FastAPI + MongoDB', desc: 'स्थायी निदान इतिहास संग्रह के साथ Python backend।' },
    ]
  },
  mr: {
    badge: 'AgroSense AI बद्दल', title: 'स्मार्ट', titleAccent: 'पीक आरोग्य', titleSuffix: 'प्लॅटफॉर्म',
    desc: 'AgroSense AI हा भारतीय शेतकरी आणि कृषी व्यावसायिकांसाठी तयार केलेला एमएल-आधारित प्लॅटफॉर्म आहे. तो संगणक दृष्टी, हवामान माहिती आणि बहुभाषिक सहाय्य एकत्र करतो.',
    missionTitle: 'आमचे ध्येय',
    missionText1: 'भारतात पिकांचे मोठे नुकसान अशा रोगांमुळे होते जे लवकर ओळखता आले असते. AgroSense AI शेतकऱ्याच्या फोनवर तज्ज्ञांसारखी मदत आणतो.',
    missionText2: 'प्रतिमा विश्लेषण आणि लाइव्ह हवामान संकेत एकत्र करून हा प्लॅटफॉर्म पिकात काय घडते आहे आणि कोणत्या परिस्थितींमुळे धोका वाढतो हे समजावतो.',
    weatherTitle: 'हवामान माहिती', weatherDesc: 'रिअल-टाइम हवामान निरीक्षण आणि रोग जोखीम मोजमाप शेतकऱ्यांना योग्य वेळी कृती करण्यास मदत करतात.',
    languageTitle: '4-भाषा समर्थन', languageDesc: 'इंटरफेस इंग्रजी, हिंदी, मराठी आणि तेलुगूमध्ये उपलब्ध आहे त्यामुळे अॅप शेतातही उपयुक्त राहते.',
    techTitle: 'तांत्रिक पाया', ctaTitle: 'तुमच्या पिकाचे संरक्षण करण्यासाठी तयार आहात?', ctaDesc: 'आता मोफत विश्लेषण सुरू करा आणि त्वरित पीक आरोग्य माहिती मिळवा.', ctaBtn: 'मोफत विश्लेषण सुरू करा',
    stats: [
      { v: '97.3%', l: 'ओळख अचूकता' },
      { v: '50K+', l: 'प्रशिक्षण प्रतिमा' },
      { v: '25+', l: 'रोग वर्ग' },
      { v: '4', l: 'भाषा' },
    ],
    tech: [
      { name: 'MobileNetV2 CNN', desc: 'जलद पीक निदानासाठी crop disease imagery वर fine-tuned हलका CNN.' },
      { name: 'Color Deviation Index', desc: 'वनस्पती आरोग्यातील बदल मोजणारा रंग-आधारित ताण सूचक.' },
      { name: 'Adaptive Signal Fusion', desc: 'जास्त अचूकतेसाठी पान, खोड आणि CDI संकेत एकत्र केले जातात.' },
      { name: 'Open-Meteo Weather API', desc: 'रोग धोका समजण्यासाठी हवामान डेटा अॅपमध्ये जोडलेला आहे.' },
      { name: 'React + Framer Motion', desc: 'मऊ अनुभव देणारा responsive frontend.' },
      { name: 'FastAPI + MongoDB', desc: 'स्थायी निदान इतिहास जतन करणारा Python backend.' },
    ]
  },
  te: {
    badge: 'AgroSense AI గురించి', title: 'స్మార్ట్', titleAccent: 'పంట ఆరోగ్యం', titleSuffix: 'ప్లాట్‌ఫారం',
    desc: 'AgroSense AI భారతీయ రైతులు మరియు వ్యవసాయ నిపుణుల కోసం రూపొందించిన ఎంఎల్ ఆధారిత ప్లాట్‌ఫారం. ఇది కంప్యూటర్ విజన్, వాతావరణ సమాచారం మరియు బహుభాషా మద్దతును కలుపుతుంది.',
    missionTitle: 'మా లక్ష్యం',
    missionText1: 'భారతదేశంలో పంట దిగుబడిలో పెద్ద భాగం ముందే గుర్తించవచ్చిన వ్యాధుల వల్ల నష్టపోతుంది. AgroSense AI రైతు ఫోన్‌కే నిపుణుల స్థాయి సహాయాన్ని తీసుకువస్తుంది.',
    missionText2: 'చిత్ర విశ్లేషణను లైవ్ వాతావరణ సంకేతాలతో కలిపి పంటలో ఏమి జరుగుతోంది మరియు ఏ పరిస్థితులు ప్రమాదాన్ని పెంచుతున్నాయి అనేది ఈ ప్లాట్‌ఫారం చూపిస్తుంది.',
    weatherTitle: 'వాతావరణ సమాచారం', weatherDesc: 'రియల్-టైమ్ వాతావరణ పరిశీలన మరియు వ్యాధి ప్రమాద అంచనా రైతులకు సరైన సమయంలో చర్య తీసుకోవడంలో సహాయపడతాయి.',
    languageTitle: '4-భాషల మద్దతు', languageDesc: 'ఇంటర్‌ఫేస్ ఇంగ్లీష్, హిందీ, మరాఠీ మరియు తెలుగు భాషల్లో అందుబాటులో ఉంటుంది.',
    techTitle: 'సాంకేతిక ఆధారం', ctaTitle: 'మీ పంటను రక్షించడానికి సిద్ధంగా ఉన్నారా?', ctaDesc: 'ఇప్పుడే ఉచిత విశ్లేషణ ప్రారంభించి వెంటనే పంట ఆరోగ్య వివరాలు పొందండి.', ctaBtn: 'ఉచిత విశ్లేషణ ప్రారంభించండి',
    stats: [
      { v: '97.3%', l: 'గుర్తింపు ఖచ్చితత్వం' },
      { v: '50K+', l: 'శిక్షణ చిత్రాలు' },
      { v: '25+', l: 'వ్యాధి వర్గాలు' },
      { v: '4', l: 'భాషలు' },
    ],
    tech: [
      { name: 'MobileNetV2 CNN', desc: 'వేగవంతమైన పంట నిర్ధారణ కోసం crop disease imagery పై fine-tuned తేలికైన CNN.' },
      { name: 'Color Deviation Index', desc: 'మొక్క ఆరోగ్యంలో మార్పులను పట్టుకునే రంగు-ఆధారిత ఒత్తిడి సూచిక.' },
      { name: 'Adaptive Signal Fusion', desc: 'మరింత బలమైన అంచనాల కోసం ఆకు, కాండం మరియు CDI సంకేతాలు కలపబడతాయి.' },
      { name: 'Open-Meteo Weather API', desc: 'వ్యాధి ప్రమాద అవగాహన కోసం వాతావరణ డేటా యాప్‌లో చేర్చబడింది.' },
      { name: 'React + Framer Motion', desc: 'సున్నితమైన అనుభవాన్ని ఇచ్చే responsive frontend.' },
      { name: 'FastAPI + MongoDB', desc: 'శాశ్వత నిర్ధారణ చరిత్ర నిల్వతో Python backend.' },
    ]
  },
}

const techMeta = [
  { color: '#34d399', icon: Cpu },
  { color: '#38bdf8', icon: BarChart3 },
  { color: '#f59e0b', icon: Shield },
  { color: '#a855f7', icon: CloudSun },
  { color: '#34d399', icon: Leaf },
  { color: '#38bdf8', icon: Cpu },
]

export default function AboutPage({ lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.06), transparent 70%)', filter: 'blur(55px)' }} />

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="badge mb-6 mx-auto inline-flex" style={{ color: '#34d399', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.22)' }}>
            <Leaf size={11} color="#34d399" />
            {t.badge}
          </div>
          <h1 className="font-display mb-5" style={{ fontSize: 'clamp(32px, 6vw, 58px)', color: '#e8f5ee' }}>
            {t.title} <span className="text-glow">{t.titleAccent}</span> {t.titleSuffix}
          </h1>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{t.desc}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {t.stats.map(({ v, l }, i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }} className="glass-bright p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(52,211,153,0.07), transparent)' }} />
              <div className="num-glow text-4xl mb-2 relative">{v}</div>
              <div className="text-xs font-mono uppercase tracking-wider relative" style={{ color: '#3d5a47' }}>{l}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-bright p-9 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08), transparent)', filter: 'blur(45px)' }} />
          <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
            <div>
              <h2 className="font-display text-2xl mb-5" style={{ color: '#e8f5ee' }}>{t.missionTitle}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{t.missionText1}</p>
              <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{t.missionText2}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src="/crops/chilly.png" alt="Chilly" className="w-full h-40 object-cover rounded-2xl" />
              <img src="/crops/grapes.png" alt="Grapes" className="w-full h-40 object-cover rounded-2xl translate-y-6" />
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-bright p-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.28)' }}>
              <CloudSun size={22} color="#38bdf8" />
            </div>
            <h3 className="font-display text-xl mb-2.5" style={{ color: '#e8f5ee' }}>{t.weatherTitle}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{t.weatherDesc}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-bright p-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.28)' }}>
              <Globe size={22} color="#34d399" />
            </div>
            <h3 className="font-display text-xl mb-2.5" style={{ color: '#e8f5ee' }}>{t.languageTitle}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{t.languageDesc}</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h2 className="font-display text-2xl mb-7" style={{ color: '#e8f5ee' }}>{t.techTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.tech.map(({ name, desc }, i) => {
              const meta = techMeta[i]
              const Icon = meta.icon
              return (
                <motion.div key={name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass-sm p-5 flex items-start gap-4" style={{ borderRadius: '16px' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}26` }}>
                    <Icon size={16} style={{ color: meta.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-600 mb-1.5" style={{ color: '#c0e0d0', fontFamily: 'Outfit' }}>{name}</div>
                    <div className="text-xs leading-relaxed" style={{ color: '#3d5a47', fontFamily: 'Inter' }}>{desc}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-bright p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(52,211,153,0.07), transparent)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.65), transparent)' }} />
          <div className="text-4xl mb-5">🌿</div>
          <h2 className="font-display text-2xl mb-3" style={{ color: '#e8f5ee' }}>{t.ctaTitle}</h2>
          <p className="text-sm mb-7 max-w-md mx-auto" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{t.ctaDesc}</p>
          <Link to="/diagnose" className="btn-primary inline-flex">
            <Leaf size={17} color="#011a0e" />
            {t.ctaBtn}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
