import { createClient } from '@supabase/supabase-js';
import {config} from "../config/config"

const supabase = createClient(
  config.databaseUrl,
  config.sbKey // ⚠️ Use service role key on backend only!
);

export default supabase;
