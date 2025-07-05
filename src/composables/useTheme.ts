import { ref, computed } from 'vue'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  text: string
  background: string
}

interface CompanyData {
  colores_tema?: string
  favicon_url?: string
}

const themeColors = ref<ThemeColors>({
  primary: '#3b82f6',
  secondary: '#64748b', 
  accent: '#f1f5f9',
  text: '#1e293b',
  background: '#ffffff'
})

export function useTheme() {
  
  // Function to parse colors from company configuration
  const parseCompanyColors = (coloresTheme: string): ThemeColors | null => {
    if (!coloresTheme || typeof coloresTheme !== 'string') {
      return null
    }
    
    try {
      // Try to parse as JSON first (new format)
      const colorObj = JSON.parse(coloresTheme)
      if (colorObj && typeof colorObj === 'object') {
        return {
          primary: colorObj.primario || colorObj.primary || '#3b82f6',
          secondary: colorObj.secundario || colorObj.secondary || '#64748b',
          accent: colorObj.acento || colorObj.accent || '#f1f5f9',
          text: colorObj.texto || colorObj.text || '#1e293b',
          background: colorObj.fondo || colorObj.background || '#ffffff'
        }
      }
    } catch (e) {
      // If JSON parsing fails, try the old comma-separated format
      const colors = coloresTheme.split(',').map(color => color.trim())
      
      if (colors.length >= 3) {
        return {
          primary: colors[0] || '#3b82f6',
          secondary: colors[1] || '#64748b',
          accent: colors[2] || '#f1f5f9',
          text: colors[3] || '#1e293b',
          background: colors[4] || '#ffffff'
        }
      }
    }
    
    return null
  }
  
  // Function to generate lighter and darker variations
  const generateColorVariations = (hex: string) => {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Convert to RGB
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Generate lighter version (increase brightness)
    const lighter = {
      r: Math.min(255, Math.floor(r + (255 - r) * 0.3)),
      g: Math.min(255, Math.floor(g + (255 - g) * 0.3)),
      b: Math.min(255, Math.floor(b + (255 - b) * 0.3))
    }
    
    // Generate darker version (decrease brightness)
    const darker = {
      r: Math.floor(r * 0.7),
      g: Math.floor(g * 0.7),
      b: Math.floor(b * 0.7)
    }
    
    return {
      light: `#${lighter.r.toString(16).padStart(2, '0')}${lighter.g.toString(16).padStart(2, '0')}${lighter.b.toString(16).padStart(2, '0')}`,
      dark: `#${darker.r.toString(16).padStart(2, '0')}${darker.g.toString(16).padStart(2, '0')}${darker.b.toString(16).padStart(2, '0')}`
    }
  }
  
  // Apply theme colors to CSS custom properties
  const applyTheme = (colors: ThemeColors) => {
    const root = document.documentElement
    
    // Set main colors
    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-secondary', colors.secondary)
    root.style.setProperty('--theme-accent', colors.accent)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-background', colors.background)
    
    // Generate and set variations
    const primaryVariations = generateColorVariations(colors.primary)
    const secondaryVariations = generateColorVariations(colors.secondary)
    const accentVariations = generateColorVariations(colors.accent)
    
    root.style.setProperty('--theme-primary-light', primaryVariations.light)
    root.style.setProperty('--theme-primary-dark', primaryVariations.dark)
    root.style.setProperty('--theme-secondary-light', secondaryVariations.light)
    root.style.setProperty('--theme-secondary-dark', secondaryVariations.dark)
    root.style.setProperty('--theme-accent-light', accentVariations.light)
    root.style.setProperty('--theme-accent-dark', accentVariations.dark)
    
    // Update reactive state
    themeColors.value = colors
  }
  
  // Set theme from company data
  const setThemeFromCompany = (companyData: CompanyData) => {
    if (!companyData?.colores_tema) {
      return
    }
    
    const colors = parseCompanyColors(companyData.colores_tema)
    if (colors) {
      applyTheme(colors)
    }
  }
  
  // Set favicon dynamically
  const setFavicon = (faviconUrl: string) => {
    if (!faviconUrl) return
    
    const link = (document.querySelector("link[rel*='icon']") as HTMLLinkElement) || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = faviconUrl
    document.getElementsByTagName('head')[0].appendChild(link)
  }
  
  // Computed properties for current theme
  const currentTheme = computed(() => themeColors.value)
  
  const isDarkMode = computed(() => {
    const bgColor = themeColors.value.background
    // Simple check if background is dark
    const hex = bgColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128
  })
  
  return {
    themeColors: currentTheme,
    isDarkMode,
    setThemeFromCompany,
    setFavicon,
    applyTheme,
    parseCompanyColors
  }
}