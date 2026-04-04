import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CloudSun, Wind, Droplets, Thermometer, Eye, Sun,
  MapPin, RefreshCw, AlertTriangle, CloudRain, Cloud,
  CloudSnow, Zap, Gauge, Sunrise, Sunset
} from 'lucide-react'

const UI_TEXT = {
  en: {
    badge: 'Live Weather Intelligence',
    title: 'Weather Intelligence',
    subtitle: 'Real-time weather data and crop disease risk assessment for better farming decisions.',
    searchLocation: 'Search location...', currentLocation: 'Use my location', loading: 'Loading weather data...',
    highRisk: 'High Disease Risk', moderateRisk: 'Moderate Risk', lowRisk: 'Low Risk',
    temperature: 'Temperature', humidity: 'Humidity', windSpeed: 'Wind Speed', pressure: 'Pressure', visibility: 'Visibility',
    uvIndex: 'UV Index', sunrise: 'Sunrise', sunset: 'Sunset', feelsLike: 'Feels like', forecast: '7-Day Forecast',
    today: 'Today', failedFetch: 'Failed to fetch weather data. Check your connection.', search: 'Search',
    locationNotFound: 'Location not found. Try a different name.', geocodingFailed: 'Geocoding failed. Try again.',
    diseaseSuffix: 'for Crop Disease', advisoryTitle: 'Crop Health Advisory',
    advisoryHumidity: (value) => `High humidity (${value}%) means fungal disease risk is elevated. Avoid overhead irrigation and consider a preventive fungicide.`,
    advisoryHeat: (value) => `Extreme heat (${value}°C) may stress plants. Mulch the soil and water early in the morning.`,
    advisoryWind: (value) => `High winds (${value} km/h) make spraying less effective today.`,
    advisoryUv: (value) => `Very high UV index (${value}) can stress tender plants. Protect seedlings during peak afternoon sun.`,
    advisorySafe: 'Current conditions are suitable for diagnosis. Upload crop images for a precise health check.',
    clearSky: 'Clear sky', mainlyClear: 'Mainly clear', partlyCloudy: 'Partly cloudy', overcast: 'Overcast', foggy: 'Foggy', icyFog: 'Icy fog',
    lightDrizzle: 'Light drizzle', drizzle: 'Drizzle', heavyDrizzle: 'Heavy drizzle', slightRain: 'Slight rain', rain: 'Rain', heavyRain: 'Heavy rain',
    slightSnow: 'Slight snow', snow: 'Snow', heavySnow: 'Heavy snow', rainShowers: 'Rain showers', thunderstorm: 'Thunderstorm', thunderstormHail: 'Thunderstorm with hail'
  },
  hi: {
    badge: 'लाइव मौसम इंटेलिजेंस', title: 'मौसम जानकारी', subtitle: 'बेहतर कृषि निर्णयों के लिए रियल-टाइम मौसम डेटा और फसल रोग जोखिम आकलन।',
    searchLocation: 'स्थान खोजें...', currentLocation: 'मेरा स्थान उपयोग करें', loading: 'मौसम डेटा लोड हो रहा है...',
    highRisk: 'उच्च रोग जोखिम', moderateRisk: 'मध्यम जोखिम', lowRisk: 'कम जोखिम',
    temperature: 'तापमान', humidity: 'नमी', windSpeed: 'हवा की गति', pressure: 'दबाव', visibility: 'दृश्यता',
    uvIndex: 'यूवी सूचकांक', sunrise: 'सूर्योदय', sunset: 'सूर्यास्त', feelsLike: 'अनुभव तापमान', forecast: '7-दिन का पूर्वानुमान',
    today: 'आज', failedFetch: 'मौसम डेटा प्राप्त नहीं हो सका।', search: 'खोजें',
    locationNotFound: 'स्थान नहीं मिला। कोई दूसरा नाम आज़माएँ।', geocodingFailed: 'जियोकोडिंग विफल हुई। फिर प्रयास करें।',
    diseaseSuffix: 'फसल रोग के लिए', advisoryTitle: 'फसल स्वास्थ्य सलाह',
    advisoryHumidity: (value) => `अधिक नमी (${value}%) से फफूंद रोग का खतरा बढ़ता है। ऊपर से सिंचाई से बचें और निवारक फफूंदनाशक पर विचार करें।`,
    advisoryHeat: (value) => `अत्यधिक तापमान (${value}°C) पौधों पर तनाव डाल सकता है। मिट्टी को मल्च करें और सुबह जल्दी सिंचाई करें।`,
    advisoryWind: (value) => `तेज हवा (${value} km/h) के कारण आज छिड़काव कम प्रभावी रहेगा।`,
    advisoryUv: (value) => `बहुत उच्च यूवी सूचकांक (${value}) कोमल पौधों पर असर डाल सकता है। दोपहर में पौधों की रक्षा करें।`,
    advisorySafe: 'वर्तमान मौसम निदान के लिए उपयुक्त है। सटीक स्वास्थ्य जांच के लिए फसल छवियां अपलोड करें।',
    clearSky: 'साफ आसमान', mainlyClear: 'मुख्यतः साफ', partlyCloudy: 'आंशिक बादल', overcast: 'घना बादल', foggy: 'कोहरा', icyFog: 'बर्फीला कोहरा',
    lightDrizzle: 'हल्की फुहार', drizzle: 'फुहार', heavyDrizzle: 'तेज फुहार', slightRain: 'हल्की बारिश', rain: 'बारिश', heavyRain: 'भारी बारिश',
    slightSnow: 'हल्की बर्फ', snow: 'बर्फबारी', heavySnow: 'भारी बर्फबारी', rainShowers: 'बारिश की बौछारें', thunderstorm: 'आंधी-तूफान', thunderstormHail: 'ओलों के साथ तूफान'
  },
  mr: {
    badge: 'लाइव्ह हवामान इंटेलिजन्स', title: 'हवामान माहिती', subtitle: 'चांगल्या शेती निर्णयांसाठी रिअल-टाइम हवामान डेटा आणि पीक रोग जोखीम विश्लेषण.',
    searchLocation: 'स्थान शोधा...', currentLocation: 'माझे स्थान वापरा', loading: 'हवामान डेटा लोड होत आहे...',
    highRisk: 'उच्च रोग धोका', moderateRisk: 'मध्यम धोका', lowRisk: 'कमी धोका',
    temperature: 'तापमान', humidity: 'आर्द्रता', windSpeed: 'वाऱ्याचा वेग', pressure: 'दाब', visibility: 'दृश्यमानता',
    uvIndex: 'यूव्ही निर्देशांक', sunrise: 'सूर्योदय', sunset: 'सूर्यास्त', feelsLike: 'जाणवणारे तापमान', forecast: '7 दिवसांचा अंदाज',
    today: 'आज', failedFetch: 'हवामान डेटा मिळाला नाही.', search: 'शोधा',
    locationNotFound: 'स्थान सापडले नाही. दुसरे नाव वापरून पहा.', geocodingFailed: 'जिओकोडिंग अयशस्वी झाले. पुन्हा प्रयत्न करा.',
    diseaseSuffix: 'पीक रोगासाठी', advisoryTitle: 'पीक आरोग्य सल्ला',
    advisoryHumidity: (value) => `जास्त आर्द्रता (${value}%) मुळे बुरशीजन्य रोगाचा धोका वाढतो. वरून पाणी देणे टाळा आणि प्रतिबंधक बुरशीनाशकाचा विचार करा.`,
    advisoryHeat: (value) => `अत्यंत उष्णता (${value}°C) झाडांवर ताण आणू शकते. मातीवर मल्च करा आणि सकाळी लवकर पाणी द्या.`,
    advisoryWind: (value) => `जोरदार वारा (${value} km/h) असल्यामुळे आज फवारणी कमी परिणामकारक राहू शकते.`,
    advisoryUv: (value) => `उच्च यूव्ही निर्देशांक (${value}) कोवळ्या रोपांवर परिणाम करू शकतो. दुपारी संरक्षण द्या.`,
    advisorySafe: 'सध्याच्या परिस्थितीत निदान करणे योग्य आहे. अचूक आरोग्य तपासणीसाठी पिकांची छायाचित्रे अपलोड करा.',
    clearSky: 'स्वच्छ आकाश', mainlyClear: 'बहुतेक स्वच्छ', partlyCloudy: 'अंशतः ढगाळ', overcast: 'पूर्ण ढगाळ', foggy: 'धुके', icyFog: 'गार धुके',
    lightDrizzle: 'हलकी रिमझिम', drizzle: 'रिमझिम', heavyDrizzle: 'जोरदार रिमझिम', slightRain: 'हलका पाऊस', rain: 'पाऊस', heavyRain: 'मुसळधार पाऊस',
    slightSnow: 'हलका हिमवर्षाव', snow: 'हिमवर्षाव', heavySnow: 'जोरदार हिमवर्षाव', rainShowers: 'पावसाच्या सरी', thunderstorm: 'मेघगर्जना', thunderstormHail: 'गारा पडणारे वादळ'
  },
  te: {
    badge: 'లైవ్ వాతావరణ ఇంటెలిజెన్స్', title: 'వాతావరణ సమాచారం', subtitle: 'మెరుగైన వ్యవసాయ నిర్ణయాల కోసం రియల్-టైమ్ వాతావరణ డేటా మరియు పంట వ్యాధి ప్రమాద అంచనా.',
    searchLocation: 'స్థానం వెతకండి...', currentLocation: 'నా స్థానం ఉపయోగించండి', loading: 'వాతావరణ డేటా లోడ్ అవుతోంది...',
    highRisk: 'అధిక వ్యాధి ప్రమాదం', moderateRisk: 'మధ్యస్థ ప్రమాదం', lowRisk: 'తక్కువ ప్రమాదం',
    temperature: 'ఉష్ణోగ్రత', humidity: 'తేమ', windSpeed: 'గాలి వేగం', pressure: 'పీడనం', visibility: 'దృశ్యమానం',
    uvIndex: 'యూవీ సూచిక', sunrise: 'సూర్యోదయం', sunset: 'సూర్యాస్తమయం', feelsLike: 'అనిపించే ఉష్ణోగ్రత', forecast: '7 రోజుల అంచనా',
    today: 'ఈ రోజు', failedFetch: 'వాతావరణ డేటా తీసుకురాలేకపోయాం.', search: 'వెతకండి',
    locationNotFound: 'స్థానం దొరకలేదు. మరో పేరు ప్రయత్నించండి.', geocodingFailed: 'జియోకోడింగ్ విఫలమైంది. మళ్లీ ప్రయత్నించండి.',
    diseaseSuffix: 'పంట వ్యాధి కోసం', advisoryTitle: 'పంట ఆరోగ్య సలహా',
    advisoryHumidity: (value) => `ఎక్కువ తేమ (${value}%) వల్ల ఫంగల్ వ్యాధి ప్రమాదం పెరుగుతుంది. పై నుంచి నీరు పోయడం నివారించి నివారణ ఫంగిసైడ్‌పై ఆలోచించండి.`,
    advisoryHeat: (value) => `అధిక ఉష్ణోగ్రత (${value}°C) మొక్కలకు ఒత్తిడి కలిగించవచ్చు. మల్చింగ్ చేసి ఉదయం వేళలో నీరు పోయండి.`,
    advisoryWind: (value) => `బలమైన గాలి (${value} km/h) కారణంగా ఈ రోజు స్ప్రే ప్రభావం తగ్గవచ్చు.`,
    advisoryUv: (value) => `చాలా ఎక్కువ యూవీ సూచిక (${value}) కోమల మొక్కలపై ప్రభావం చూపవచ్చు. మధ్యాహ్నం రక్షణ ఇవ్వండి.`,
    advisorySafe: 'ప్రస్తుత పరిస్థితులు నిర్ధారణకు అనుకూలంగా ఉన్నాయి. ఖచ్చితమైన ఆరోగ్య తనిఖీ కోసం పంట చిత్రాలు అప్‌లోడ్ చేయండి.',
    clearSky: 'స్పష్టమైన ఆకాశం', mainlyClear: 'ముఖ్యంగా స్పష్టం', partlyCloudy: 'భాగంగా మేఘావృతం', overcast: 'మేఘావృతం', foggy: 'మంచు', icyFog: 'చల్లని మంచు',
    lightDrizzle: 'స్వల్ప జల్లులు', drizzle: 'జల్లులు', heavyDrizzle: 'భారీ జల్లులు', slightRain: 'స్వల్ప వర్షం', rain: 'వర్షం', heavyRain: 'భారీ వర్షం',
    slightSnow: 'స్వల్ప హిమపాతం', snow: 'హిమపాతం', heavySnow: 'భారీ హిమపాతం', rainShowers: 'వర్షపు జల్లులు', thunderstorm: 'మెరుపు వాన', thunderstormHail: 'ఒలులతో తుఫాను'
  },
}

const GEO_URL = 'https://nominatim.openstreetmap.org/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

const codeKeyMap = {
  0: 'clearSky', 1: 'mainlyClear', 2: 'partlyCloudy', 3: 'overcast', 45: 'foggy', 48: 'icyFog',
  51: 'lightDrizzle', 53: 'drizzle', 55: 'heavyDrizzle', 61: 'slightRain', 63: 'rain', 65: 'heavyRain',
  71: 'slightSnow', 73: 'snow', 75: 'heavySnow', 80: 'rainShowers', 95: 'thunderstorm', 99: 'thunderstormHail',
}

const WMO_CODES = {
  0: Sun, 1: Sun, 2: CloudSun, 3: Cloud, 45: Cloud, 48: Cloud, 51: CloudRain, 53: CloudRain, 55: CloudRain,
  61: CloudRain, 63: CloudRain, 65: CloudRain, 71: CloudSnow, 73: CloudSnow, 75: CloudSnow, 80: CloudRain, 95: Zap, 99: Zap,
}

function riskBadge(rh, temp, lang) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  if (rh > 85 && temp > 20) return { label: t.highRisk, color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' }
  if (rh > 70 && temp > 15) return { label: t.moderateRisk, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' }
  return { label: t.lowRisk, color: '#34d399', bg: 'rgba(52,211,153,0.12)' }
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

function getDayLabel(date, lang, isToday, todayLabel) {
  if (isToday) return todayLabel
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'te-IN', { weekday: 'short' }).format(new Date(date))
}

export default function WeatherPage({ lang = 'en' }) {
  const t = UI_TEXT[lang] || UI_TEXT.en
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      setGeoLoading(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, t.currentLocation),
        () => { setGeoLoading(false); fetchWeatherByCoords(18.5204, 73.8567, 'Pune, India') },
        { timeout: 6000 }
      )
    } else {
      fetchWeatherByCoords(18.5204, 73.8567, 'Pune, India')
    }
  }, [lang])

  const fetchWeatherByCoords = async (lat, lon, name) => {
    setLoading(true)
    setError('')
    setGeoLoading(false)
    try {
      const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`
      const res = await fetch(url)
      const data = await res.json()
      setWeather(data)
      setLocation({ name, lat, lon })
    } catch {
      setError(t.failedFetch)
    } finally {
      setLoading(false)
    }
  }

  const searchLocation = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${GEO_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`)
      const data = await res.json()
      if (!data.length) {
        setError(t.locationNotFound)
        setLoading(false)
        return
      }
      const { lat, lon, display_name } = data[0]
      const shortName = display_name.split(',').slice(0, 2).join(', ')
      await fetchWeatherByCoords(parseFloat(lat), parseFloat(lon), shortName)
    } catch {
      setError(t.geocodingFailed)
      setLoading(false)
    }
  }

  const cur = weather?.current
  const daily = weather?.daily
  const WIcon = cur ? (WMO_CODES[cur.weather_code] || CloudSun) : CloudSun
  const wLabel = cur ? (t[codeKeyMap[cur.weather_code]] || t.clearSky) : ''
  const risk = cur ? riskBadge(cur.relative_humidity_2m, cur.temperature_2m, lang) : null
  const advisories = cur ? [
    cur.relative_humidity_2m > 80 && { icon: Droplets, color: '#f43f5e', msg: t.advisoryHumidity(cur.relative_humidity_2m) },
    cur.temperature_2m > 35 && { icon: Thermometer, color: '#f43f5e', msg: t.advisoryHeat(Math.round(cur.temperature_2m)) },
    cur.wind_speed_10m > 25 && { icon: Wind, color: '#f59e0b', msg: t.advisoryWind(Math.round(cur.wind_speed_10m)) },
    (cur.uv_index ?? 0) > 8 && { icon: Sun, color: '#f59e0b', msg: t.advisoryUv(cur.uv_index) },
    { icon: CloudSun, color: '#34d399', msg: t.advisorySafe },
  ].filter(Boolean) : []

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.06), transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-11">
          <div className="badge mb-6 mx-auto inline-flex" style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.22)' }}>
            <CloudSun size={11} color="#38bdf8" />
            {t.badge}
          </div>
          <h1 className="font-display mb-3" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#e8f5ee' }}>{t.title}</h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#4d6e5c' }}>{t.subtitle}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#3d5a47' }} />
            <input type="text" className="inp pl-10" placeholder={t.searchLocation} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchLocation()} />
          </div>
          <button onClick={searchLocation} className="btn-primary px-7" disabled={loading} style={{ minWidth: 110 }}>
            {loading ? <RefreshCw size={15} className="animate-spin" /> : t.search}
          </button>
          <button onClick={() => navigator.geolocation?.getCurrentPosition((p) => fetchWeatherByCoords(p.coords.latitude, p.coords.longitude, t.currentLocation), () => {}, { timeout: 6000 })} className="btn-ghost px-4" title={t.currentLocation}>
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
            <div className="glass-bright p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.10), transparent 70%)', filter: 'blur(50px)' }} />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={13} color="#38bdf8" />
                    <span className="text-sm font-500" style={{ color: '#7dd3fc', fontFamily: 'Inter' }}>{location?.name}</span>
                  </div>
                  <div className="flex items-end gap-5 mb-4">
                    <span className="font-display" style={{ fontSize: 80, color: '#e8f5ee', lineHeight: 1, fontFamily: 'Outfit' }}>{Math.round(cur.temperature_2m)}°</span>
                    <div className="pb-2">
                      <WIcon size={38} color="#38bdf8" style={{ marginBottom: 4 }} />
                      <p className="text-sm" style={{ color: '#4d6e5c', fontFamily: 'Inter' }}>{wLabel}</p>
                      <p className="text-xs font-mono" style={{ color: '#3d5a47' }}>{t.feelsLike} {Math.round(cur.apparent_temperature)}°C</p>
                    </div>
                  </div>
                  {risk && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-600" style={{ color: risk.color, background: risk.bg, border: `1px solid ${risk.color}30`, fontFamily: 'Outfit' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-breathe" style={{ background: risk.color }} />
                      {risk.label} {t.diseaseSuffix}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 md:w-72">
                  <MiniStat icon={Droplets} label={t.humidity} value={`${cur.relative_humidity_2m}%`} color="#38bdf8" />
                  <MiniStat icon={Wind} label={t.windSpeed} value={`${Math.round(cur.wind_speed_10m)} km/h`} color="#a78bfa" />
                  <MiniStat icon={Gauge} label={t.pressure} value={`${Math.round(cur.surface_pressure)} hPa`} color="#34d399" />
                  <MiniStat icon={Eye} label={t.visibility} value={`${Math.round((cur.visibility || 10000) / 1000)} km`} color="#f59e0b" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <BigStat icon={Sun} label={t.uvIndex} value={cur.uv_index ?? '—'} unit="" color="#f59e0b" delay={0.05} />
              <BigStat icon={Sunrise} label={t.sunrise} value={daily?.sunrise?.[0]?.slice(11, 16) ?? '—'} unit="" color="#fcd34d" delay={0.10} />
              <BigStat icon={Sunset} label={t.sunset} value={daily?.sunset?.[0]?.slice(11, 16) ?? '—'} unit="" color="#fb923c" delay={0.15} />
            </div>

            {daily && (
              <div className="glass-bright p-6">
                <h3 className="text-sm font-600 mb-5 flex items-center gap-2" style={{ color: '#c0e0d0', fontFamily: 'Outfit' }}>
                  <CloudSun size={14} color="#38bdf8" />
                  {t.forecast}
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {daily.time.map((date, i) => {
                    const DIcon = WMO_CODES[daily.weather_code[i]] || CloudSun
                    const precip = daily.precipitation_sum[i]
                    const isToday = i === 0
                    return (
                      <motion.div key={date} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-sm p-3 flex flex-col items-center gap-2 text-center transition-all duration-200 hover:border-sky-400/20" style={{ borderRadius: 14, border: isToday ? '1px solid rgba(56,189,248,0.25)' : undefined }}>
                        <span className="text-[10px] font-mono" style={{ color: isToday ? '#38bdf8' : '#3d5a47' }}>{getDayLabel(date, lang, isToday, t.today)}</span>
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

            <div className="glass-bright p-6">
              <h3 className="text-sm font-600 mb-5 flex items-center gap-2" style={{ color: '#c0e0d0', fontFamily: 'Outfit' }}>
                <AlertTriangle size={14} color="#f59e0b" />
                {t.advisoryTitle}
              </h3>
              <div className="space-y-3">
                {advisories.map(({ icon: I, color, msg }, i) => (
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
