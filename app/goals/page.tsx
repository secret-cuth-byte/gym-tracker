import { getStats, programInfo, dayDescriptions } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Goals() {
  const stats = await getStats()
  const weekProgress = (stats.currentWeek / 12) * 100

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Program Goals</h2>
        <p className="text-gray-400">{programInfo.name} — {programInfo.duration}</p>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">12-Week Progress</h3>
        <div className="relative h-8 bg-[#1a1a1a] rounded-full overflow-hidden mb-4">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
            style={{ width: `${weekProgress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            Week {stats.currentWeek} of 12
          </div>
        </div>
        <div className="grid grid-cols-4 text-center text-sm">
          <div className="text-gray-500">Start</div>
          <div className={stats.currentWeek >= 4 ? 'text-blue-400' : 'text-gray-500'}>Week 4</div>
          <div className={stats.currentWeek >= 8 ? 'text-blue-400' : 'text-gray-500'}>Week 8</div>
          <div className={stats.currentWeek >= 12 ? 'text-green-400' : 'text-gray-500'}>Complete</div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">🎯 Focus Areas</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {programInfo.focus.map((area, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#0f0f0f] rounded-lg p-4">
              <span className="text-2xl">
                {i === 0 ? '🎯' : i === 1 ? '📐' : i === 2 ? '💪' : '🦾'}
              </span>
              <span className="font-medium">{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Results */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">📈 Expected Results</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[#262626]">
            <span className="text-gray-400">Lean Mass Gain</span>
            <span className="font-bold text-green-400">{programInfo.expectedGains.weight}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#262626]">
            <span className="text-gray-400">Shoulders</span>
            <span className="font-bold text-blue-400">{programInfo.expectedGains.shoulders}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#262626]">
            <span className="text-gray-400">Arms</span>
            <span className="font-bold text-purple-400">{programInfo.expectedGains.arms}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-400">Chest</span>
            <span className="font-bold text-yellow-400">{programInfo.expectedGains.chest}</span>
          </div>
        </div>
      </div>

      {/* Training Split */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">🗓️ Training Split</h3>
        <div className="space-y-4">
          {Object.entries(dayDescriptions).map(([day, info]) => (
            <div key={day} className="bg-[#0f0f0f] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-blue-400">Day {day}</span>
                <span className="font-medium">{info.name}</span>
              </div>
              <div className="text-sm text-yellow-400 mb-2">Focus: {info.focus}</div>
              <p className="text-sm text-gray-400">{info.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progression Rules */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">📋 Progression Rules</h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-green-400">✓</span>
            <span>Stay 1–2 reps shy of failure on compounds</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400">✓</span>
            <span>Isolation can hit failure on last set</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400">✓</span>
            <span>Progress by adding reps first, then load</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-400">⚠</span>
            <span>If lifts stall 2+ weeks → eat more, not more volume</span>
          </li>
        </ul>
      </div>

      {/* Nutrition */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">🥗 Nutrition Targets</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[#0f0f0f] rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400">+300-400</div>
            <div className="text-sm text-gray-400">kcal/day surplus</div>
          </div>
          <div className="bg-[#0f0f0f] rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">~150g</div>
            <div className="text-sm text-gray-400">protein daily</div>
          </div>
          <div className="bg-[#0f0f0f] rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">5g</div>
            <div className="text-sm text-gray-400">creatine daily</div>
          </div>
          <div className="bg-[#0f0f0f] rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">🍚</div>
            <div className="text-sm text-gray-400">carbs around training</div>
          </div>
        </div>
      </div>

      {/* Week 7+ Intensifiers */}
      <div className="card border-yellow-500/30">
        <h3 className="text-xl font-bold mb-4">⚡ Intensifiers (Week 7+)</h3>
        <p className="text-gray-400 text-sm mb-4">Unlock one per session after week 6:</p>
        <ul className="space-y-2 text-gray-300">
          <li>• Rest-pause on lateral raises</li>
          <li>• Drop set on final arm movement</li>
          <li>• Slow 4-sec eccentrics on flys</li>
        </ul>
        {stats.currentWeek < 7 ? (
          <div className="mt-4 text-sm text-gray-500">
            🔒 Unlocks in {7 - stats.currentWeek} week{7 - stats.currentWeek > 1 ? 's' : ''}
          </div>
        ) : (
          <div className="mt-4 text-sm text-green-400">
            ✓ Unlocked! Use sparingly.
          </div>
        )}
      </div>
    </div>
  )
}
