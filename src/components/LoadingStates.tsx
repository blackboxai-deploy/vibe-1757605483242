'use client'

import { Card } from "@/components/ui/card"

interface LoadingStatesProps {
  isLoading: boolean
  message?: string
}

export default function LoadingStates({ isLoading, message = "Generating your image..." }: LoadingStatesProps) {
  if (!isLoading) return null

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-md border-white/20">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Animated logo/icon */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Loading message */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">{message}</h3>
          <p className="text-sm text-white/70">This may take a few moments...</p>
        </div>

        {/* Progress indicators */}
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-xs text-white/60">
            <span>Processing request</span>
            <span>AI Model: FLUX</span>
          </div>
          
          {/* Animated progress bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Floating particles animation */}
        <div className="relative w-full h-12 overflow-hidden">
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"
                style={{
                  left: `${20 + i * 15}%`,
                  animation: `float 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Card>
  )
}

export function ImageSkeleton() {
  return (
    <div className="w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
    </div>
  )
}

export function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            <div className="h-2 bg-gray-400 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}