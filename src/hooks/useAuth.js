'use client';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  const [supabaseClient, setSupabaseClient] = useState(null);

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    setIsClient(true);
    
    const initializeAuth = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { createBrowserClient } = await import("@supabase/ssr");
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          console.error('Missing Supabase environment variables');
          setLoading(false);
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseKey);
        setSupabaseClient(supabase);
        
        // Get initial session
        const getSession = async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
          } catch (error) {
            console.error('Error getting session:', error);
            setError(error);
            setUser(null);
            setLoading(false);
          }
        };

        await getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
        setError(error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshAuth = async () => {
    if (supabaseClient) {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error refreshing auth:', error);
        setError(error);
        setUser(null);
        setLoading(false);
      }
    }
  };

  return { 
    user, 
    loading: loading || !isClient, 
    isAuthenticated: !!user,
    error,
    refreshAuth
  };
} 