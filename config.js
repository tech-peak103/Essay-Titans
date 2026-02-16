const SUPABASE_URL = 'https://vylccnobazhagfbsgxii.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bGNjbm9iYXpoYWdmYnNneGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzA0MDcsImV4cCI6MjA4NjQ0NjQwN30.IoW2d5-lfY0Mv7cIoapiC91ZXepnZjwxk98LxSf8dXE';

// Initialize Supabase client with proper configuration
try {
  window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  console.log('Supabase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
}