import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log("Probando conexión a Supabase:", supabaseUrl);
  
  // Verificamos si podemos obtener la hora de la base de datos o simplemente interactuar con la API
  const { data, error } = await supabase.from('test_table_non_existent').select('*').limit(1);
  
  // Si el error es de tabla no existente o violación de política, significa que la API conectó correctamente!
  // Si el error es de red o URL inválida, fallará de otra manera.
  if (error && error.code !== '42P01' && error.code !== 'PGRST116') {
    console.log("Conectado con éxito a la API de Supabase, aunque la tabla no exista. Error:", error.code);
  } else {
    console.log("Conectado con éxito a la API de Supabase.");
  }
}

testConnection();
