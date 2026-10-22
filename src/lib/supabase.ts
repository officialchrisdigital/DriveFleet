import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://elpinvefflbfsxcnvnlz.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscGludmVmZmxiZnN4Y252bmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MDE4OTcsImV4cCI6MjEwNzk3Nzg5N30.shBjdNfDJhtX4NpizgpBKzrBuff7EATfU3tO21PFjV8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
