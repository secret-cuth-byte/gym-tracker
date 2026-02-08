import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } finally {
    client.release()
  }
}

export async function getSessions() {
  return query(`
    SELECT s.*, 
           COUNT(w.id) as total_sets, 
           SUM(w.reps) as total_reps,
           SUM(w.weight_kg * w.reps) as total_volume
    FROM workout_sessions s
    LEFT JOIN workout_sets w ON s.id = w.session_id
    GROUP BY s.id
    ORDER BY s.date DESC, s.started_at DESC
  `)
}

export async function getSessionWithSets(id: number) {
  const sessions = await query(`SELECT * FROM workout_sessions WHERE id = $1`, [id])
  const sets = await query(`SELECT * FROM workout_sets WHERE session_id = $1 ORDER BY created_at`, [id])
  return { session: sessions[0], sets }
}

export async function getExerciseProgress(exercise: string) {
  return query(`
    SELECT s.date, s.week_number, w.set_number, w.weight_kg, w.reps, w.rpe,
           (w.weight_kg * w.reps) as set_volume
    FROM workout_sets w
    JOIN workout_sessions s ON w.session_id = s.id
    WHERE LOWER(w.exercise) LIKE LOWER($1)
    ORDER BY s.date, w.set_number
  `, [`%${exercise}%`])
}

export async function getAllExercises() {
  return query(`
    SELECT DISTINCT exercise, 
           COUNT(*) as total_sets,
           MAX(weight_kg) as max_weight,
           MAX(reps) as max_reps
    FROM workout_sets 
    GROUP BY exercise 
    ORDER BY exercise
  `)
}

export async function getStats() {
  const sessions = await query(`SELECT COUNT(*) as count FROM workout_sessions`)
  const sets = await query(`SELECT COUNT(*) as count, SUM(reps) as total_reps FROM workout_sets`)
  const volume = await query(`SELECT SUM(weight_kg * reps) as total FROM workout_sets`)
  const currentWeek = await query(`SELECT MAX(week_number) as week FROM workout_sessions`)
  
  return {
    totalSessions: parseInt(sessions[0]?.count || '0'),
    totalSets: parseInt(sets[0]?.count || '0'),
    totalReps: parseInt(sets[0]?.total_reps || '0'),
    totalVolume: Math.round(parseFloat(volume[0]?.total || '0')),
    currentWeek: parseInt(currentWeek[0]?.week || '1')
  }
}

// Target weights for next workout
interface Exercise {
  name: string
  sets: string
  weight: string
  priority?: boolean
}

interface WorkoutDay {
  name: string
  exercises: Exercise[]
}

export const targetWeights: Record<string, WorkoutDay> = {
  A: {
    name: 'Push + Delts',
    exercises: [
      { name: 'Chest Press Machine', sets: '4×6-10', weight: '55 kg' },
      { name: 'Flat Dumbbell Press', sets: '3×8-12', weight: '14-16 kg DBs' },
      { name: 'Shoulder Press Machine', sets: '3×8-10', weight: '20 kg' },
      { name: 'Cable Lateral Raise', sets: '4×12-20', weight: '2.5-5 kg', priority: true },
      { name: 'Pec Deck / Cable Fly', sets: '3×12-15', weight: '45 kg' },
      { name: 'Tricep Press Machine', sets: '3×10-14', weight: '40 kg' },
    ]
  },
  B: {
    name: 'Pull + Arms',
    exercises: [
      { name: 'Pull-Ups', sets: '4×6-10', weight: 'BW or assisted' },
      { name: 'Single-Arm Lat Pulldown', sets: '3×10-14', weight: '20-25 kg/arm' },
      { name: 'Chest-Supported Row', sets: '3×8-12', weight: '30-35 kg' },
      { name: 'Straight-Arm Pulldown', sets: '3×12-15', weight: '18-22 kg' },
      { name: 'Rear Delt Cable Fly', sets: '4×15-20', weight: '2.5-5 kg/side' },
      { name: 'EZ-Bar Curl', sets: '3×8-12', weight: '18-20 kg' },
      { name: 'Hammer Curl', sets: '3×10-14', weight: '10-12 kg DBs' },
    ]
  },
  C: {
    name: 'Legs + Upper Finish',
    exercises: [
      { name: 'Squat / Hack Squat', sets: '4×6-10', weight: '50-60 kg' },
      { name: 'Romanian Deadlift', sets: '3×8-12', weight: '50-60 kg' },
      { name: 'Leg Press', sets: '3×10-15', weight: '100-120 kg' },
      { name: 'Seated Leg Curl', sets: '3×12-15', weight: '25-30 kg' },
      { name: 'Cable Lateral Raise', sets: '3×15-20', weight: '2.5 kg', priority: true },
      { name: 'Incline Dumbbell Curl', sets: '3×10-14', weight: '8-10 kg DBs' },
      { name: 'Rope Pushdown', sets: '3×12-15', weight: '25-30 kg' },
    ]
  }
}
