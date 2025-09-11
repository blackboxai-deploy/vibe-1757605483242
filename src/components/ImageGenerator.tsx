'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { APIClient, GenerationHistory } from '@/lib/api-client'
import ImageGallery from './ImageGallery'
import LoadingStates from './LoadingStates'
import HistoryPanel from './GenerationHistory'
import SettingsPanel from './SettingsPanel'

const EXAMPLE_PROMPTS = [
  "A serene mountain landscape at golden hour with misty valleys",
  "A futuristic cityscape with flying cars and neon lights", 
  "A magical forest with glowing mushrooms and fairy lights",
  "A vintage steam locomotive crossing a bridge over a canyon",
  "A cozy library with floating books and warm candlelight"
]

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [systemPrompt, setSystemPrompt] = useState("You are an expert AI image generator. Create high-quality, detailed images based on user prompts. Focus on artistic composition, proper lighting, and visual appeal.")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [historyRefresh, setHistoryRefresh] = useState(0)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)
    
    try {
      const response = await APIClient.generateImage({
        prompt: prompt.trim(),
        systemPrompt
      })

      setGeneratedImage(response.imageUrl)
      setCurrentPrompt(response.prompt)
      
      // Save to history
      APIClient.saveToHistory({
        prompt: response.prompt,
        imageUrl: response.imageUrl,
        timestamp: response.timestamp
      })

      // Trigger history refresh
      setHistoryRefresh(prev => prev + 1)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptSelect = (examplePrompt: string) => {
    setPrompt(examplePrompt)
  }

  const handleHistorySelect = (item: GenerationHistory) => {
    setGeneratedImage(item.imageUrl)
    setCurrentPrompt(item.prompt)
    setPrompt(item.prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate()
    }
  }

  if (showSettings) {
    return (
      <SettingsPanel
        systemPrompt={systemPrompt}
        onSystemPromptChange={setSystemPrompt}
        onClose={() => setShowSettings(false)}
      />
    )
  }

  if (showHistory) {
    return (
      <HistoryPanel
        onSelectImage={handleHistorySelect}
        onClose={() => setShowHistory(false)}
        refreshTrigger={historyRefresh}
      />
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          AI Image Generator
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Transform your ideas into stunning visuals with the power of artificial intelligence
        </p>
        <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-sm px-4 py-1">
          Powered by FLUX 1.1 Pro
        </Badge>
      </div>

      {/* Controls */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Create Your Image</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(true)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                📚 History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                ⚙️ Settings
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">
                Describe your image
              </label>
              <span className="text-xs text-white/60">
                {prompt.length}/1000
              </span>
            </div>
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="A beautiful sunset over a calm lake with mountains in the background..."
              className="min-h-24 bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none focus:ring-2 focus:ring-purple-400/50"
              maxLength={1000}
            />
            
            <div className="text-xs text-white/50">
              💡 Pro tip: Be descriptive! Include details about lighting, style, mood, and composition.
              Press Ctrl+Enter to generate.
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/80">Quick Examples:</h4>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptSelect(example)}
                  className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full border border-white/20 hover:border-white/30 transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* Generate Button */}
          <div className="flex items-center justify-center">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </span>
              ) : (
                '✨ Generate Image'
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                className="mt-2 text-red-200 hover:text-red-100 hover:bg-red-500/20"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <LoadingStates
          isLoading={isLoading}
          message="Creating your masterpiece..."
        />
      )}

      {/* Generated Image Display */}
      {!isLoading && (
        <ImageGallery
          imageUrl={generatedImage}
          prompt={currentPrompt}
          isLoading={false}
          onImageGenerated={() => setHistoryRefresh(prev => prev + 1)}
        />
      )}
    </div>
  )
}