const storageBucket =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET?.trim() || "recipe-images";

export const appConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.trim() || "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "",
  storageBucket,
};

export const isSupabaseConfigured = Boolean(
  appConfig.supabaseUrl && appConfig.supabaseAnonKey,
);
