'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { APIClient, GenerationHistory as HistoryItem } from '@/lib/api-client'
import { formatTimestamp } from '@/lib/image-utils'
import { HistorySkeleton } from './LoadingStates'

interface GenerationHistoryProps {
  onSelectImage: (item: HistoryItem) => void
  onClose: () => void
  refreshTrigger: number
}

export default function GenerationHistory({ onSelectImage, onClose, refreshTrigger }: GenerationHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [refreshTrigger])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const historyData = APIClient.getHistory()
      setHistory(historyData)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all generation history? This action cannot be undone.')) {
      APIClient.clearHistory()
      setHistory([])
    }
  }

  const handleImageSelect = (item: HistoryItem) => {
    onSelectImage(item)
    onClose()
  }

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              Generation History
              <Badge variant="secondary" className="text-xs bg-white/10 text-white/80">
                {history.length}
              </Badge>
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            ✕
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {isLoading ? (
          <HistorySkeleton />
        ) : history.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-white font-medium">No images yet</h3>
              <p className="text-white/60 text-sm">
                Generate your first image to see it appear here
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleImageSelect(item)}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all group text-left"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.prompt}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6e570915-3714-4ee9-8f76-b0ad203d200d.png'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 rounded-lg transition-colors"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white/90 text-sm font-medium line-clamp-2 group-hover:text-white transition-colors">
                          {item.prompt}
                        </p>
                        <p className="text-white/50 text-xs mt-1 group-hover:text-white/70 transition-colors">
                          {formatTimestamp(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>

            <div className="flex-shrink-0 space-y-3">
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">
                  {history.length} generation{history.length !== 1 ? 's' : ''} saved
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-red-300 hover:text-red-200 hover:bg-red-500/10 text-xs"
                  disabled={history.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}