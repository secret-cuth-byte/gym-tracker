import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Superhero Training',
  description: '12-week hypertrophy tracker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="border-b border-[#262626] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">🦸 Superhero Training</h1>
            <div className="flex gap-6 text-sm">
              <a href="/" className="text-gray-400 hover:text-white transition">Dashboard</a>
              <a href="/history" className="text-gray-400 hover:text-white transition">History</a>
              <a href="/exercises" className="text-gray-400 hover:text-white transition">Exercises</a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
