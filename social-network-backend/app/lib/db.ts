import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Test de la connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err)
  } else {
    console.log('✅ Connecté à la base de données à:', res.rows[0].now)
  }
})

export const query = (text: string, params?: any[]) => pool.query(text, params)