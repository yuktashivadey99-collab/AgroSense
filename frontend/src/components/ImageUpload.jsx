import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Upload, X, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const UI_TEXT = {
  en: { recommended: 'Recommended', optional: 'Optional', drop: 'Drop image or', browse: 'browse', fileTypes: 'JPG, PNG, WebP · max 10MB' },
  hi: { recommended: 'अनुशंसित', optional: 'वैकल्पिक', drop: 'छवि छोड़ें या', browse: 'ब्राउज़ करें', fileTypes: 'JPG, PNG, WebP · अधिकतम 10MB' },
  mr: { recommended: 'शिफारस केलेले', optional: 'पर्यायी', drop: 'प्रतिमा टाका किंवा', browse: 'ब्राउझ करा', fileTypes: 'JPG, PNG, WebP · कमाल 10MB' },
  te: { recommended: 'సిఫార్సు చేయబడింది', optional: 'ఐచ్ఛికం', drop: 'చిత్రాన్ని వదలండి లేదా', browse: 'బ్రౌజ్ చేయండి', fileTypes: 'JPG, PNG, WebP · గరిష్ఠం 10MB' },
}

export default function ImageUpload({ label, sublabel, icon: Icon, value, onChange, lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const [drag, setDrag] = useState(false)
  const inputRef = useRef()
  const previewUrl = useMemo(() => (value ? URL.createObjectURL(value) : null), [value])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    onChange(file)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [onChange])

  const onDragEnter = (e) => {
    e.preventDefault()
    setDrag(true)
  }

  const onDragOver = (e) => { e.preventDefault() }
  const onDragLeave = (e) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDrag(false)
    }
  }

  const translatedSublabel = sublabel === 'Recommended' ? t.recommended : sublabel === 'Optional' ? t.optional : sublabel

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-em-500" />}
          <span className="text-sm font-600" style={{ color: '#c9e8d8' }}>{label}</span>
        </div>
        <span className="chip text-xs" style={{
          color: translatedSublabel === t.recommended ? '#34d399' : '#5a7a68',
          background: translatedSublabel === t.recommended ? 'rgba(52,211,153,0.08)' : 'rgba(52,211,153,0.04)',
          border: `1px solid ${translatedSublabel === t.recommended ? 'rgba(52,211,153,0.25)' : 'rgba(52,211,153,0.1)'}`,
        }}>
          {translatedSublabel}
        </span>
      </div>

      <div
        className={`upload-zone relative transition-all ${drag ? 'drag-over' : ''} ${value ? 'border-solid border-em-400/30' : ''}`}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !value && inputRef.current.click()}
        style={{ cursor: value ? 'default' : 'pointer' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files[0])
            e.target.value = ''
          }}
        />

        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <img src={previewUrl} alt="preview" className="w-full h-36 object-cover rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent rounded-xl" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-em-400" />
                  <span className="text-em-300 text-xs font-500 truncate max-w-[120px]">{value.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onChange(null) }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(244,63,94,0.18)', color: '#f43f5e' }}
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-2"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.18)' }}>
                <Upload size={20} style={{ color: '#34d399' }} />
              </div>
              <div>
                <p className="text-sm font-500" style={{ color: '#a7c4b5' }}>
                  {t.drop} <span style={{ color: '#34d399' }}>{t.browse}</span>
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#3d5a47' }}>{t.fileTypes}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
