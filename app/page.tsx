import { getSessions, getStats, targetWeights, dayDescriptions, sessionSummaries, programInfo } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const stats = await getStats()
  const sessions = await getSessions()
  
  // Determine next workout day
  const lastSession = sessions[0]
  const dayOrder = ['A', 'B', 'C']
  const lastDayIndex = lastSession ? dayOrder.indexOf(lastSession.day_type) : -1
  const nextDay = dayOrder[(lastDayIndex + 1) % 3]
  const nextWorkout = targetWeights[nextDay]
  const nextDayInfo = dayDescriptions[nextDay]
  
  const weekProgress = (stats.currentWeek / 12) * 100
  const lastSessionSummary = lastSession ? sessionSummaries[lastSession.id] : null

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="card bg-gradient-to-br from-[#171717] to-[#0f0f0f] border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Week {stats.currentWeek}</h2>
            <p className="text-gray-400 text-sm">{programInfo.name}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-400">{Math.round(weekProgress)}%</div>
            <div className="text-xs text-gray-500">complete</div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${weekProgress}%` }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="stat-card">
          <span className="stat-value text-2xl">{stats.totalSessions}</span>
          <span className="stat-label text-xs">Sessions</span>
        </div>
        <div className="stat-card">
          <span className="stat-value text-2xl">{stats.totalSets}</span>
          <span className="stat-label text-xs">Total Sets</span>
        </div>
        <div className="stat-card">
          <span className="stat-value text-2xl">{stats.totalReps.toLocaleString()}</span>
          <span className="stat-label text-xs">Total Reps</span>
        </div>
        <div className="stat-card">
          <span className="stat-value text-2xl">{(stats.totalVolume / 1000).toFixed(1)}t</span>
          <span className="stat-label text-xs">Volume</span>
        </div>
      </div>

      {/* Last Session Summary */}
      {lastSession && (
        <div className="card border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-green-400">✓</span> Last Session
            </h3>
            <span className="text-sm text-gray-500">
              {new Date(lastSession.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-blue-400">Day {lastSession.day_type}</span>
            <span className="text-gray-400">{dayDescriptions[lastSession.day_type]?.name}</span>
          </div>

          {lastSessionSummary ? (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">{lastSessionSummary.summary}</p>
              
              <div>
                <div className="text-xs text-gray-500 uppercase mb-2">Wins</div>
                <ul className="space-y-1">
                  {lastSessionSummary.wins.map((win, i) => (
                    <li key={i} className="text-sm text-green-400 flex items-center gap-2">
                      <span>💪</span> {win}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex justify-between text-sm text-gray-400">
              <span>{lastSession.total_sets} sets</span>
              <span>{lastSession.total_reps} reps</span>
              <span>{((lastSession.total_volume || 0) / 1000).toFixed(1)}t volume</span>
            </div>
          )}
          
          <a href={`/session/${lastSession.id}`} className="block mt-4 text-sm text-blue-400 hover:underline">
            View full session →
          </a>
        </div>
      )}

      {/* Next Workout */}
      <div className="card border-blue-500/20">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">🎯 Next Workout</h3>
            <span className="text-2xl font-bold text-blue-400">Day {nextDay}</span>
          </div>
          <div className="text-blue-400 font-medium">{nextWorkout.name}</div>
          <p className="text-sm text-gray-400 mt-1">{nextDayInfo?.focus}</p>
        </div>

        {lastSessionSummary?.nextFocus && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 mb-4">
            <div className="text-xs text-yellow-400 uppercase mb-1">Focus Point</div>
            <p className="text-sm text-gray-300">{lastSessionSummary.nextFocus}</p>
          </div>
        )}
        
        <div className="space-y-1">
          {nextWorkout.exercises.map((ex, i) => (
            <div key={i} className="exercise-row">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-gray-500 w-5 text-sm">{i + 1}.</span>
                <div className="min-w-0">
                  <div className={`truncate ${ex.priority ? 'text-yellow-400' : ''}`}>
                    {ex.name}
                    {ex.priority && <span className="ml-2 text-xs bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded">⚠️</span>}
                  </div>
                  {ex.note && <div className="text-xs text-gray-500 truncate">{ex.note}</div>}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm flex-shrink-0">
                <span className="text-gray-500">{ex.sets}</span>
                <span className="text-blue-400 font-medium">{ex.weight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 1 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Sessions</h3>
            <a href="/history" className="text-sm text-blue-400 hover:underline">View all →</a>
          </div>
          <div className="space-y-2">
            {sessions.slice(1, 4).map((session: any) => (
              <a 
                key={session.id} 
                href={`/session/${session.id}`}
                className="flex items-center justify-between py-2 hover:bg-[#1f1f1f] -mx-2 px-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-blue-400">Day {session.day_type}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {session.total_sets} sets
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="card bg-[#0f0f0f]">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Remember</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Stay 1-2 reps from failure on compounds</li>
          <li>• Add reps before adding weight</li>
          <li>• {stats.currentWeek >= 7 ? '⚡ Intensifiers unlocked!' : `Intensifiers unlock week 7 (${7 - stats.currentWeek} to go)`}</li>
        </ul>
      </div>
    </div>
  )
}
