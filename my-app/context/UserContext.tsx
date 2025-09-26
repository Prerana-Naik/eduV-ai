// // context/UserContext.tsx
// 'use client';
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { supabase } from '@/lib/supabaseClient';

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   age?: number;
//   major?: string;
//   education_level?: string;
//   year?: string;
//   chat_style?: string;
// }

// interface UserContextType {
//   userProfile: UserProfile | null;
//   setUserProfile: (profile: UserProfile | null) => void;
//   loading: boolean;
//   updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
//   signOut: () => Promise<void>;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if Supabase is properly initialized
//     if (!supabase) {
//       console.error('Supabase client not initialized');
//       setLoading(false);
//       return;
//     }

//     const getSession = async () => {
//       try {
//         const { data: { session }, error } = await supabase.auth.getSession();
        
//         if (error) {
//           console.error('Error getting session:', error);
//           return;
//         }
        
//         if (session?.user) {
//           // Fetch user profile
//           const { data: profile, error: profileError } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', session.user.id)
//             .single();

//           if (profileError) {
//             console.error('Error fetching profile:', profileError);
//           } else if (profile) {
//             setUserProfile(profile);
//           }
//         }
//       } catch (error) {
//         console.error('Error loading user:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getSession();

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (session?.user) {
//           const { data: profile } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', session.user.id)
//             .single();
//           if (profile) setUserProfile(profile);
//         } else {
//           setUserProfile(null);
//         }
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
//     if (!userProfile?.id) return false;
    
//     try {
//       const { error } = await supabase
//         .from('profiles')
//         .update(updates)
//         .eq('id', userProfile.id);

//       if (error) {
//         console.error('Error updating profile:', error);
//         return false;
//       }

//       setUserProfile(prev => prev ? { ...prev, ...updates } : null);
//       return true;
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       return false;
//     }
//   };

//   const signOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUserProfile(null);
//       // Redirect to login page after logout
//       window.location.href = '/login';
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const value: UserContextType = {
//     userProfile,
//     setUserProfile,
//     loading,
//     updateProfile,
//     signOut
//   };

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// }