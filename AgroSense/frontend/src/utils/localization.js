export const LANGUAGE_LOCALES = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  te: 'te-IN',
}

const CLASSIFICATION_LABELS = {
  en: { Healthy: 'Healthy', Preventive: 'Preventive', Treatable: 'Treatable', Critical: 'Critical', Remove: 'Remove Plant' },
  hi: { Healthy: 'स्वस्थ', Preventive: 'निवारक', Treatable: 'उपचार योग्य', Critical: 'गंभीर', Remove: 'पौधा हटाएँ' },
  mr: { Healthy: 'निरोगी', Preventive: 'निवारक', Treatable: 'उपचारयोग्य', Critical: 'गंभीर', Remove: 'झाड काढा' },
  te: { Healthy: 'ఆరోగ్యకరం', Preventive: 'నివారణ', Treatable: 'చికిత్సాయోగ్యం', Critical: 'తీవ్రం', Remove: 'మొక్క తొలగించండి' },
}

const TRANSLATIONS = {
  hi: {
    'Demo Analysis Result': 'डेमो विश्लेषण परिणाम',
    'Leaf stress detected': 'पत्ती में तनाव पाया गया',
    'Unknown': 'अज्ञात',
    'No disease': 'कोई रोग नहीं',
    'Stem': 'तना',
    'Insufficient data': 'पर्याप्त डेटा नहीं',
    'Normal': 'सामान्य',
    'Mild browning': 'हल्का भूरापन',
    'Moderate browning': 'मध्यम भूरापन',
    'Severe browning': 'गंभीर भूरापन',
    'Critical deterioration': 'गंभीर क्षति',
    'Healthy Plant': 'स्वस्थ पौधा',
    'Early Blight (Alternaria solani)': 'अर्ली ब्लाइट (अल्टरनेरिया सोलानी)',
    'Late Blight (Phytophthora infestans)': 'लेट ब्लाइट (फाइटोफ्थोरा इंफेस्टन्स)',
    'Powdery Mildew': 'पाउडरी मिल्ड्यू',
    'Leaf Rust': 'लीफ रस्ट',
    'Tomato – healthy': 'टमाटर – स्वस्थ',
    'Tomato – Early blight': 'टमाटर – अर्ली ब्लाइट',
    'Tomato – Late blight': 'टमाटर – लेट ब्लाइट',
    'Inspect the crop closely for early stress symptoms.': 'तनाव के शुरुआती लक्षणों के लिए फसल को ध्यान से देखें।',
    'Avoid overwatering and improve field drainage if needed.': 'अत्यधिक सिंचाई से बचें और जरूरत हो तो खेत की जलनिकासी सुधारें।',
    'Monitor the next few days and re-run analysis when backend is available.': 'अगले कुछ दिनों तक निगरानी रखें और बैकएंड उपलब्ध होने पर फिर से विश्लेषण चलाएँ।',
    'This is a temporary demo fallback while the live backend is unavailable.': 'लाइव बैकएंड उपलब्ध न होने पर यह एक अस्थायी डेमो परिणाम है।',
    'Apply a balanced nutrient plan based on your field condition.': 'अपने खेत की स्थिति के अनुसार संतुलित पोषण योजना अपनाएँ।',
    'This is a demo fallback result. Re-run the scan after the backend issue is fixed.': 'यह डेमो फॉलबैक परिणाम है। बैकएंड समस्या ठीक होने के बाद स्कैन फिर से चलाएँ।',
    'Maintain regular watering schedule (avoid overhead irrigation)': 'नियमित सिंचाई बनाए रखें (ऊपर से सिंचाई से बचें)।',
    'Apply balanced NPK fertilizer monthly during growing season': 'विकास अवधि में हर महीने संतुलित NPK उर्वरक दें।',
    'Inspect plants weekly for early signs of pest or disease activity': 'कीट या रोग के शुरुआती संकेतों के लिए पौधों की साप्ताहिक जाँच करें।',
    'Ensure adequate sunlight exposure and proper plant spacing': 'पर्याप्त धूप और पौधों के बीच सही दूरी सुनिश्चित करें।',
    'Apply 10-10-10 NPK fertilizer every 4-6 weeks': 'हर 4-6 सप्ताह में 10-10-10 NPK उर्वरक दें।',
    'Add compost or organic matter to improve soil structure': 'मिट्टी की संरचना सुधारने के लिए कम्पोस्ट या जैविक पदार्थ मिलाएँ।',
    'Use micronutrient foliar spray (Zn, Mn, Fe) once a month': 'महीने में एक बार सूक्ष्म पोषक तत्वों का फोलियर स्प्रे (Zn, Mn, Fe) करें।',
    'Plant is in excellent health. Continue current care practices.': 'पौधा बहुत अच्छी अवस्था में है। वर्तमान देखभाल जारी रखें।',
    'Apply preventive copper-based fungicide spray every 7-10 days': 'हर 7-10 दिन में तांबा-आधारित निवारक फफूंदनाशक का छिड़काव करें।',
    'Avoid overhead irrigation; use drip irrigation instead': 'ऊपर से सिंचाई न करें; ड्रिप सिंचाई का उपयोग करें।',
    'Remove and destroy infected leaves immediately': 'संक्रमित पत्तियों को तुरंत हटाकर नष्ट करें।',
    'Ensure proper plant spacing for air circulation': 'हवा के प्रवाह के लिए पौधों के बीच उचित दूरी रखें।',
    'Rotate crops — do not plant same family in same soil for 2 years': 'फसल चक्र अपनाएँ — एक ही परिवार की फसल को 2 साल तक उसी मिट्टी में न लगाएँ।',
    'Apply Mancozeb (2.5 g/L) or Chlorothalonil fungicide every 7 days': 'हर 7 दिन में Mancozeb (2.5 g/L) या Chlorothalonil फफूंदनाशक का छिड़काव करें।',
    'Use systemic fungicide: Azoxystrobin (1 mL/L) for severe infections': 'गंभीर संक्रमण में Azoxystrobin (1 mL/L) जैसे systemic fungicide का उपयोग करें।',
    'Remove infected foliage and dispose away from field': 'संक्रमित पत्तियों को हटाकर खेत से दूर नष्ट करें।',
    'Spray during cool morning or evening for best absorption': 'बेहतर अवशोषण के लिए सुबह या शाम के ठंडे समय में छिड़काव करें।',
    'Repeat treatment for 3-4 weeks, monitoring disease progression': 'रोग की प्रगति देखते हुए 3-4 सप्ताह तक उपचार दोहराएँ।',
    'Reduce nitrogen; apply potassium-rich fertilizer (0-0-60) to strengthen cell walls': 'नाइट्रोजन कम करें; कोशिका दीवारें मजबूत करने के लिए पोटाश-समृद्ध उर्वरक (0-0-60) दें।',
    'Apply calcium nitrate to improve plant immunity': 'पौधे की प्रतिरोधक क्षमता बढ़ाने के लिए कैल्शियम नाइट्रेट दें।',
    'Use foliar spray with micronutrients (Zinc 0.5%, Boron 0.1%)': 'सूक्ष्म पोषक तत्वों वाला फोलियर स्प्रे (जिंक 0.5%, बोरॉन 0.1%) करें।',
    'Maintain soil pH between 6.0-6.5 for optimal nutrient uptake': 'सर्वोत्तम पोषण अवशोषण के लिए मिट्टी का pH 6.0-6.5 रखें।',
    'Moderate recovery potential. With prompt fungicide treatment, 70-80% recovery expected within 3-4 weeks.': 'ठीक होने की संभावना मध्यम है। समय पर फफूंदनाशक उपचार से 3-4 सप्ताह में 70-80% सुधार संभव है।',
    'Apply preventive Mancozeb or Cymoxanil-Mancozeb every 5-7 days': 'हर 5-7 दिन में Mancozeb या Cymoxanil-Mancozeb का निवारक छिड़काव करें।',
    'Avoid working in field when plants are wet': 'जब पौधे गीले हों तब खेत में काम न करें।',
    'Plant disease-resistant varieties in future seasons': 'आने वाले मौसमों में रोग-प्रतिरोधी किस्में लगाएँ।',
    'Destroy all infected plant material; do not compost': 'सभी संक्रमित पौध सामग्री नष्ट करें; कम्पोस्ट न बनाएं।',
    'Apply Metalaxyl-M + Mancozeb (Ridomil Gold) immediately': 'Metalaxyl-M + Mancozeb (Ridomil Gold) तुरंत लागू करें।',
    'Use Dimethomorph + Mancozeb for advanced infections': 'उन्नत संक्रमण के लिए Dimethomorph + Mancozeb का उपयोग करें।',
    'Apply systemic fungicide every 5 days during active infection': 'सक्रिय संक्रमण के दौरान हर 5 दिन में systemic fungicide दें।',
    'Remove all infected plant parts and nearby plant debris': 'सभी संक्रमित भागों और आसपास के अवशेषों को हटाएँ।',
    'Reduce irrigation significantly to minimize humidity': 'नमी कम करने के लिए सिंचाई काफी घटाएँ।',
    'Apply potassium sulfate to improve disease resistance': 'रोग प्रतिरोध बढ़ाने के लिए पोटैशियम सल्फेट दें।',
    'Avoid high nitrogen fertilizers which encourage soft growth': 'अधिक नाइट्रोजन वाले उर्वरकों से बचें, ये नरम वृद्धि बढ़ाते हैं।',
    'Severe disease. Act immediately — untreated late blight can destroy entire crop within 1-2 weeks under favorable conditions.': 'रोग गंभीर है। तुरंत कार्रवाई करें — अनियंत्रित लेट ब्लाइट अनुकूल परिस्थितियों में 1-2 सप्ताह में पूरी फसल नष्ट कर सकता है।',
    'Inspect plants regularly and remove infected material promptly': 'पौधों की नियमित जाँच करें और संक्रमित भाग तुरंत हटाएँ।',
    'Avoid wetting foliage during irrigation': 'सिंचाई के दौरान पत्तियों को गीला होने से बचाएँ।',
    'Improve air circulation by proper pruning and spacing': 'उचित छंटाई और दूरी से हवा का प्रवाह सुधारें।',
    'Apply preventive broad-spectrum fungicide/bactericide': 'निवारक broad-spectrum fungicide/bactericide का उपयोग करें।',
    'Identify specific pathogen and apply targeted fungicide or bactericide': 'विशिष्ट रोगकारक पहचानें और लक्षित fungicide या bactericide लगाएँ।',
    'Apply broad-spectrum copper-based spray as first response': 'पहले कदम के रूप में broad-spectrum copper-based spray करें।',
    'Remove all visibly infected plant material': 'सभी स्पष्ट रूप से संक्रमित पौध सामग्री हटाएँ।',
    'Repeat treatment every 7-10 days until symptoms subside': 'लक्षण कम होने तक हर 7-10 दिन में उपचार दोहराएँ।',
    'Apply balanced NPK fertilizer to support plant recovery': 'पौधे की रिकवरी के लिए संतुलित NPK उर्वरक दें।',
    'Use potassium-rich fertilizer to strengthen plant immunity': 'पौधे की प्रतिरक्षा मजबूत करने के लिए पोटाश-समृद्ध उर्वरक दें।',
    'Add micronutrients via foliar spray to boost recovery': 'रिकवरी बढ़ाने के लिए फोलियर स्प्रे से सूक्ष्म पोषक तत्व दें।',
    'Recovery depends on disease severity and promptness of treatment. Consult a local agronomist for precise guidance.': 'रिकवरी रोग की गंभीरता और समय पर उपचार पर निर्भर करती है। सटीक मार्गदर्शन के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें।',
  },
  mr: {
    'Demo Analysis Result': 'डेमो विश्लेषण निकाल',
    'Leaf stress detected': 'पानात ताण आढळला',
    'Unknown': 'अज्ञात',
    'No disease': 'रोग नाही',
    'Stem': 'खोड',
    'Insufficient data': 'पुरेसा डेटा नाही',
    'Normal': 'सामान्य',
    'Mild browning': 'हलका तपकिरीपणा',
    'Moderate browning': 'मध्यम तपकिरीपणा',
    'Severe browning': 'तीव्र तपकिरीपणा',
    'Critical deterioration': 'गंभीर हानी',
    'Healthy Plant': 'निरोगी झाड',
    'Early Blight (Alternaria solani)': 'अर्ली ब्लाइट (अल्टरनेरिया सोलानी)',
    'Late Blight (Phytophthora infestans)': 'लेट ब्लाइट (फायटोफ्थोरा इंफेस्टन्स)',
    'Powdery Mildew': 'पावडरी मिल्ड्यू',
    'Leaf Rust': 'लीफ रस्ट',
    'Tomato – healthy': 'टोमॅटो – निरोगी',
    'Tomato – Early blight': 'टोमॅटो – अर्ली ब्लाइट',
    'Tomato – Late blight': 'टोमॅटो – लेट ब्लाइट',
  },
  te: {
    'Demo Analysis Result': 'డెమో విశ్లేషణ ఫలితం',
    'Leaf stress detected': 'ఆకులో ఒత్తిడి గుర్తించబడింది',
    'Unknown': 'తెలియదు',
    'No disease': 'వ్యాధి లేదు',
    'Stem': 'కాండం',
    'Insufficient data': 'తగిన డేటా లేదు',
    'Normal': 'సాధారణం',
    'Mild browning': 'స్వల్ప గోధుమరంగు మార్పు',
    'Moderate browning': 'మధ్యస్థ గోధుమరంగు మార్పు',
    'Severe browning': 'తీవ్ర గోధుమరంగు మార్పు',
    'Critical deterioration': 'తీవ్ర క్షీణత',
    'Healthy Plant': 'ఆరోగ్యకరమైన మొక్క',
    'Early Blight (Alternaria solani)': 'ఎర్లీ బ్లైట్ (ఆల్టర్నేరియా సోలాని)',
    'Late Blight (Phytophthora infestans)': 'లేట్ బ్లైట్ (ఫైటోఫ్తోరా ఇన్‌ఫెస్టాన్స్)',
    'Powdery Mildew': 'పౌడరీ మిల్డ్యూ',
    'Leaf Rust': 'లీఫ్ రస్ట్',
    'Tomato – healthy': 'టమాటా – ఆరోగ్యకరం',
    'Tomato – Early blight': 'టమాటా – ఎర్లీ బ్లైట్',
    'Tomato – Late blight': 'టమాటా – లేట్ బ్లైట్',
  },
}

export function translateClassification(value, lang = 'en') {
  return CLASSIFICATION_LABELS[lang]?.[value] || CLASSIFICATION_LABELS.en[value] || value
}

export function translateText(value, lang = 'en') {
  if (!value || lang === 'en') return value
  return TRANSLATIONS[lang]?.[value] || value
}

export function translateDiseaseName(value, lang = 'en') {
  if (!value || lang === 'en') return value
  if (TRANSLATIONS[lang]?.[value]) return TRANSLATIONS[lang][value]
  if (value.startsWith('Stem – ')) {
    const condition = value.slice('Stem – '.length)
    return `${translateText('Stem', lang)} – ${translateText(condition, lang)}`
  }
  return value
}

export function translateItems(items = [], lang = 'en') {
  return items.map((item) => translateText(item, lang))
}

export function formatLocalizedDate(value, lang = 'en') {
  if (!value) return ''
  return new Date(value).toLocaleDateString(LANGUAGE_LOCALES[lang] || LANGUAGE_LOCALES.en, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
