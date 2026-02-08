import { getSessionWithSets } from '@/lib/db'
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

  const dayNames: Record<string, string> = {
    A: 'Push + Delts',
    B: 'Pull + Arms', 
    C: 'Legs + Upper Finish'
  }

  return (
    <div className="space-y-8">
      <div>
        <a href="/history" className="text-blue-400 text-sm hover:underline">← Back to History</a>
        <h2 className="text-3xl font-bold mt-2">
          Week {session.week_number}, Day {session.day_type}
        </h2>
        <p className="text-gray-400">{dayNames[session.day_type]}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(session.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <span className="stat-value">{sets.length}</span>
          <span className="stat-label">Sets</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{sets.reduce((sum: number, s: any) => sum + (s.reps || 0), 0)}</span>
          <span className="stat-label">Reps</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {(sets.reduce((sum: number, s: any) => sum + (s.weight_kg * s.reps || 0), 0) / 1000).toFixed(1)}t
          </span>
          <span className="stat-label">Volume</span>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {Object.entries(byExercise).map(([exercise, exerciseSets]) => (
          <div key={exercise} className="card">
            <h3 className="font-bold text-lg mb-4">{exercise}</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {exerciseSets.map((set: any, i: number) => (
                <div 
                  key={i}
                  className="bg-[#0f0f0f] rounded-lg p-3 text-center"
                >
                  <div className="text-xs text-gray-500 mb-1">Set {set.set_number}</div>
                  <div className="font-bold text-blue-400">{set.weight_kg}kg</div>
                  <div className="text-sm">×{set.reps}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#262626] flex justify-between text-sm text-gray-400">
              <span>Best: {Math.max(...exerciseSets.map((s: any) => s.weight_kg))}kg</span>
              <span>Total: {exerciseSets.reduce((sum: number, s: any) => sum + s.reps, 0)} reps</span>
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
