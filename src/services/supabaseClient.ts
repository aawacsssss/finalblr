import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ppsebgfdytsdhwuhoqaq.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2ViZ2ZkeXRzZGh3dWhvcWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODUxMDUsImV4cCI6MjA2ODM2MTEwNX0.0UxavI_Bo1y_CuD90PKxPiJBkmh7Une1SgzJyVw4Qi4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 