export interface GenerateImageRequest {
  prompt: string
  systemPrompt?: string
}

export interface GenerateImageResponse {
  success: boolean
  imageUrl: string
  prompt: string
  timestamp: string
}

export interface GenerationHistory {
  id: string
  prompt: string
  imageUrl: string
  timestamp: string
}

export class APIClient {
  static async generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate image')
    }

    return response.json()
  }

  static async downloadImage(imageUrl: string, filename: string): Promise<void> {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error('Failed to fetch image')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      throw new Error('Failed to download image')
    }
  }

  static saveToHistory(generation: Omit<GenerationHistory, 'id'>): void {
    const history = this.getHistory()
    const newGeneration: GenerationHistory = {
      ...generation,
      id: Date.now().toString()
    }
    
    // Keep only last 50 generations
    const updatedHistory = [newGeneration, ...history].slice(0, 50)
    localStorage.setItem('image-generation-history', JSON.stringify(updatedHistory))
  }

  static getHistory(): GenerationHistory[] {
    if (typeof window === 'undefined') return []
    
    try {
      const saved = localStorage.getItem('image-generation-history')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to parse history:', error)
      return []
    }
  }

  static clearHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('image-generation-history')
    }
  }
}