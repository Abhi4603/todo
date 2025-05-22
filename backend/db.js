import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


async function testConnection() {
  const { data, error } = await supabase.from('todos').select('id').limit(1);

  if (error) {
    console.error('Failed to connect to Supabase:', error.message);
  } else {
    console.log(' Connected to Supabase successfully.');
  }
}


testConnection();
