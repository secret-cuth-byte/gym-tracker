import { getAllExercises, getExerciseProgress } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Exercises() {
  const exercises = await getAllExercises()

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Exercise Progress</h2>
      
      {exercises.length === 0 ? (
        <div className="card">
          <p className="text-gray-500">No exercises recorded yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {exercises.map((ex: any) => (
            <a
              key={ex.exercise}
              href={`/exercise/${encodeURIComponent(ex.exercise)}`}
              className="card hover:border-blue-500/50 transition cursor-pointer"
            >
              <h3 className="font-bold text-lg mb-3">{ex.exercise}</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{ex.max_weight}kg</div>
                  <div className="text-xs text-gray-500 uppercase">Max Weight</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{ex.max_reps}</div>
                  <div className="text-xs text-gray-500 uppercase">Max Reps</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{ex.total_sets}</div>
                  <div className="text-xs text-gray-500 uppercase">Total Sets</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
