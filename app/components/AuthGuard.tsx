'use client'

import { useState, useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Check server-side auth status
    fetch('/api/auth')
      .then(r => r.json())
      .then(data => setIsAuthed(data.authenticated))
      .catch(() => setIsAuthed(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input })
      })

      if (res.ok) {
        setIsAuthed(true)
      } else {
        setError(true)
        setInput('')
        setTimeout(() => setError(false), 1000)
      }
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (isAuthed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Auth wall
  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">🦸</div>
          <h1 className="text-2xl font-bold mb-2">Superhero Training</h1>
          <p className="text-gray-400 mb-6">Enter the password to continue</p>
          
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Password"
              className={`w-full bg-[#0f0f0f] border ${error ? 'border-red-500' : 'border-[#262626]'} rounded-lg px-4 py-3 text-center text-lg focus:outline-none focus:border-blue-500 transition`}
              autoFocus
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Checking...' : 'Enter'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            Secured with HTTP-only cookie
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
