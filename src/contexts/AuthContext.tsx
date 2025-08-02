import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mevcut session'ı al
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session alma hatası:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Session alma sırasında hata:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        
        // Session'ın geçerliliğini kontrol et
        if (session) {
          const now = Math.floor(Date.now() / 1000);
          const expiresAt = session.expires_at;
          
          if (expiresAt && now >= expiresAt) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
          } else {
            setSession(session);
            setUser(session.user);
          }
        } else {
          setSession(null);
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Session yenileme kontrolü için interval
    const sessionRefreshInterval = setInterval(async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          const now = Math.floor(Date.now() / 1000);
          const expiresAt = currentSession.expires_at;
          
          // Session'ın 5 dakika içinde süresi dolacaksa yenile
          if (expiresAt && (expiresAt - now) < 300) {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) {
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
            } else if (data.session) {
              setSession(data.session);
              setUser(data.session.user);
            }
          }
        }
              } catch (err) {
          // Session yenileme hatası sessizce geçirildi
        }
    }, 60000); // Her dakika kontrol et

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionRefreshInterval);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (err) {
      // Çıkış hatası sessizce geçirildi
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 