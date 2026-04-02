import { motion } from 'framer-motion'
import {
  AlertTriangle, CheckCircle, XCircle, Info,
  Droplets, Bug, ShieldCheck, TrendingUp, Activity
} from 'lucide-react'
import { apiUrl } from '../utils/api'

const UI_TEXT = {
  en: {
    healthy: 'Healthy', preventive: 'Preventive', treatable: 'Treatable', critical: 'Critical', remove: 'Remove Plant',
    confidence: 'Confidence', aiDiagnosis: 'AI Diagnosis',
    prevention: 'Prevention', treatment: 'Treatment', fertilizer: 'Fertilizer Plan', viability: 'Plant Viability'
  },
  hi: {
    healthy: 'स्वस्थ', preventive: 'निवारक', treatable: 'उपचार योग्य', critical: 'गंभीर', remove: 'प्लांट हटाएं',
    confidence: 'विश्वास', aiDiagnosis: 'AI निदान',
    prevention: 'रोकथाम', treatment: 'उपचार', fertilizer: 'खाद योजना', viability: 'प्लांट जीवनक्षमता'
  },
  mr: {
    healthy: 'निरोगी', preventive: 'निवारक', treatable: 'उपचारयोग्य', critical: 'गंभीर', remove: 'झाड काढा',
    confidence: 'विश्वास', aiDiagnosis: 'AI निदान',
    prevention: 'रोख', treatment: 'उपचार', fertilizer: 'खत योजना', viability: 'झाड जीवनक्षमता'
  },
  te: {
    healthy: 'ఆరోగ్యకరం', preventive: 'నివారణ', treatable: 'చికిత్సాయోగ్యం', critical: 'తీవ్రం', remove: 'మొక్క తీసివేయండి',
    confidence: 'విశ్వాసం', aiDiagnosis: 'AI నిర్ధారణ',
    prevention: 'నివారణ', treatment: 'చికిత్స', fertilizer: 'ఎరువు ప్రణాళిక', viability: 'మొక్క వైజీవికత'
  }
}

const SEV = (lang) => {
  const t = UI_TEXT[lang] || UI_TEXT.en
  return {
    Healthy:    { color: '#34d399', bg: 'rgba(52,211,153,0.09)',  border: 'rgba(52,211,153,0.25)',  icon: CheckCircle,   label: t.healthy },
    Preventive: { color: '#38bdf8', bg: 'rgba(56,189,248,0.09)',  border: 'rgba(56,189,248,0.25)',  icon: Info,          label: t.preventive },
    Treatable:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.09)',  border: 'rgba(245,158,11,0.25)',  icon: AlertTriangle, label: t.treatable },
    Critical:   { color: '#f43f5e', bg: 'rgba(244,63,94,0.09)',   border: 'rgba(244,63,94,0.25)',   icon: XCircle,       label: t.critical },
    Remove:     { color: '#a855f7', bg: 'rgba(168,85,247,0.09)',  border: 'rgba(168,85,247,0.25)',  icon: XCircle,       label: t.remove },
  }
}

function Ring({ value, size = 82, color }) {
  const r = size / 2 - 9
  const c = 2 * Math.PI * r
  const offset = ((100 - value) / 100) * c
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 7px ${color}90)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: 15, color }}>{value}</span>
      </div>
    </div>
  )
}

function Block({ icon: Icon, title, items, color, bg }) {
  return (
    <div className="glass-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bg }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-sm font-600" style={{ color }}>{title}</span>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#8ab89a' }}>
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ResultCard({ result, lang = 'en' }) {
  if (!result) return null
  const t = UI_TEXT[lang] || UI_TEXT.en
  const sev = SEV(lang)
  const {
    disease_name = 'Unknown', classification = 'Healthy', confidence = 0,
    severity_score = 0, health_score = 100, cdi_score = 0,
    leaf_result, stem_result, prevention = [], treatment = [], fertilizer = [], viability = '',
  } = result
  const cfg = sev[classification] || sev.Healthy
  const SevIcon = cfg.icon

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="space-y-4">

      {/* Header */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}70, transparent)` }} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <SevIcon size={16} style={{ color: cfg.color }} />
              <span className="chip" style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}35` }}>
                {cfg.label}
              </span>
            </div>
            <h3 className="font-display text-xl text-em-100 mb-1.5 leading-tight">{disease_name}</h3>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span style={{ color: cfg.color }}>
                {t.confidence}: {(confidence * 100).toFixed(1)}%
              </span>
              <span style={{ color: '#3d6050' }}>·</span>
              <span style={{ color: '#5a7a68' }}>{t.aiDiagnosis}</span>
            </div>
          </div>
          <Ring value={Math.round(health_score)} color={cfg.color} />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Health', value: Math.round(health_score), color: cfg.color, unit: '' },
          { label: 'Severity', value: Math.round(severity_score), color: severity_score > 60 ? '#f43f5e' : '#f59e0b', unit: '' },
          { label: 'CDI Index', value: cdi_score.toFixed(2), color: '#a855f7', unit: '' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-sm p-4 text-center">
            <div className="font-mono text-xl font-600 mb-1" style={{ color }}>{value}</div>
            <div className="text-xs uppercase tracking-wider" style={{ color: '#3d5a47' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Leaf/Stem sub */}
      {(leaf_result || stem_result) && (
        <div className="grid grid-cols-2 gap-3">
          {leaf_result && (
            <div className="glass-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={12} style={{ color: '#34d399' }} />
                <span className="text-xs font-600" style={{ color: '#9ac9b5' }}>Leaf Analysis</span>
              </div>
              <p className="text-sm font-500" style={{ color: '#ddeee5' }}>{leaf_result.disease || 'No disease'}</p>
              <p className="text-xs mt-1 font-mono" style={{ color: '#34d399' }}>{((leaf_result.confidence || 0) * 100).toFixed(1)}% conf.</p>
            </div>
          )}
          {stem_result && (
            <div className="glass-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={12} style={{ color: '#f59e0b' }} />
                <span className="text-xs font-600" style={{ color: '#9ac9b5' }}>Stem Analysis</span>
              </div>
              <p className="text-sm font-500" style={{ color: '#ddeee5' }}>{stem_result.condition || 'Normal'}</p>
              <p className="text-xs mt-1 font-mono" style={{ color: '#f59e0b' }}>Browning {((stem_result.brown_ratio || 0) * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-3">
        {prevention.length > 0 && (
          <Block icon={ShieldCheck} title={t.prevention} items={prevention} color="#38bdf8" bg="rgba(56,189,248,0.1)" />
        )}
        {treatment.length > 0 && (
          <Block icon={Bug} title={t.treatment} items={treatment} color="#f59e0b" bg="rgba(245,158,11,0.1)" />
        )}
        {fertilizer.length > 0 && (
          <Block icon={Droplets} title={t.fertilizer} items={fertilizer} color="#34d399" bg="rgba(52,211,153,0.1)" />
        )}
        {viability && (
          <div className="glass-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: '#5a7a68' }} />
              <span className="text-sm font-600" style={{ color: '#9ac9b5' }}>{t.viability}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#7a9d88' }}>{viability}</p>
          </div>
        )}
      </div>

      {/* Download PDF */}
      <div className="flex justify-center">
        <button
          onClick={() => window.open(apiUrl(`/api/v1/history/${result.id}/pdf`), '_blank')}
          className="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
          Download Report PDF
        </button>
      </div>
    </motion.div>
  )
}
