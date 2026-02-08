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

// Program info
export const programInfo = {
  name: 'Superhero Aesthetics',
  duration: '12 weeks',
  frequency: '3× per week',
  focus: ['Shoulder width (delts)', 'V-taper (lats)', 'Upper chest', 'Arm size'],
  expectedGains: {
    weight: '+1.5–2.5 kg lean mass',
    shoulders: 'Visibly wider by week 6–8',
    arms: 'Fuller in sleeves',
    chest: 'Thicker even relaxed'
  }
}

// Day descriptions
export const dayDescriptions: Record<string, { name: string; focus: string; why: string }> = {
  A: {
    name: 'Push + Delts',
    focus: 'Chest width & shoulder caps',
    why: 'Incline pressing builds upper chest pop. Heavy lateral work creates the capped deltoid look that makes you look wider in any shirt.'
  },
  B: {
    name: 'Pull + Arms',
    focus: 'V-taper & arm thickness',
    why: 'Wide lats create the V-taper illusion. Hammer curls hit brachialis for that sleeve-stretching thickness. Rear delts complete the 3D shoulder look.'
  },
  C: {
    name: 'Legs + Upper Finish',
    focus: 'Foundation & polish',
    why: 'Leg work maintains proportion and drives systemic growth hormones. Upper finishers hit lagging parts while you\'re fresh from leg focus.'
  }
}

// Target weights for next workout
interface Exercise {
  name: string
  sets: string
  weight: string
  priority?: boolean
  note?: string
}

interface WorkoutDay {
  name: string
  exercises: Exercise[]
}

export const targetWeights: Record<string, WorkoutDay> = {
  A: {
    name: 'Push + Delts',
    exercises: [
      { name: 'Chest Press Machine', sets: '4×6-10', weight: '55 kg', note: 'Control eccentric' },
      { name: 'Flat Dumbbell Press', sets: '3×8-12', weight: '14-16 kg DBs', note: 'Deep stretch at bottom' },
      { name: 'Shoulder Press Machine', sets: '3×8-10', weight: '20 kg', note: 'Full ROM' },
      { name: 'Cable Lateral Raise', sets: '4×12-20', weight: '2.5-5 kg', priority: true, note: 'Pause at top, partials last set' },
      { name: 'Pec Deck / Cable Fly', sets: '3×12-15', weight: '45 kg', note: 'Squeeze & stretch' },
      { name: 'Tricep Press Machine', sets: '3×10-14', weight: '40 kg', note: 'Lock out each rep' },
    ]
  },
  B: {
    name: 'Pull + Arms',
    exercises: [
      { name: 'Pull-Ups', sets: '4×6-10', weight: 'BW or assisted', note: 'Full hang to chin over' },
      { name: 'Single-Arm Lat Pulldown', sets: '3×10-14', weight: '20-25 kg/arm', note: 'Elbow to hip' },
      { name: 'Chest-Supported Row', sets: '3×8-12', weight: '30-35 kg', note: 'Squeeze shoulder blades' },
      { name: 'Straight-Arm Pulldown', sets: '3×12-15', weight: '18-22 kg', note: 'Feel the lats' },
      { name: 'Rear Delt Cable Fly', sets: '4×15-20', weight: '2.5-5 kg/side', priority: true, note: 'Light, high reps' },
      { name: 'EZ-Bar Curl', sets: '3×8-12', weight: '18-20 kg', note: 'Strict, no swing' },
      { name: 'Hammer Curl', sets: '3×10-14', weight: '10-12 kg DBs', note: 'Brachialis focus' },
    ]
  },
  C: {
    name: 'Legs + Upper Finish',
    exercises: [
      { name: 'Squat / Hack Squat', sets: '4×6-10', weight: '50-60 kg', note: 'Depth over weight' },
      { name: 'Romanian Deadlift', sets: '3×8-12', weight: '50-60 kg', note: 'Hamstring stretch' },
      { name: 'Leg Press', sets: '3×10-15', weight: '100-120 kg', note: 'Full range' },
      { name: 'Seated Leg Curl', sets: '3×12-15', weight: '25-30 kg', note: 'Squeeze at top' },
      { name: 'Cable Lateral Raise', sets: '3×15-20', weight: '2.5 kg', priority: true, note: 'Shoulder finisher' },
      { name: 'Incline Dumbbell Curl', sets: '3×10-14', weight: '8-10 kg DBs', note: 'Long head stretch' },
      { name: 'Rope Pushdown', sets: '3×12-15', weight: '25-30 kg', note: 'Spread at bottom' },
    ]
  }
}

// Session summaries (can be updated after each session)
export const sessionSummaries: Record<number, { summary: string; wins: string[]; nextFocus: string }> = {
  1: {
    summary: 'First session in the books! Found baseline working weights across all push movements. Energy was solid, discovered the sweet spots.',
    wins: [
      'Chest press dialed in at 55kg',
      'Pec deck felt strong at 45kg',
      'Good mind-muscle connection on laterals'
    ],
    nextFocus: 'Day B coming up — focus on pull-up form and finding lat pulldown weights. Keep lateral raises light and strict.'
  }
}
