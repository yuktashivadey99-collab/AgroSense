import { motion } from 'framer-motion'
import { Leaf, Cpu, Globe, CloudSun, BarChart3, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const UI_TEXT = {
  en: {
    badge: 'About AgroSense AI',
    title: 'Intelligent',
    titleAccent: 'Crop Health',
    titleSuffix: 'Platform',
    desc: 'AgroSense AI is an ML-powered platform built for Indian farmers and agricultural professionals. We combine computer vision, weather intelligence and multilingual support to make precision agriculture accessible to everyone.',
    missionTitle: 'Our Mission',
    missionText1: 'Every year, India loses 15–25% of crop yield to plant diseases that could be detected early. AgroSense AI democratises access to expert-level crop diagnostics — no agronomist needed, no expensive lab required. Just a smartphone camera.',
    missionText2: 'With real-time weather data integrated alongside AI image analysis, farmers can now understand not just what disease is affecting their crops, but <em style={{ color: \'#6ee7b7\' }}>why</em> it\'s spreading and what conditions to watch for.',
    weatherTitle: 'Weather Intelligence',
    weatherDesc: 'Real-time weather monitoring with crop disease risk assessment. High humidity + warmth = fungal infection alert. Powered by the free Open-Meteo API — no keys, no cost.',
    languageTitle: '4-Language Support',
    languageDesc: 'Complete UI localisation in English, हिन्दी, मराठी, and తెలుగు. Switch languages from the navbar — designed for India\'s linguistic diversity.',
    techTitle: 'Technology Stack',
    stats: [
      { v: '97.3%', l: 'Detection Accuracy' },
      { v: '50K+',  l: 'Training Images'    },
      { v: '25+',   l: 'Disease Classes'    },
      { v: '4',     l: 'Languages'          },
    ],
    tech: [
      { name: 'MobileNetV2 CNN', desc: 'Lightweight yet powerful CNN pre-trained on ImageNet, fine-tuned on 50K+ crop disease images.' },
      { name: 'Color Deviation Index', desc: 'Proprietary CDI metric using HSV colour space analysis to quantify plant stress at pixel level.' },
      { name: 'Adaptive Signal Fusion', desc: 'Weighted ensemble of leaf CNN, stem browning ratio, and CDI for final classification.' },
      { name: 'Open-Meteo Weather API', desc: 'Free, open-source weather API providing real-time and forecast data without API keys.' },
      { name: 'React + Framer Motion', desc: 'Blazing fast frontend with fluid micro-animations and responsive layouts.' },
      { name: 'Flask + MongoDB', desc: 'Lightweight Python backend with persistent diagnosis history storage.' },
    ]
  },
  hi: {
    badge: 'एग्रोसेन्स एआई के बारे में',
    title: 'बुद्धिमान',
    titleAccent: 'फसल स्वास्थ्य',
    titleSuffix: 'प्लेटफॉर्म',
    desc: 'एग्रोसेन्स एआई भारतीय किसानों और कृषि पेशेवरों के लिए बनाया गया एमएल-संचालित प्लेटफॉर्म है। हम कंप्यूटर विजन, मौसम खुफिया और बहुभाषी समर्थन को जोड़ते हैं ताकि सटीक कृषि को सभी के लिए सुलभ बनाया जा सके।',
    stats: [
      { v: '97.3%', l: 'पता लगाने की सटीकता' },
      { v: '50K+',  l: 'प्रशिक्षण छवियां'    },
      { v: '25+',   l: 'रोग वर्ग'    },
      { v: '4',     l: 'भाषाएं'          },
    ],
    tech: [
      { name: 'मोबाइलनेटवी2 सीएनएन', desc: 'इमेजनेट पर पूर्व-प्रशिक्षित हल्का लेकिन शक्तिशाली सीएनएन, 50K+ फसल रोग छवियों पर फाइन-ट्यून्ड।' },
      { name: 'रंग विचलन सूचकांक', desc: 'एचएसवी रंग स्थान विश्लेषण का उपयोग करके पिक्सेल स्तर पर पौधे के तनाव को मात्रात्मक करने वाला स्वामित्व सीडीआई मीट्रिक।' },
      { name: 'अनुकूलनीय संकेत फ्यूजन', desc: 'अंतिम वर्गीकरण के लिए पत्ती सीएनएन, तना भूरी अनुपात और सीडीआई का भारित समूह।' },
      { name: 'ओपन-मेटियो मौसम एपीआई', desc: 'एपीआई कुंजियों के बिना वास्तविक समय और पूर्वानुमान डेटा प्रदान करने वाला निःशुल्क, खुला स्रोत मौसम एपीआई।' },
      { name: 'रिएक्ट + फ्रेमर मोशन', desc: 'तरल माइक्रो-एनीमेशन और प्रतिक्रियाशील लेआउट के साथ तेज़ फ्रंटएंड।' },
      { name: 'फ्लास्क + मोंगोडीबी', desc: 'स्थायी निदान इतिहास भंडारण के साथ हल्का पायथन बैकएंड।' },
    ]
  },
  mr: {
    badge: 'एग्रोसेन्स एआय विषयी',
    title: 'बुद्धिमान',
    titleAccent: 'पिक आरोग्य',
    titleSuffix: 'प्लॅटफॉर्म',
    desc: 'एग्रोसेन्स एआय भारतीय शेतकऱ्यांसाठी आणि कृषी व्यावसायिकांसाठी तयार केलेला एमएल-चालित प्लॅटफॉर्म आहे. आम्ही संगणक दृष्टी, हवामान बुद्धिमत्ता आणि बहुभाषिक समर्थन एकत्र करतो जेणेकरून अचूक शेती सर्वांसाठी प्रवेशयोग्य व्हावी.',
    stats: [
      { v: '97.3%', l: 'ओळखण्याची अचूकता' },
      { v: '50K+',  l: 'प्रशिक्षण प्रतिमा'    },
      { v: '25+',   l: 'रोग वर्ग'    },
      { v: '4',     l: 'भाषा'          },
    ],
    tech: [
      { name: 'मोबाइलनेटव्ही2 सीएनएन', desc: 'इमेजनेटवर पूर्व-प्रशिक्षित हलके परंतु शक्तिशाली सीएनएन, 50K+ पिक रोग प्रतिमांवर फाइन-ट्यून्ड.' },
      { name: 'रंग विचलन निर्देशांक', desc: 'एचएसव्ही रंग जागा विश्लेषण वापरून पिक्सेल स्तरावर वनस्पती तणाव क्वांटिफाई करण्यासाठी मालकी सीडीआय मेट्रिक.' },
      { name: 'अनुकूल संकेत फ्यूजन', desc: 'अंतिम वर्गीकरणासाठी पान सीएनएन, खोड भूरी प्रमाण आणि सीडीआयचे भारित समूह.' },
      { name: 'ओपन-मेटियो हवामान एपीआय', desc: 'एपीआय कीशिवाय रिअल-टाइम आणि अंदाज डेटा प्रदान करणारे मोफत, खुला स्रोत हवामान एपीआय.' },
      { name: 'रिएक्ट + फ्रेमर मोशन', desc: 'द्रव मायक्रो-अॅनिमेशन आणि प्रतिसादात्मक लेआउटसह झळक फ्रंटएंड.' },
      { name: 'फ्लास्क + मोंगोडीबी', desc: 'स्थायी निदान इतिहास संग्रहणासह हलके पायथन बॅकएंड.' },
    ]
  },
  te: {
    badge: 'అగ్రోసెన్స్ ఎఐ గురించి',
    title: 'బుద్ధిమంతమైన',
    titleAccent: 'పంట ఆరోగ్యం',
    titleSuffix: 'ప్లాట్‌ఫారమ్',
    desc: 'అగ్రోసెన్స్ ఎఐ భారతీయ రైతులు మరియు వ్యవసాయ నిపుణుల కోసం నిర్మించిన ఎమ్‌ఎల్-చాలిత ప్లాట్‌ఫారమ్. మేము కంప్యూటర్ విజన్, వాతావరణ బుద్ధిమత్త మరియు బహుభాషా మద్దతును కలిపి ఖచ్చితమైన వ్యవసాయాన్ని అందరికీ అందుబాటులోకి తీసుకువస్తాము.',
    stats: [
      { v: '97.3%', l: 'గుర్తింపు ఖచ్చితత్వం' },
      { v: '50K+',  l: 'శిక్షణ చిత్రాలు'    },
      { v: '25+',   l: 'వ్యాధి తరగతులు'    },
      { v: '4',     l: 'భాషలు'          },
    ],
    tech: [
      { name: 'మొబైల్‌నెట్‌వర్క్‌వి2 సీఎన్‌ఎన్', desc: 'ఇమేజ్‌నెట్‌లో ముందుగా శిక్షించబడిన తేలికైన కానీ శక్తివంతమైన సీఎన్‌ఎన్, 50K+ పంట వ్యాధి చిత్రాలపై ఫైన్-ట్యూన్డ్.' },
      { name: 'రంగ విచలన సూచిక', desc: 'పిక్సెల్ స్థాయిలో మొక్క ఒత్తిడిని క్వాంటిఫై చేయడానికి హెచ్‌ఎస్‌వి రంగ స్థల విశ్లేషణను ఉపయోగించే స్వంత సీడీఐ మెట్రిక్.' },
      { name: 'అనుకూల సిగ్నల్ ఫ్యూజన్', desc: 'అంతిమ వర్గీకరణ కోసం ఆకు సీఎన్‌ఎన్, కాండం బ్రౌనింగ్ రేషియో మరియు సీడీఐ యొక్క బరువు ఎన్సెంబుల్.' },
      { name: 'ఓపెన్-మెటియో వాతావరణ ఎపిఐ', desc: 'ఎపిఐ కీలు లేకుండా రియల్-టైమ్ మరియు అంచనా డేటాను అందించే ఉచిత, ఓపెన్-సోర్స్ వాతావరణ ఎపిఐ.' },
      { name: 'రియాక్ట్ + ఫ్రేమర్ మోషన్', desc: 'ద్రవ మైక్రో-యానిమేషన్‌లు మరియు ప్రతిస్పందన లేఅవుట్‌లతో వేగవంతమైన ఫ్రంటెండ్.' },
      { name: 'ఫ్లాస్క్ + మంగోడిబి', desc: 'నిరంతర నిర్ధారణ చరిత్ర నిల్వతో తేలికైన పైథాన్ బ్యాకెండ్.' },
    ]
  }
}

const tech = [
  { name: 'MobileNetV2 CNN',       desc: 'Lightweight yet powerful CNN pre-trained on ImageNet, fine-tuned on 50K+ crop disease images.', color: '#34d399', icon: Cpu    },
  { name: 'Color Deviation Index', desc: 'Proprietary CDI metric using HSV colour space analysis to quantify plant stress at pixel level.', color: '#38bdf8', icon: BarChart3 },
  { name: 'Adaptive Signal Fusion',desc: 'Weighted ensemble of leaf CNN, stem browning ratio, and CDI for final classification.',           color: '#f59e0b', icon: Shield  },
  { name: 'Open-Meteo Weather API',desc: 'Free, open-source weather API providing real-time and forecast data without API keys.',           color: '#a855f7', icon: CloudSun},
  { name: 'React + Framer Motion', desc: 'Blazing fast frontend with fluid micro-animations and responsive layouts.',                       color: '#34d399', icon: Leaf   },
  { name: 'Flask + MongoDB',       desc: 'Lightweight Python backend with persistent diagnosis history storage.',                           color: '#38bdf8', icon: Cpu    },
]

const stats = [
  { v: '97.3%', l: 'Detection Accuracy' },
  { v: '50K+',  l: 'Training Images'    },
  { v: '25+',   l: 'Disease Classes'    },
  { v: '4',     l: 'Languages'          },
]

export default function AboutPage({ lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.06), transparent 70%)', filter: 'blur(55px)' }} />

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="badge mb-6 mx-auto inline-flex" style={{ color: '#34d399', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.22)' }}>
            <Leaf size={11} color="#34d399" />
            {t.badge}
          </div>
          <h1 className="font-display mb-5" style={{ fontSize: 'clamp(32px, 6vw, 58px)', color: '#e8f5ee' }}>
            {t.title} <span className="text-glow">{t.titleAccent}</span> {t.titleSuffix}
          </h1>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>
            {t.desc}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {t.stats.map(({ v, l }, i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
              className="glass-bright p-6 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(52,211,153,0.07), transparent)' }} />
              <div className="num-glow text-4xl mb-2 relative">{v}</div>
              <div className="text-xs font-mono uppercase tracking-wider relative" style={{ color: '#3d5a47' }}>{l}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-bright p-9 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08), transparent)', filter: 'blur(45px)' }} />
          <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
            <div>
              <h2 className="font-display text-2xl mb-5" style={{ color: '#e8f5ee' }}>{t.missionTitle || 'Our Mission'}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>
                {t.missionText1 || 'Every year, India loses 15–25% of crop yield to plant diseases that could be detected early. AgroSense AI democratises access to expert-level crop diagnostics — no agronomist needed, no expensive lab required. Just a smartphone camera.'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>
                {t.missionText2 || 'With real-time weather data integrated alongside AI image analysis, farmers can now understand not just what disease is affecting their crops, but <em style={{ color: \'#6ee7b7\' }}>why</em> it\'s spreading and what conditions to watch for.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src="/crops/chilly.png" alt="Chilly" className="w-full h-40 object-cover rounded-2xl" />
              <img src="/crops/grapes.png" alt="Grapes" className="w-full h-40 object-cover rounded-2xl translate-y-6" />
            </div>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-bright p-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.28)' }}>
              <CloudSun size={22} color="#38bdf8" />
            </div>
            <h3 className="font-display text-xl mb-2.5" style={{ color: '#e8f5ee' }}>{t.weatherTitle || 'Weather Intelligence'}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>
              {t.weatherDesc || 'Real-time weather monitoring with crop disease risk assessment. High humidity + warmth = fungal infection alert. Powered by the free Open-Meteo API — no keys, no cost.'}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-bright p-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.28)' }}>
              <Globe size={22} color="#34d399" />
            </div>
            <h3 className="font-display text-xl mb-2.5" style={{ color: '#e8f5ee' }}>{t.languageTitle || '4-Language Support'}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>
              {t.languageDesc || 'Complete UI localisation in English, हिन्दी, मराठी, and తెలుగు. Switch languages from the navbar — designed for India\'s linguistic diversity.'}
            </p>
          </motion.div>
        </div>

        {/* Tech stack */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h2 className="font-display text-2xl mb-7" style={{ color: '#e8f5ee' }}>{t.techTitle || 'Technology Stack'}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.tech.map(({ name, desc }, i) => {
              const techItem = tech[i] || tech[0]
              return (
                <motion.div key={name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="glass-sm p-5 flex items-start gap-4" style={{ borderRadius: '16px' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${techItem.color}12`, border: `1px solid ${techItem.color}26` }}>
                    <techItem.icon size={16} style={{ color: techItem.color }} />
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

        {/* CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-bright p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(52,211,153,0.07), transparent)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.65), transparent)' }} />
          <div className="text-4xl mb-5">🌿</div>
          <h2 className="font-display text-2xl mb-3" style={{ color: '#e8f5ee' }}>Ready to protect your harvest?</h2>
          <p className="text-sm mb-7 max-w-md mx-auto" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>Start a free analysis now. No account needed.</p>
          <Link to="/diagnose" className="btn-primary inline-flex">
            <Leaf size={17} color="#011a0e" />
            Analyse Crops Free
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
