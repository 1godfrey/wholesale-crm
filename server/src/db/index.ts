import { Pool } from 'pg';
import { config } from '../config';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export const initDb = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// Run schema migrations (simplified example)
export const runMigrations = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deals (
      deal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id UUID REFERENCES leads(lead_id),
      property_address TEXT NOT NULL,
      seller_name TEXT NOT NULL,
      seller_phone TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('New', 'Negotiating', 'Under Contract', 'Assigned', 'Closed', 'Dead')),
      target_price DECIMAL,
      assigned_price DECIMAL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      notes TEXT,
      assigned_to UUID REFERENCES users(user_id)
    );
  `);
  // Add other tables similarly...
};