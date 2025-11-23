import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jenga AI - Custom AI Assistant Platform',
  description: 'Connect your own AI models, upload knowledge bases, and create custom AI assistants',
  keywords: ['AI', 'chat', 'assistant', 'custom models', 'knowledge base', 'API integration'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" style={{ height: '100vh', maxHeight: '100vh' }}>
      <body className={`${inter.className} antialiased overflow-hidden`} style={{ height: '100vh', maxHeight: '100vh', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}