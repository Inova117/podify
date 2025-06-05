export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    marketSize: 'large',
    competition: 'high',
    priority: 1
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    marketSize: 'massive',
    competition: 'low',
    priority: 1 // HIGH PRIORITY NICHE
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    marketSize: 'large',
    competition: 'very-low',
    priority: 1 // HIGH PRIORITY NICHE
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    marketSize: 'medium',
    competition: 'medium',
    priority: 2
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    marketSize: 'medium',
    competition: 'medium',
    priority: 2
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    marketSize: 'medium',
    competition: 'low',
    priority: 2
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    marketSize: 'massive',
    competition: 'low',
    priority: 3
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    marketSize: 'large',
    competition: 'low',
    priority: 3
  }
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES
export type Language = typeof SUPPORTED_LANGUAGES[LanguageCode]

// Platform-specific content formats
export const CONTENT_FORMATS = {
  tiktok: {
    name: 'TikTok',
    aspectRatio: '9:16',
    maxDuration: 180, // 3 minutes
    optimalDuration: 30,
    captionStyle: 'bold-center',
    hookRequired: true,
    platforms: ['tiktok']
  },
  reels: {
    name: 'Instagram Reels',
    aspectRatio: '9:16',
    maxDuration: 90,
    optimalDuration: 30,
    captionStyle: 'modern-bottom',
    hookRequired: true,
    platforms: ['instagram']
  },
  shorts: {
    name: 'YouTube Shorts',
    aspectRatio: '9:16',
    maxDuration: 60,
    optimalDuration: 45,
    captionStyle: 'youtube-style',
    hookRequired: true,
    platforms: ['youtube']
  },
  linkedin: {
    name: 'LinkedIn',
    aspectRatio: '1:1',
    maxDuration: 600, // 10 minutes
    optimalDuration: 120,
    captionStyle: 'professional',
    hookRequired: false,
    platforms: ['linkedin']
  },
  twitter: {
    name: 'X (Twitter)',
    aspectRatio: '16:9',
    maxDuration: 140,
    optimalDuration: 45,
    captionStyle: 'minimal',
    hookRequired: true,
    platforms: ['twitter']
  },
  podcast: {
    name: 'Podcast Audiogram',
    aspectRatio: '1:1',
    maxDuration: 300,
    optimalDuration: 90,
    captionStyle: 'waveform',
    hookRequired: false,
    platforms: ['multiple']
  }
} as const

export type ContentFormat = keyof typeof CONTENT_FORMATS

// Viral hooks by language and niche
export const VIRAL_HOOKS = {
  en: {
    business: [
      "This changed everything about how I...",
      "The $10M mistake everyone makes...",
      "What billionaires don't want you to know...",
      "This took me from $0 to $100K in...",
      "The one thing that 99% of people get wrong..."
    ],
    lifestyle: [
      "I wish someone told me this 10 years ago...",
      "This habit changed my entire life...",
      "The secret that no one talks about...",
      "What I learned after losing everything...",
      "This is why most people fail at..."
    ],
    tech: [
      "This AI tool just changed everything...",
      "The future is already here and...",
      "What tech giants don't want you to know...",
      "This breakthrough will disrupt...",
      "The technology that will replace..."
    ]
  },
  es: {
    business: [
      "Esto cambió todo sobre cómo yo...",
      "El error de $10M que todos cometen...",
      "Lo que los millonarios no quieren que sepas...",
      "Esto me llevó de $0 a $100K en...",
      "La única cosa que 99% de la gente hace mal..."
    ],
    lifestyle: [
      "Ojalá alguien me hubiera dicho esto hace 10 años...",
      "Este hábito cambió toda mi vida...",
      "El secreto del que nadie habla...",
      "Lo que aprendí después de perderlo todo...",
      "Por esto la mayoría de gente falla en..."
    ],
    tech: [
      "Esta herramienta de IA acaba de cambiar todo...",
      "El futuro ya está aquí y...",
      "Lo que las grandes tecnológicas no quieren que sepas...",
      "Este avance va a revolucionar...",
      "La tecnología que va a reemplazar..."
    ]
  },
  pt: {
    business: [
      "Isso mudou tudo sobre como eu...",
      "O erro de R$50M que todos cometem...",
      "O que os bilionários não querem que você saiba...",
      "Isso me levou de R$0 a R$500K em...",
      "A única coisa que 99% das pessoas fazem errado..."
    ],
    lifestyle: [
      "Queria que alguém tivesse me dito isso 10 anos atrás...",
      "Este hábito mudou minha vida inteira...",
      "O segredo que ninguém fala...",
      "O que aprendi depois de perder tudo...",
      "Por isso a maioria das pessoas falha em..."
    ],
    tech: [
      "Esta ferramenta de IA acabou de mudar tudo...",
      "O futuro já chegou e...",
      "O que as big techs não querem que você saiba...",
      "Esta inovação vai revolucionar...",
      "A tecnologia que vai substituir..."
    ]
  }
} as const

// Auto-detection patterns for content niches
export const NICHE_PATTERNS = {
  business: [
    'entrepreneur', 'startup', 'business', 'revenue', 'profit', 'marketing', 
    'sales', 'growth', 'scaling', 'CEO', 'founder', 'investment', 'funding'
  ],
  lifestyle: [
    'life', 'health', 'fitness', 'wellness', 'mindset', 'motivation', 
    'productivity', 'habits', 'personal', 'self-improvement', 'journey'
  ],
  tech: [
    'technology', 'AI', 'software', 'digital', 'innovation', 'future', 
    'automation', 'coding', 'development', 'startup', 'tech', 'data'
  ],
  coaching: [
    'coach', 'coaching', 'mentor', 'training', 'course', 'lesson', 
    'teach', 'learn', 'guide', 'transformation', 'results'
  ]
} as const

export type ContentNiche = keyof typeof NICHE_PATTERNS

// Language-specific caption styles
export const CAPTION_STYLES = {
  'bold-center': {
    fontSize: 'large',
    position: 'center',
    fontWeight: 'bold',
    backgroundColor: 'semi-transparent',
    textColor: 'white',
    outline: 'black'
  },
  'modern-bottom': {
    fontSize: 'medium',
    position: 'bottom-third',
    fontWeight: 'medium',
    backgroundColor: 'gradient',
    textColor: 'white',
    animation: 'fade-in'
  },
  'youtube-style': {
    fontSize: 'large',
    position: 'bottom',
    fontWeight: 'bold',
    backgroundColor: 'black',
    textColor: 'yellow',
    outline: 'none'
  },
  'professional': {
    fontSize: 'medium',
    position: 'bottom',
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    textColor: 'white',
    outline: 'subtle'
  },
  'minimal': {
    fontSize: 'small',
    position: 'bottom',
    fontWeight: 'light',
    backgroundColor: 'none',
    textColor: 'white',
    outline: 'thin'
  },
  'waveform': {
    fontSize: 'medium',
    position: 'overlay',
    fontWeight: 'medium',
    backgroundColor: 'waveform-sync',
    textColor: 'dynamic',
    animation: 'wave-highlight'
  }
} as const

// Auto-detect language from transcript
export const detectLanguage = (text: string): LanguageCode => {
  const spanishWords = ['el', 'la', 'de', 'que', 'y', 'es', 'en', 'un', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'una', 'está', 'muy', 'todo', 'pero', 'más', 'hacer', 'ser', 'puede', 'este', 'como']
  const portugueseWords = ['o', 'a', 'de', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à']
  const frenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'plus', 'par', 'grand', 'en', 'une', 'être', 'et', 'à']
  
  const words = text.toLowerCase().split(/\s+/).slice(0, 100) // Check first 100 words
  
  const spanishCount = words.filter(word => spanishWords.includes(word)).length
  const portugueseCount = words.filter(word => portugueseWords.includes(word)).length
  const frenchCount = words.filter(word => frenchWords.includes(word)).length
  
  if (spanishCount > portugueseCount && spanishCount > frenchCount && spanishCount > 3) {
    return 'es'
  }
  if (portugueseCount > spanishCount && portugueseCount > frenchCount && portugueseCount > 3) {
    return 'pt'
  }
  if (frenchCount > spanishCount && frenchCount > portugueseCount && frenchCount > 3) {
    return 'fr'
  }
  
  return 'en' // Default to English
}

// Auto-detect content niche
export const detectNiche = (text: string): ContentNiche => {
  const lowerText = text.toLowerCase()
  
  let maxMatches = 0
  let detectedNiche: ContentNiche = 'business'
  
  for (const [niche, patterns] of Object.entries(NICHE_PATTERNS)) {
    const matches = patterns.filter(pattern => lowerText.includes(pattern)).length
    if (matches > maxMatches) {
      maxMatches = matches
      detectedNiche = niche as ContentNiche
    }
  }
  
  return detectedNiche
}

// Get viral hooks for language and niche
export const getViralHooks = (language: LanguageCode, niche: ContentNiche): readonly string[] => {
  const hooks = VIRAL_HOOKS[language]
  if (!hooks) return VIRAL_HOOKS.en.business // Fallback to English business
  
  return hooks[niche] || hooks.business || VIRAL_HOOKS.en.business
}

// Platform posting configuration
export const PLATFORM_CONFIGS = {
  tiktok: {
    apiEndpoint: '/api/platforms/tiktok',
    authRequired: true,
    maxFileSize: 287 * 1024 * 1024, // 287MB
    supportedFormats: ['mp4'],
    optimalSpecs: {
      resolution: '1080x1920',
      fps: 30,
      bitrate: '2-4 Mbps'
    }
  },
  instagram: {
    apiEndpoint: '/api/platforms/instagram',
    authRequired: true,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: ['mp4', 'mov'],
    optimalSpecs: {
      resolution: '1080x1920',
      fps: 30,
      bitrate: '3.5 Mbps'
    }
  },
  youtube: {
    apiEndpoint: '/api/platforms/youtube',
    authRequired: true,
    maxFileSize: 256 * 1024 * 1024, // 256MB
    supportedFormats: ['mp4', 'mov', 'avi'],
    optimalSpecs: {
      resolution: '1080x1920',
      fps: 30,
      bitrate: '2-5 Mbps'
    }
  },
  linkedin: {
    apiEndpoint: '/api/platforms/linkedin',
    authRequired: true,
    maxFileSize: 200 * 1024 * 1024, // 200MB
    supportedFormats: ['mp4', 'mov'],
    optimalSpecs: {
      resolution: '1080x1080',
      fps: 30,
      bitrate: '5 Mbps'
    }
  },
  twitter: {
    apiEndpoint: '/api/platforms/twitter',
    authRequired: true,
    maxFileSize: 512 * 1024 * 1024, // 512MB
    supportedFormats: ['mp4', 'mov'],
    optimalSpecs: {
      resolution: '1920x1080',
      fps: 30,
      bitrate: '5 Mbps'
    }
  }
} as const

export type PlatformConfig = keyof typeof PLATFORM_CONFIGS 