import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dfdnkhvllevapeomwosa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZG5raHZsbGV2YXBlb213b3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTg3NjIsImV4cCI6MjA5MTA5NDc2Mn0.OphU2N71FEk5slsi9m9oNLZGYVPba0YtzESsqWyToWw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
