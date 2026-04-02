import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CloudSun, Wind, Droplets, Thermometer, Eye, Sun,
  MapPin, RefreshCw, AlertTriangle, CloudRain, Cloud,
  CloudSnow, Zap, Gauge, Sunrise, Sunset
} from 'lucide-react'

const UI_TEXT = {
  en: {
    title: 'Weather Intelligence', subtitle: 'Real-time weather data and crop disease risk assessment for optimal farming decisions.',
    searchLocation: 'Search location…', currentLocation: 'Use Current Location', loading: 'Loading weather data…',
    highRisk: 'High Disease Risk', moderateRisk: 'Moderate Risk', lowRisk: 'Low Risk',
    temperature: 'Temperature', humidity: 'Humidity', windSpeed: 'Wind Speed', pressure: 'Pressure',
    visibility: 'Visibility', uvIndex: 'UV Index', sunrise: 'Sunrise', sunset: 'Sunset',
    feelsLike: 'Feels like', precipitation: 'Precipitation', windDirection: 'Wind Direction',
    forecast: '7-Day Forecast', today: 'Today', tomorrow: 'Tomorrow', dayAfter: 'Day After',
    failedFetch: 'Failed to fetch weather data. Check your connection.',
    locationPermission: 'Location access denied. Please enter a location manually.',
    enterLocation: 'Please enter a location to get weather data.',
    search: 'Search', yourLocation: 'Your Location', useMyLocation: 'Use my location',
    locationNotFound: 'Location not found. Try a different name.',
    geocodingFailed: 'Geocoding failed. Try again.'
  },
  hi: {
    title: 'मौसम बुद्धिमत्ता', subtitle: 'वास्तविक समय मौसम डेटा और फसल रोग जोखिम मूल्यांकन इष्टतम कृषि निर्णयों के लिए।',
    searchLocation: 'स्थान खोजें…', currentLocation: 'वर्तमान स्थान का उपयोग करें', loading: 'मौसम डेटा लोड हो रहा है…',
    highRisk: 'उच्च रोग जोखिम', moderateRisk: 'मध्यम जोखिम', lowRisk: 'कम जोखिम',
    temperature: 'तापमान', humidity: 'नमी', windSpeed: 'हवा की गति', pressure: 'दबाव',
    visibility: 'दृश्यता', uvIndex: 'यूवी इंडेक्स', sunrise: 'सूर्योदय', sunset: 'सूर्यास्त',
    feelsLike: 'महसूस होता है', precipitation: 'वर्षा', windDirection: 'हवा की दिशा',
    forecast: '7-दिन का पूर्वानुमान', today: 'आज', tomorrow: 'कल', dayAfter: 'परसों',
    failedFetch: 'मौसम डेटा प्राप्त करने में विफल। अपना कनेक्शन जांचें।',
    locationPermission: 'स्थान पहुंच अस्वीकृत। कृपया मैन्युअल रूप से एक स्थान दर्ज करें।',
    enterLocation: 'मौसम डेटा प्राप्त करने के लिए कृपया एक स्थान दर्ज करें।',
    search: 'खोजें', yourLocation: 'आपका स्थान', useMyLocation: 'मेरा स्थान इस्तेमाल करें',
    locationNotFound: 'स्थान नहीं मिला। कोई दूसरा नाम आजमाएं।',
    geocodingFailed: 'जियोकोडिंग विफल हुई। फिर से प्रयास करें।'
  },
  mr: {
    title: 'हवामान बुद्धिमत्ता', subtitle: 'रिअल-टाइम हवामान डेटा आणि पीक रोग धोका मूल्यांकन ऑप्टिमल शेती निर्णयांसाठी.',
    searchLocation: 'स्थान शोधा…', currentLocation: 'सध्याचे स्थान वापरा', loading: 'हवामान डेटा लोड होत आहे…',
    highRisk: 'उच्च रोग धोका', moderateRisk: 'मध्यम धोका', lowRisk: 'कमी धोका',
    temperature: 'तापमान', humidity: 'आर्द्रता', windSpeed: 'वाऱ्याची गती', pressure: 'दाब',
    visibility: 'दृश्यमानता', uvIndex: 'यूव्ही इंडेक्स', sunrise: 'सूर्योदय', sunset: 'सूर्यास्त',
    feelsLike: 'वाटते', precipitation: 'पाऊस', windDirection: 'वाऱ्याची दिशा',
    forecast: '7-दिवसांचा अंदाज', today: 'आज', tomorrow: 'उद्या', dayAfter: 'परवा',
    failedFetch: 'हवामान डेटा आणण्यात अयशस्वी. आपले कनेक्शन तपासा.',
    locationPermission: 'स्थान प्रवेश नाकारला. कृपया मॅन्युअली एक स्थान प्रविष्ट करा.',
    enterLocation: 'हवामान डेटा मिळविण्यासाठी कृपया एक स्थान प्रविष्ट करा.',
    search: 'शोधा', yourLocation: 'तुमचे स्थान', useMyLocation: 'माझे स्थान वापरा',
    locationNotFound: 'स्थान सापडले नाही. दुसरे नाव वापरून पहा.',
    geocodingFailed: 'जिओकोडिंग अयशस्वी झाली. पुन्हा प्रयत्न करा.'
  },
  te: {
    title: 'వాతావరణ బుద్ధిమత్త', subtitle: 'రియల్-టైమ్ వాతావరణ డేటా మరియు పంట వ్యాధి రిస్క్ అంచనా ఆప్టిమల్ వ్యవసాయ నిర్ణయాల కోసం.',
    searchLocation: 'స్థానం వెతకండి…', currentLocation: 'ప్రస్తుత స్థానం ఉపయోగించండి', loading: 'వాతావరణ డేటా లోడ్ అవుతోంది…',
    highRisk: 'అధిక వ్యాధి రిస్క్', moderateRisk: 'మధ్యస్థ రిస్క్', lowRisk: 'తక్కువ రిస్క్',
    temperature: 'ఉష్ణోగ్రత', humidity: 'తేమ', windSpeed: 'గాలి వేగం', pressure: 'పీడనం',
    visibility: 'దృశ్యం', uvIndex: 'యూవీ ఇండెక్స్', sunrise: 'సూర్యోదయం', sunset: 'సూర్యాస్తమయం',
    feelsLike: 'అనిపిస్తుంది', precipitation: 'వర్షపాతం', windDirection: 'గాలి దిశ',
    forecast: '7-రోజుల అంచనా', today: 'నేటి', tomorrow: 'రేపు', dayAfter: 'మరుసటి రోజు',
    failedFetch: 'వాతావరణ డేటా పొందడంలో విఫలమైంది. మీ కనెక్షన్ తనిఖీ చేయండి.',
    locationPermission: 'స్థానం యాక్సెస్ నిరాకరించబడింది. దయచేసి మాన్యువల్‌గా ఒక స్థానం నమోదు చేయండి.',
    enterLocation: 'వాతావరణ డేటా పొందడానికి దయచేసి ఒక స్థానం నమోదు చేయండి.',
    search: 'వెతకండి', yourLocation: 'మీ స్థానం', useMyLocation: 'నా స్థానాన్ని ఉపయోగించు',
    locationNotFound: 'స్థానం కనుగొనబడలేదు. వేరే పేరును ప్రయత్నించండి.',
    geocodingFailed: 'జియోకోడింగ్ విఫలమైంది. మళ్లీ ప్రయత్నించండి.'
  }
}

const GEO_URL     = 'https://nominatim.openstreetmap.org/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

const WMO_CODES = {
  0: { label: 'Clear sky', icon: Sun },
  1: { label: 'Mainly clear', icon: Sun },
  2: { label: 'Partly cloudy', icon: CloudSun },
  3: { label: 'Overcast', icon: Cloud },
  45: { label: 'Foggy', icon: Cloud },
  48: { label: 'Icy fog', icon: Cloud },
  51: { label: 'Light drizzle', icon: CloudRain },
  53: { label: 'Drizzle', icon: CloudRain },
  55: { label: 'Heavy drizzle', icon: CloudRain },
  61: { label: 'Slight rain', icon: CloudRain },
  63: { label: 'Rain', icon: CloudRain },
  65: { label: 'Heavy rain', icon: CloudRain },
  71: { label: 'Slight snow', icon: CloudSnow },
  73: { label: 'Snow', icon: CloudSnow },
  75: { label: 'Heavy snow', icon: CloudSnow },
  80: { label: 'Rain showers', icon: CloudRain },
  95: { label: 'Thunderstorm', icon: Zap },
  99: { label: 'Thunderstorm + hail', icon: Zap },
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function riskBadge(rh, temp, lang) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  if (rh > 85 && temp > 20) return { label: t.highRisk,  color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  }
  if (rh > 70 && temp > 15) return { label: t.moderateRisk,      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' }
  return                           { label: t.lowRisk,            color: '#34d399', bg: 'rgba(52,211,153,0.12)' }
}

function MiniStat({ icon: Icon, label, value, color = '#34d399' }) {
  return (
    <div className="glass-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
          <Icon size={13} style={{ color }} />
        </div>
        <span className="text-xs uppercase tracking-wider font-mono" style={{ color: '#3d5a47' }}>{label}</span>
      </div>
      <span className="text-base font-700 font-mono" style={{ color, fontFamily: 'Outfit' }}>{value}</span>
    </div>
  )
}

function BigStat({ icon: Icon, label, value, unit, color = '#34d399', delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="glass-bright p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: '#3d5a47' }}>{label}</span>
      </div>
      <div className="font-display text-2xl" style={{ color, fontFamily: 'Outfit', fontWeight: 700 }}>
        {value}<span className="text-sm font-400 ml-1" style={{ color: '#5a7a68', fontFamily: 'Inter' }}>{unit}</span>
      </div>
    </motion.div>
  )
}

export default function WeatherPage({ lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const [query, setQuery]       = useState('')
  const [location, setLocation] = useState(null)
  const [weather, setWeather]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [geoLoading, setGeoLoading] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      setGeoLoading(true)
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, 'Your Location'),
        ()  => { setGeoLoading(false); fetchWeatherByCoords(18.5204, 73.8567, 'Pune, India') },
        { timeout: 6000 }
      )
    } else {
      fetchWeatherByCoords(18.5204, 73.8567, 'Pune, India')
    }
  }, [])

  const fetchWeatherByCoords = async (lat, lon, name) => {
    setLoading(true); setError(''); setGeoLoading(false)
    try {
      const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`
      const res  = await fetch(url)
      const data = await res.json()
      setWeather(data); setLocation({ name, lat, lon })
    } catch { setError(t.failedFetch) }
    finally   { setLoading(false) }
  }

  const searchLocation = async () => {
    if (!query.trim()) return
    setLoading(true); setError('')
    try {
      const res  = await fetch(`${GEO_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`)
      const data = await res.json()
      if (!data.length) { setError('Location not found. Try a different name.'); setLoading(false); return }
      const { lat, lon, display_name } = data[0]
      const shortName = display_name.split(',').slice(0, 2).join(', ')
      await fetchWeatherByCoords(parseFloat(lat), parseFloat(lon), shortName)
    } catch { setError('Geocoding failed. Try again.'); setLoading(false) }
  }

  const cur   = weather?.current
  const daily = weather?.daily
  const WIcon  = cur ? (WMO_CODES[cur.weather_code]?.icon || CloudSun) : CloudSun
  const wLabel = cur ? (WMO_CODES[cur.weather_code]?.label || 'Clear')  : ''
  const risk   = cur ? riskBadge(cur.relative_humidity_2m, cur.temperature_2m, lang) : null

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.06), transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-11">
          <div className="badge mb-6 mx-auto inline-flex" style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.22)' }}>
            <CloudSun size={11} color="#38bdf8" />
            Live Weather Intelligence
          </div>
          <h1 className="font-display mb-3" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#e8f5ee' }}>
            {t.title}
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#4d6e5c' }}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#3d5a47' }} />
            <input
              type="text" className="inp pl-10"
              placeholder={t.searchLocation}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchLocation()}
            />
          </div>
          <button onClick={searchLocation} className="btn-primary px-7" disabled={loading} style={{ minWidth: 110 }}>
            {loading ? <RefreshCw size={15} className="animate-spin" /> : 'Search'}
          </button>
          <button
            onClick={() => navigator.geolocation?.getCurrentPosition(p => fetchWeatherByCoords(p.coords.latitude, p.coords.longitude, 'Your Location'), () => {}, { timeout: 6000 })}
            className="btn-ghost px-4" title="Use my location"
          >
            <MapPin size={15} />
          </button>
        </motion.div>

        {error && (
          <div className="glass-sm p-4 flex items-center gap-3 mb-6" style={{ borderColor: 'rgba(244,63,94,0.25)' }}>
            <AlertTriangle size={14} color="#f43f5e" />
            <span className="text-sm" style={{ color: '#fda4af' }}>{error}</span>
          </div>
        )}

        {(loading || geoLoading) && !weather && (
          <div className="flex items-center justify-center py-24 gap-4" style={{ color: '#38bdf8' }}>
            <RefreshCw size={22} className="animate-spin" />
            <span className="text-sm" style={{ fontFamily: 'Outfit', fontWeight: 500 }}>{t.loading}</span>
          </div>
        )}

        {weather && cur && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-5">

            {/* Current hero */}
            <div className="glass-bright p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.10), transparent 70%)', filter: 'blur(50px)' }} />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={13} color="#38bdf8" />
                    <span className="text-sm font-500" style={{ color: '#7dd3fc', fontFamily: 'Inter' }}>{location?.name}</span>
                  </div>
                  <div className="flex items-end gap-5 mb-4">
                    <span className="font-display" style={{ fontSize: 80, color: '#e8f5ee', lineHeight: 1, fontFamily: 'Outfit' }}>
                      {Math.round(cur.temperature_2m)}°
                    </span>
                    <div className="pb-2">
                      <WIcon size={38} color="#38bdf8" style={{ marginBottom: 4 }} />
                      <p className="text-sm" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{wLabel}</p>
                      <p className="text-xs font-mono" style={{ color: '#3d5a47' }}>Feels like {Math.round(cur.apparent_temperature)}°C</p>
                    </div>
                  </div>
                  {risk && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-600"
                      style={{ color: risk.color, background: risk.bg, border: `1px solid ${risk.color}30`, fontFamily: 'Outfit' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-breathe" style={{ background: risk.color }} />
                      {risk.label} for Crop Disease
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 md:w-72">
                  <MiniStat icon={Droplets}   label={t.humidity}   value={`${cur.relative_humidity_2m}%`}              color="#38bdf8" />
                  <MiniStat icon={Wind}        label={t.windSpeed}       value={`${Math.round(cur.wind_speed_10m)} km/h`}     color="#a78bfa" />
                  <MiniStat icon={Gauge}       label={t.pressure}   value={`${Math.round(cur.surface_pressure)} hPa`}   color="#34d399" />
                  <MiniStat icon={Eye}         label={t.visibility} value={`${Math.round((cur.visibility||10000)/1000)} km`} color="#f59e0b" />
                </div>
              </div>
            </div>

            {/* UV / Sunrise / Sunset */}
            <div className="grid grid-cols-3 gap-4">
              <BigStat icon={Sun}     label={t.uvIndex} value={cur.uv_index ?? '—'} unit=""   color="#f59e0b" delay={0.05} />
              <BigStat icon={Sunrise} label={t.sunrise}  value={daily?.sunrise?.[0]?.slice(11,16) ?? '—'} unit="" color="#fcd34d" delay={0.10} />
              <BigStat icon={Sunset}  label={t.sunset}   value={daily?.sunset?.[0]?.slice(11,16) ?? '—'}  unit="" color="#fb923c" delay={0.15} />
            </div>

            {/* 7-day forecast */}
            {daily && (
              <div className="glass-bright p-6">
                <h3 className="text-sm font-600 mb-5 flex items-center gap-2" style={{ color: '#c0e0d0', fontFamily: 'Outfit' }}>
                  <CloudSun size={14} color="#38bdf8" />
                  7-Day Forecast
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {daily.time.map((date, i) => {
                    const DIcon   = WMO_CODES[daily.weather_code[i]]?.icon || CloudSun
                    const precip  = daily.precipitation_sum[i]
                    const isToday = i === 0
                    return (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="glass-sm p-3 flex flex-col items-center gap-2 text-center transition-all duration-200 hover:border-sky-400/20"
                        style={{ borderRadius: 14, border: isToday ? '1px solid rgba(56,189,248,0.25)' : undefined }}
                      >
                        <span className="text-[10px] font-mono" style={{ color: isToday ? '#38bdf8' : '#3d5a47' }}>
                          {isToday ? 'Today' : DAYS[new Date(date).getDay()]}
                        </span>
                        <DIcon size={18} color="#38bdf8" />
                        <div>
                          <div className="text-xs font-700" style={{ color: '#e8f5ee', fontFamily: 'Outfit' }}>{Math.round(daily.temperature_2m_max[i])}°</div>
                          <div className="text-[10px]" style={{ color: '#3d5a47' }}>{Math.round(daily.temperature_2m_min[i])}°</div>
                        </div>
                        {precip > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Droplets size={8} color="#38bdf8" />
                            <span className="text-[9px] font-mono" style={{ color: '#38bdf8' }}>{precip.toFixed(1)}</span>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Crop advisory */}
            <div className="glass-bright p-6">
              <h3 className="text-sm font-600 mb-5 flex items-center gap-2" style={{ color: '#c0e0d0', fontFamily: 'Outfit' }}>
                <AlertTriangle size={14} color="#f59e0b" />
                Crop Health Advisory
              </h3>
              <div className="space-y-3">
                {[
                  cur.relative_humidity_2m > 80 && { icon: Droplets, color: '#f43f5e', msg: `High humidity (${cur.relative_humidity_2m}%) — fungal diseases like blight and mildew are likely. Avoid irrigation and apply preventive fungicide.` },
                  cur.temperature_2m > 35       && { icon: Thermometer, color: '#f43f5e', msg: `Extreme heat (${Math.round(cur.temperature_2m)}°C) — risk of heat stress and wilting. Mulch soil and water early morning.` },
                  cur.wind_speed_10m > 25       && { icon: Wind, color: '#f59e0b', msg: `High winds (${Math.round(cur.wind_speed_10m)} km/h) — avoid spraying pesticides/fungicides today.` },
                  (cur.uv_index ?? 0) > 8       && { icon: Sun, color: '#f59e0b', msg: `Very high UV index (${cur.uv_index}) — shade sensitive seedlings and avoid field work 11 AM–3 PM.` },
                  { icon: CloudSun, color: '#34d399', msg: 'Current conditions allow AI crop diagnosis. Upload images from your field for precise disease detection.' },
                ].filter(Boolean).map(({ icon: I, color, msg }, i) => (
                  <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                    <I size={14} style={{ color, flexShrink: 0, marginTop: 1 }} />
                    <p className="text-sm leading-relaxed" style={{ color: '#7a9d88', fontFamily: 'Inter' }}>{msg}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
