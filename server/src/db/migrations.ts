import { pool } from './index';

const runMigrations = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      full_name TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS leads (
      lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      seller_name TEXT NOT NULL,
      seller_phone TEXT,
      seller_email TEXT,
      property_address TEXT NOT NULL,
      bedrooms TEXT,
      bathrooms TEXT,
      square_footage TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      created_by UUID REFERENCES users(user_id)
    );
    
    CREATE TABLE IF NOT EXISTS deals (
      deal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id UUID REFERENCES leads(lead_id),
      property_address TEXT NOT NULL,
      seller_name TEXT NOT NULL,
      seller_phone TEXT NOT NULL,
      seller_email TEXT,
      bedrooms TEXT,
      bathrooms TEXT,
      square_footage TEXT,
      target_price DECIMAL,
      assigned_price DECIMAL,
      status TEXT CHECK (status IN ('New', 'Negotiating', 'Under Contract', 'Assigned', 'Closed', 'Dead')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      notes TEXT,
      assigned_to UUID REFERENCES users(user_id)
    );
    
    CREATE TABLE IF NOT EXISTS deal_status_history (
      history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      deal_id UUID REFERENCES deals(deal_id),
      old_status TEXT,
      new_status TEXT NOT NULL,
      changed_by UUID REFERENCES users(user_id),
      timestamp TIMESTAMP DEFAULT NOW(),
      notes TEXT
    );
    
    CREATE TABLE IF NOT EXISTS documents (
      doc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      deal_id UUID REFERENCES deals(deal_id),
      filename TEXT NOT NULL,
      file_type TEXT NOT NULL,
      s3_key TEXT NOT NULL,
      uploaded_by UUID REFERENCES users(user_id),
      uploaded_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  console.log('Migrations completed');
  process.exit(0);
};

runMigrations().catch(console.error);