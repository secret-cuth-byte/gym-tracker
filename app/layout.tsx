import './globals.css'
import { Metadata, Viewport } from 'next'
import AuthGuard from './components/AuthGuard'

export const metadata: Metadata = {
  title: 'Superhero Training',
  description: '12-week hypertrophy tracker',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Gym Tracker',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen">
        <AuthGuard>
          <nav className="border-b border-[#262626] px-6 py-4 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <a href="/" className="text-xl font-bold flex items-center gap-2">
                <span>🦸</span>
                <span className="hidden sm:inline">Superhero Training</span>
              </a>
              <div className="flex gap-4 sm:gap-6 text-sm">
                <a href="/" className="text-gray-400 hover:text-white transition">Dashboard</a>
                <a href="/history" className="text-gray-400 hover:text-white transition">History</a>
                <a href="/exercises" className="text-gray-400 hover:text-white transition">Progress</a>
                <a href="/goals" className="text-gray-400 hover:text-white transition">Goals</a>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24">
            {children}
          </main>
        </AuthGuard>
      </body>
    </html>
  )
}
