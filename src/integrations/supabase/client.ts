// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dcdlbscnlsizogvgmsoq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZGxic2NubHNpem9ndmdtc29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjA4MjIsImV4cCI6MjA1ODYzNjgyMn0.tpy-CIcAD9CADPSatCTVL7UFR_3gBk0oH-imoIYv8-g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);