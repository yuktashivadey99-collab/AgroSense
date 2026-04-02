import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, Trash2, Search, SlidersHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiClient } from '../utils/api'

const UI_TEXT = {
  en: {
    title: 'Diagnosis History', subtitle: 'Track all previous crop health diagnoses and monitor trends.',
    totalScans: 'Total Scans', healthy: 'Healthy', critical: 'Critical', treatable: 'Treatable',
    searchPlaceholder: 'Search disease name…', all: 'All', remove: 'Remove',
    noRecords: 'No records found. Run your first analysis!', health: 'Health', conf: 'Conf', records: 'Your Analysis Records', recordRemoved: 'Record removed'
  },
  hi: {
    title: 'निदान इतिहास', subtitle: 'सभी पिछले फसल स्वास्थ्य निदान को ट्रैक करें और रुझानों की निगरानी करें।',
    totalScans: 'कुल स्कैन', healthy: 'स्वस्थ', critical: 'गंभीर', treatable: 'उपचार योग्य',
    searchPlaceholder: 'रोग नाम खोजें…', all: 'सभी', remove: 'हटाएं',
    noRecords: 'कोई रिकॉर्ड नहीं मिला। अपना पहला विश्लेषण चलाएं!', health: 'स्वास्थ्य', conf: 'विश्वास', records: 'आपके विश्लेषण रिकॉर्ड', recordRemoved: 'रिकॉर्ड हटाया गया'
  },
  mr: {
    title: 'निदान इतिहास', subtitle: 'सर्व मागील पीक आरोग्य निदान ट्रॅक करा आणि ट्रेंडचे निरीक्षण करा.',
    totalScans: 'एकूण स्कॅन', healthy: 'निरोगी', critical: 'गंभीर', treatable: 'उपचारयोग्य',
    searchPlaceholder: 'रोग नाव शोधा…', all: 'सर्व', remove: 'काढा',
    noRecords: 'कोणतेही रेकॉर्ड सापडले नाहीत. आपला पहिला विश्लेषण चालवा!', health: 'आरोग्य', conf: 'विश्वास', records: 'आपले विश्लेषण रेकॉर्ड', recordRemoved: 'रेकॉर्ड काढला'
  },
  te: {
    title: 'నిర్ధారణ చరిత్ర', subtitle: 'మునుపటి పంట ఆరోగ్య నిర్ధారణలన్నింటినీ ట్రాక్ చేయండి మరియు ట్రెండ్‌లను పర్యవేక్షించండి.',
    totalScans: 'మొత్తం స్కాన్‌లు', healthy: 'ఆరోగ్యకరం', critical: 'తీవ్రం', treatable: 'చికిత్సాయోగ్యం',
    searchPlaceholder: 'వ్యాధి పేరు వెతకండి…', all: 'అన్ని', remove: 'తీసివేయండి',
    noRecords: 'రికార్డులు కనుగొనబడలేదు. మీ మొదటి విశ్లేషణను నడపండి!', health: 'ఆరోగ్యం', conf: 'విశ్వాసం', records: 'మీ విశ్లేషణ రికార్డులు', recordRemoved: 'రికార్డ్ తీసివేయబడింది'
  }
}

const DEMO = [
  { _id: '1', disease_name: 'Early Blight (Alternaria solani)', classification: 'Treatable',  health_score: 61, confidence: 0.873, created_at: new Date(Date.now() - 86400000).toISOString()  },
  { _id: '2', disease_name: 'Healthy Plant',                    classification: 'Healthy',    health_score: 96, confidence: 0.944, created_at: new Date(Date.now() - 172800000).toISOString() },
  { _id: '3', disease_name: 'Late Blight (Phytophthora infestans)', classification: 'Critical', health_score: 22, confidence: 0.91, created_at: new Date(Date.now() - 259200000).toISOString() },
  { _id: '4', disease_name: 'Powdery Mildew',                   classification: 'Preventive', health_score: 78, confidence: 0.802, created_at: new Date(Date.now() - 345600000).toISOString() },
  { _id: '5', disease_name: 'Leaf Rust',                        classification: 'Treatable',  health_score: 55, confidence: 0.761, created_at: new Date(Date.now() - 432000000).toISOString() },
]

const CC = {
  Healthy:    '#34d399',
  Preventive: '#38bdf8',
  Treatable:  '#f59e0b',
  Critical:   '#f43f5e',
  Remove:     '#a855f7',
}

const CATS = ['All', 'Healthy', 'Preventive', 'Treatable', 'Critical', 'Remove']

const getTranslatedCat = (cat, lang) => {
  const translations = {
    en: { All: 'All', Healthy: 'Healthy', Preventive: 'Preventive', Treatable: 'Treatable', Critical: 'Critical', Remove: 'Remove' },
    hi: { All: 'सभी', Healthy: 'स्वस्थ', Preventive: 'निवारक', Treatable: 'उपचार योग्य', Critical: 'गंभीर', Remove: 'हटाएं' },
    mr: { All: 'सर्व', Healthy: 'निरोगी', Preventive: 'निवारक', Treatable: 'उपचारयोग्य', Critical: 'गंभीर', Remove: 'काढा' },
    te: { All: 'అన్ని', Healthy: 'ఆరోగ్యకరం', Preventive: 'నివారణ', Treatable: 'చికిత్సాయోగ్యం', Critical: 'తీవ్రం', Remove: 'తీసివేయండి' }
  }
  return translations[lang]?.[cat] || cat
}

export default function HistoryPage({ lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('All')

  useEffect(() => {
    apiClient.get('/api/history')
      .then(r => setRecords(r.data.records || []))
      .catch(() => setRecords(DEMO))
      .finally(() => setLoading(false))
  }, [])

  const del = async (id) => {
    try { await apiClient.delete(`/api/history/${id}`) } catch {}
    setRecords(p => p.filter(r => r._id !== id))
    toast.success(t.recordRemoved)
  }

  const filtered = records.filter(r => {
    const ms = r.disease_name?.toLowerCase().includes(search.toLowerCase())
    const mf = filter === 'All' || r.classification === filter
    return ms && mf
  })

  const summary = [
    { label: t.totalScans, value: records.length,                                           color: '#34d399' },
    { label: t.healthy,     value: records.filter(r => r.classification === 'Healthy').length,   color: '#34d399' },
    { label: t.critical,    value: records.filter(r => r.classification === 'Critical').length,   color: '#f43f5e' },
    { label: t.treatable,   value: records.filter(r => r.classification === 'Treatable').length,  color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.05), transparent 70%)', filter: 'blur(55px)' }} />

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="mb-11">
          <div className="flex items-center gap-2.5 mb-3">
            <History size={16} color="#34d399" />
            <span className="sec-label">Diagnosis History</span>
          </div>
          <h1 className="font-display mb-2.5" style={{ fontSize: 'clamp(28px, 5vw, 44px)', color: '#e8f5ee' }}>
            {t.records}
          </h1>
          <p className="text-sm" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{t.subtitle}</p>
        </motion.div>

        {/* Summary stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-9">
          {summary.map(({ label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="glass-bright p-5 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${color}0a, transparent)` }} />
              <div className="font-display text-3xl mb-1.5 relative" style={{ color, fontFamily: 'Outfit', fontWeight: 800 }}>{value}</div>
              <div className="text-xs uppercase tracking-wider font-mono relative" style={{ color: '#3d5a47' }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 mb-7">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#3d5a47' }} />
            <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} className="inp pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <SlidersHorizontal size={13} style={{ color: '#3d5a47', flexShrink: 0 }} />
            {CATS.map(cat => {
              const catColor = CC[cat] || '#34d399'
              const isActive = filter === cat
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-3.5 py-2 rounded-2xl text-xs font-mono transition-all duration-200"
                  style={{
                    background: isActive ? `${catColor}14` : 'rgba(52,211,153,0.03)',
                    color:      isActive ? catColor        : '#3d5a47',
                    border:     isActive ? `1px solid ${catColor}35` : '1px solid rgba(52,211,153,0.08)',
                    boxShadow:  isActive ? `0 0 16px ${catColor}18` : 'none',
                  }}
                >
                  {getTranslatedCat(cat, lang)}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Records list */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl h-[76px] animate-pulse" style={{ background: 'rgba(52,211,153,0.03)' }} />
            ))
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-bright rounded-3xl p-16 text-center">
              <History size={40} className="mx-auto mb-4" style={{ color: '#1e3028' }} />
              <p className="text-sm" style={{ color: '#3d5a47', fontFamily: 'Inter' }}>{t.noRecords}</p>
            </motion.div>
          ) : (
            filtered.map(({ _id, disease_name, classification, health_score, confidence, created_at }, i) => {
              const col = CC[classification] || '#34d399'
              return (
                <motion.div
                  key={_id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-bright p-5 flex items-center gap-4 group transition-all duration-250 hover:border-em-400/20"
                  style={{ borderRadius: 20 }}
                >
                  {/* Color indicator */}
                  <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ background: col, boxShadow: `0 0 12px ${col}70` }} />

                  {/* Health ring */}
                  <div className="flex-shrink-0 hidden sm:block">
                    <div className="relative w-11 h-11">
                      <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                        <circle cx="22" cy="22" r="16" fill="none" stroke={col} strokeWidth="4" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 16}
                          strokeDashoffset={2 * Math.PI * 16 * (1 - health_score / 100)}
                          style={{ filter: `drop-shadow(0 0 5px ${col}80)` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-mono font-700" style={{ color: col }}>{Math.round(health_score)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-600 truncate" style={{ color: '#c0e0d0', fontFamily: 'Outfit' }}>{disease_name}</span>
                      <span className="chip" style={{ color: col, background: `${col}12`, border: `1px solid ${col}28` }}>{classification}</span>
                    </div>
                    <div className="flex gap-4 text-xs font-mono flex-wrap" style={{ color: '#3d5a47' }}>
                      <span>{t.health}: <span style={{ color: col }}>{Math.round(health_score)}%</span></span>
                      <span>{t.conf}: <span style={{ color: '#5a7a68' }}>{(confidence * 100).toFixed(0)}%</span></span>
                      <span>{new Date(created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => del(_id)}
                    className="p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200"
                    style={{ color: '#3d5a47' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.10)'; e.currentTarget.style.color = '#f43f5e' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3d5a47' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
