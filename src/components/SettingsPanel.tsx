'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SettingsPanelProps {
  systemPrompt: string
  onSystemPromptChange: (prompt: string) => void
  onClose: () => void
}

const DEFAULT_SYSTEM_PROMPTS = [
  {
    name: "Artistic",
    prompt: "You are an expert AI image generator. Create high-quality, artistic images with excellent composition, proper lighting, and visual appeal. Focus on creativity and aesthetic beauty."
  },
  {
    name: "Photorealistic",
    prompt: "You are a professional AI image generator specializing in photorealistic images. Create detailed, lifelike images with natural lighting, accurate proportions, and realistic textures."
  },
  {
    name: "Fantasy",
    prompt: "You are a creative AI image generator specializing in fantasy and magical imagery. Create imaginative, mystical images with otherworldly elements, magical lighting, and fantastical creatures or landscapes."
  },
  {
    name: "Minimalist",
    prompt: "You are an AI image generator focused on minimalist design. Create clean, simple images with plenty of white space, subtle colors, and elegant simplicity."
  },
  {
    name: "Vintage",
    prompt: "You are an AI image generator specializing in vintage and retro aesthetics. Create images with nostalgic charm, warm tones, and classic styling reminiscent of past eras."
  }
]

export default function SettingsPanel({ systemPrompt, onSystemPromptChange, onClose }: SettingsPanelProps) {
  const [currentPrompt, setCurrentPrompt] = useState(systemPrompt)

  const handleSave = () => {
    onSystemPromptChange(currentPrompt)
    onClose()
  }

  const handlePresetSelect = (preset: typeof DEFAULT_SYSTEM_PROMPTS[0]) => {
    setCurrentPrompt(preset.prompt)
  }

  const handleReset = () => {
    const defaultPrompt = "You are an expert AI image generator. Create high-quality, detailed images based on user prompts. Focus on artistic composition, proper lighting, and visual appeal."
    setCurrentPrompt(defaultPrompt)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">AI Settings</CardTitle>
            <CardDescription className="text-white/70">
              Customize how the AI generates your images
            </CardDescription>
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

      <CardContent className="space-y-6">
        {/* System Prompt Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-white mb-2">System Prompt</h3>
            <p className="text-xs text-white/60 mb-4">
              This prompt defines how the AI interprets and generates your images. 
              Customize it to achieve different styles and qualities.
            </p>
          </div>

          <Textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="Enter your system prompt..."
            className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none"
          />

          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{currentPrompt.length} characters</span>
            <span>Recommended: 50-300 characters</span>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Preset Prompts */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Quick Presets</h3>
          <div className="grid grid-cols-2 gap-3">
            {DEFAULT_SYSTEM_PROMPTS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className="p-3 text-left bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/80 hover:bg-white/20">
                    {preset.name}
                  </Badge>
                </div>
                <p className="text-xs text-white/60 line-clamp-3 group-hover:text-white/80 transition-colors">
                  {preset.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Model Information */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white">Model Information</h3>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Current Model:</span>
              <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                FLUX 1.1 Pro
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Generation Time:</span>
              <span className="text-sm text-white/90">~30-60 seconds</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Max Resolution:</span>
              <span className="text-sm text-white/90">1024x1024</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Reset to Default
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}