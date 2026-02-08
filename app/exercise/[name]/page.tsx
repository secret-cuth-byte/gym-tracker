import { getExerciseProgress } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function ExerciseDetail({ params }: { params: { name: string } }) {
  const exercise = decodeURIComponent(params.name)
  const progress = await getExerciseProgress(exercise)

  // Group by date for chart
  const byDate: Record<string, { maxWeight: number; totalReps: number; sets: number }> = {}
  progress.forEach((p: any) => {
    const date = new Date(p.date).toISOString().split('T')[0]
    if (!byDate[date]) {
      byDate[date] = { maxWeight: 0, totalReps: 0, sets: 0 }
    }
    byDate[date].maxWeight = Math.max(byDate[date].maxWeight, parseFloat(p.weight_kg))
    byDate[date].totalReps += p.reps
    byDate[date].sets += 1
  })

  const chartData = Object.entries(byDate).map(([date, data]) => ({
    date,
    ...data
  }))

  const maxWeight = Math.max(...progress.map((p: any) => parseFloat(p.weight_kg)))
  const totalVolume = progress.reduce((sum: number, p: any) => sum + (p.weight_kg * p.reps), 0)

  return (
    <div className="space-y-8">
      <div>
        <a href="/exercises" className="text-blue-400 text-sm hover:underline">← Back to Exercises</a>
        <h2 className="text-3xl font-bold mt-2">{exercise}</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <span className="stat-value">{maxWeight}kg</span>
          <span className="stat-label">Max Weight</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{progress.length}</span>
          <span className="stat-label">Total Sets</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{(totalVolume / 1000).toFixed(1)}t</span>
          <span className="stat-label">Total Volume</span>
        </div>
      </div>

      {/* Progress Chart (simple bar representation) */}
      <div className="card">
        <h3 className="font-bold mb-4">Weight Progress</h3>
        <div className="space-y-2">
          {chartData.map((day, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">
                {new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              <div className="flex-1 h-6 bg-[#0f0f0f] rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-end pr-2"
                  style={{ width: `${(day.maxWeight / maxWeight) * 100}%` }}
                >
                  <span className="text-xs font-bold">{day.maxWeight}kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Sets */}
      <div className="card">
        <h3 className="font-bold mb-4">All Sets</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {progress.map((set: any, i: number) => (
            <div 
              key={i}
              className="bg-[#0f0f0f] rounded-lg p-2 text-center text-sm"
            >
              <div className="font-bold text-blue-400">{set.weight_kg}kg</div>
              <div className="text-gray-400">×{set.reps}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
