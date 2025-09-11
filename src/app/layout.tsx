import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Image Generator',
  description: 'Generate stunning images with AI using advanced machine learning models',
  keywords: ['AI', 'image generation', 'artificial intelligence', 'FLUX', 'machine learning'],
  authors: [{ name: 'AI Image Generator Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="min-h-screen backdrop-blur-sm bg-black/10">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}