import { getSessionWithSets, dayDescriptions, sessionSummaries } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SessionDetail({ params }: { params: { id: string } }) {
  const { session, sets } = await getSessionWithSets(parseInt(params.id))
  
  if (!session) {
    notFound()
  }

  // Group sets by exercise
  const byExercise: Record<string, any[]> = {}
  sets.forEach((set: any) => {
    if (!byExercise[set.exercise]) byExercise[set.exercise] = []
    byExercise[set.exercise].push(set)
  })

  const dayInfo = dayDescriptions[session.day_type]
  const summary = sessionSummaries[session.id]

  return (
    <div className="space-y-6">
      <div>
        <a href="/history" className="text-blue-400 text-sm hover:underline">← Back</a>
        <div className="flex items-center gap-4 mt-2">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Week {session.week_number}, Day {session.day_type}
          </h2>
          {session.energy_level && (
            <span className="text-lg">{'⚡'.repeat(session.energy_level)}</span>
          )}
        </div>
        <p className="text-blue-400">{dayInfo?.name}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(session.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Day Focus */}
      {dayInfo && (
        <div className="card bg-blue-500/5 border-blue-500/20">
          <div className="text-sm text-blue-400 mb-1">Session Focus</div>
          <p className="text-gray-300">{dayInfo.focus}</p>
        </div>
      )}

      {/* Session Summary */}
      {summary && (
        <div className="card border-green-500/20">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span className="text-green-400">📝</span> Session Notes
          </h3>
          <p className="text-gray-300 text-sm mb-4">{summary.summary}</p>
          
          {summary.wins.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 uppercase mb-2">Wins</div>
              <ul className="space-y-1">
                {summary.wins.map((win, i) => (
                  <li key={i} className="text-sm text-green-400 flex items-center gap-2">
                    <span>✓</span> {win}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {summary.nextFocus && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
              <div className="text-xs text-yellow-400 uppercase mb-1">Next Session Focus</div>
              <p className="text-sm text-gray-300">{summary.nextFocus}</p>
            </div>
          )}
        </div>
      )}

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card">
          <span className="stat-value text-2xl">{sets.length}</span>
          <span className="stat-label text-xs">Sets</span>
        </div>
        <div className="stat-card">
          <span className="stat-value text-2xl">{sets.reduce((sum: number, s: any) => sum + (s.reps || 0), 0)}</span>
          <span className="stat-label text-xs">Reps</span>
        </div>
        <div className="stat-card">
          <span className="stat-value text-2xl">
            {(sets.reduce((sum: number, s: any) => sum + (s.weight_kg * s.reps || 0), 0) / 1000).toFixed(1)}t
          </span>
          <span className="stat-label text-xs">Volume</span>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {Object.entries(byExercise).map(([exercise, exerciseSets]) => (
          <div key={exercise} className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">{exercise}</h3>
              <span className="text-sm text-gray-500">
                Best: {Math.max(...exerciseSets.map((s: any) => parseFloat(s.weight_kg)))}kg
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {exerciseSets.map((set: any, i: number) => (
                <div 
                  key={i}
                  className="bg-[#0f0f0f] rounded-lg p-2 text-center"
                >
                  <div className="text-xs text-gray-500 mb-1">Set {set.set_number}</div>
                  <div className="font-bold text-blue-400">{set.weight_kg}kg</div>
                  <div className="text-sm text-gray-400">×{set.reps}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {session.notes && (
        <div className="card">
          <h3 className="font-bold mb-2">Notes</h3>
          <p className="text-gray-400">{session.notes}</p>
        </div>
      )}
    </div>
  )
}
