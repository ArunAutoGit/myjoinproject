import pkg from 'pg';
const { Pool } = pkg;

// Hardcoded PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://myapp_db_9ll3_user:fPNsGkWkthVOD5TqNutlMCgfXON1mdqY@dpg-d269dj7diees738ret0g-a.singapore-postgres.render.com/myapp_db_9ll3',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
