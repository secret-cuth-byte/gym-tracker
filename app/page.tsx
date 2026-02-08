import { getSessions, getStats, targetWeights } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const stats = await getStats()
  const sessions = await getSessions()
  
  // Determine next workout day
  const lastSession = sessions[0]
  const dayOrder = ['A', 'B', 'C']
  const lastDayIndex = lastSession ? dayOrder.indexOf(lastSession.day_type) : -1
  const nextDay = dayOrder[(lastDayIndex + 1) % 3] as keyof typeof targetWeights
  const nextWorkout = targetWeights[nextDay]
  
  const weekProgress = (stats.currentWeek / 12) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Week {stats.currentWeek} of 12</h2>
        <div className="progress-bar w-64">
          <div className="progress-fill" style={{ width: `${weekProgress}%` }} />
        </div>
        <p className="text-gray-400 mt-2">{Math.round(weekProgress)}% complete</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="stat-value">{stats.totalSessions}</span>
          <span className="stat-label">Sessions</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalSets}</span>
          <span className="stat-label">Total Sets</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalReps.toLocaleString()}</span>
          <span className="stat-label">Total Reps</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{(stats.totalVolume / 1000).toFixed(1)}t</span>
          <span className="stat-label">Volume Lifted</span>
        </div>
      </div>

      {/* Next Workout */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Next Workout: Day {nextDay}</h3>
          <span className="text-blue-400 font-medium">{nextWorkout.name}</span>
        </div>
        <div className="space-y-1">
          {nextWorkout.exercises.map((ex, i) => (
            <div key={i} className="exercise-row">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-6">{i + 1}.</span>
                <span className={ex.priority ? 'text-yellow-400' : ''}>{ex.name}</span>
                {ex.priority && <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded">PRIORITY</span>}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">{ex.sets}</span>
                <span className="text-blue-400 font-medium w-28 text-right">{ex.weight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6">Recent Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions yet. Hit the gym!</p>
        ) : (
          <div className="space-y-1">
            {sessions.slice(0, 5).map((session: any) => (
              <a 
                key={session.id} 
                href={`/session/${session.id}`}
                className="exercise-row hover:bg-[#1f1f1f] -mx-2 px-2 rounded-lg transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-400">Day {session.day_type}</span>
                  <div>
                    <div className="font-medium">Week {session.week_number}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString('en-GB', { 
                        weekday: 'short', day: 'numeric', month: 'short' 
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{session.total_sets} sets</div>
                  <div className="text-sm text-gray-500">{session.total_reps} reps</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
