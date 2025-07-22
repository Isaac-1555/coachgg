import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        // Only fetch profile on specific events to avoid loops
        if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          // Check if we already have this user to avoid duplicate fetches
          if (!user || user.id !== session.user.id) {
            await fetchUserProfile(session.user.id);
          }
        } else if (!session) {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      console.log('Profile query result:', { data, error });

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If user profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating basic profile...');
          const currentSession = await supabase.auth.getSession();
          const userEmail = currentSession.data.session?.user?.email;
          const username = userEmail?.split('@')[0] || 'User';
          
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: userId,
              username: username,
              role: 'player'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating user profile:', createError);
            return;
          }
          
          console.log('Created new user profile:', newUser);
          setUser({
            id: newUser.id,
            username: newUser.username,
            email: userEmail,
            role: newUser.role,
            profile_avatar: newUser.profile_avatar,
            created_at: newUser.created_at
          });
        }
        return;
      }

      console.log('User profile loaded successfully');
      
      // Get current session for email
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      setUser({
        id: data.id,
        username: data.username,
        email: currentSession?.user?.email,
        role: data.role,
        profile_avatar: data.profile_avatar,
        created_at: data.created_at
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signUp = async (email, password, username) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(prev => ({ ...prev, ...data }));
      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};