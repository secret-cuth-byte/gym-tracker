import { getSessions } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function History() {
  const sessions = await getSessions()
  
  // Group sessions by week
  const byWeek: Record<number, any[]> = {}
  sessions.forEach((s: any) => {
    const week = s.week_number || 1
    if (!byWeek[week]) byWeek[week] = []
    byWeek[week].push(s)
  })

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Workout History</h2>
      
      {Object.keys(byWeek).length === 0 ? (
        <div className="card">
          <p className="text-gray-500">No workouts recorded yet.</p>
        </div>
      ) : (
        Object.entries(byWeek)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .map(([week, weekSessions]) => (
            <div key={week} className="card">
              <h3 className="text-xl font-bold mb-4">Week {week}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {weekSessions.map((session: any) => (
                  <a
                    key={session.id}
                    href={`/session/${session.id}`}
                    className="bg-[#0f0f0f] border border-[#262626] rounded-lg p-4 hover:border-blue-500/50 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-400">Day {session.day_type}</span>
                      {session.energy_level && (
                        <span className="text-sm">
                          {'⚡'.repeat(session.energy_level)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      {new Date(session.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{session.total_sets} sets</span>
                      <span>{session.total_reps} reps</span>
                      <span>{((session.total_volume || 0) / 1000).toFixed(1)}t</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  )
}
