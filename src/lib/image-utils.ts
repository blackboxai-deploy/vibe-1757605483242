export const generateFilename = (prompt: string): string => {
  const cleanPrompt = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30)
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
  return `ai_image_${cleanPrompt}_${timestamp}.png`
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname) || 
           urlObj.hostname.includes('replicate') ||
           urlObj.hostname.includes('storage.googleapis.com')
  } catch {
    return false
  }
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  
  return date.toLocaleDateString()
}

export const compressImage = async (file: File, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    
    img.src = URL.createObjectURL(file)
  })
}