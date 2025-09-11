'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { APIClient } from '@/lib/api-client'
import { generateFilename, copyToClipboard } from '@/lib/image-utils'
import { ImageSkeleton } from './LoadingStates'

interface ImageGalleryProps {
  imageUrl: string | null
  prompt: string
  isLoading: boolean
  onImageGenerated?: () => void
}

export default function ImageGallery({ imageUrl, prompt, isLoading, onImageGenerated }: ImageGalleryProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleDownload = async () => {
    if (!imageUrl) return
    
    setIsDownloading(true)
    setDownloadError(null)
    
    try {
      const filename = generateFilename(prompt)
      await APIClient.downloadImage(imageUrl, filename)
    } catch (error) {
      console.error('Download failed:', error)
      setDownloadError('Failed to download image. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyUrl = async () => {
    if (!imageUrl) return
    
    try {
      await copyToClipboard(imageUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleImageLoad = () => {
    onImageGenerated?.()
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-md border-white/20">
        <div className="space-y-4">
          <div className="text-center">
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
              Generating...
            </Badge>
          </div>
          <ImageSkeleton />
        </div>
      </Card>
    )
  }

  if (!imageUrl) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-md border-white/20">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎨</span>
          </div>
          <h3 className="text-xl font-semibold text-white">Ready to Create</h3>
          <p className="text-white/70">
            Enter a prompt above and click "Generate Image" to create your first AI-generated image.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-md border-white/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
            Generated Successfully
          </Badge>
          <div className="text-xs text-white/50">
            FLUX 1.1 Pro
          </div>
        </div>

        {/* Image Container */}
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg bg-black/20">
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-auto max-h-[600px] object-contain"
              onLoad={handleImageLoad}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3b1635fc-529f-4853-b7a4-7ebe20ca5fc5.png'
              }}
            />
            
            {/* Overlay with actions - appears on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                >
                  {isDownloading ? 'Downloading...' : '↓ Download'}
                </Button>
                <Button
                  onClick={handleCopyUrl}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                >
                  {copySuccess ? '✓ Copied!' : '📋 Copy URL'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Display */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/70">Prompt Used:</h4>
          <p className="text-white bg-white/5 rounded-lg p-3 text-sm leading-relaxed">
            {prompt}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            {isDownloading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Downloading...
              </span>
            ) : (
              '↓ Download Image'
            )}
          </Button>

          <Button
            onClick={handleCopyUrl}
            variant="outline"
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            {copySuccess ? '✓ URL Copied!' : '📋 Copy Image URL'}
          </Button>
        </div>

        {/* Error Display */}
        {downloadError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-200 text-sm">{downloadError}</p>
          </div>
        )}

        {/* Image Info */}
        <div className="text-xs text-white/50 text-center">
          Right-click the image to save directly, or use the buttons above for additional options.
        </div>
      </div>
    </Card>
  )
}