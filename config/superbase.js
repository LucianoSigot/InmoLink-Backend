import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Cambiado de SUPABASE_ANON_KEY a SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_KEY deben estar definidos en .env');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅ Definido' : '❌ No definido');
  console.error('SUPABASE_KEY:', supabaseKey ? '✅ Definido' : '❌ No definido');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
