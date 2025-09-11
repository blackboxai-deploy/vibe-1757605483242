import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemPrompt = "You are an expert AI image generator. Create high-quality, detailed images based on user prompts. Focus on artistic composition, proper lighting, and visual appeal." } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate prompt length
    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Maximum 1000 characters allowed.' },
        { status: 400 }
      )
    }

    // Call the custom AI endpoint for image generation
    const aiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_S16jfiBUH2cc7P',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate an image: ${prompt}`
          }
        ]
      })
    })

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text()
      console.error('AI API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate image. Please try again.' },
        { status: 500 }
      )
    }

    const result = await aiResponse.json()
    
    // Extract image URL from response
    let imageUrl = ''
    if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
      const content = result.choices[0].message.content
      
      // Look for image URL in the response
      const urlMatch = content.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+\.(jpg|jpeg|png|gif|webp)/i)
      if (urlMatch) {
        imageUrl = urlMatch[0]
      } else {
        // If no direct URL, return the full content as it might contain the image data
        imageUrl = content
      }
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL found in response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during image generation' },
      { status: 500 }
    )
  }
}