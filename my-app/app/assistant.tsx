"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserProfile } from '@/types'; 
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { motion } from "framer-motion";
import LogoutButton from "@/components/logoutButton";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import ProfileModal from "@/components/ProfileModal";

// Make id property optional to match ProfileModal component


export default function Assistant() {
  // All hooks must be called unconditionally at the top level
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<"student" | "teacher">("student");
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string>();
  const [chatResetFlag, setChatResetFlag] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  // All useCallbacks must be at the top level
  const handleNewChat = useCallback(() => {
    console.log("Starting new chat...");
    const newThreadId = `thread_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setActiveThreadId(newThreadId);
    setCurrentConversationId(newThreadId);
    setChatResetFlag(prev => !prev);
    console.log("Switched to new thread:", newThreadId);
  }, []);

  const handleSelectThread = useCallback((threadId: string, convMode: "student" | "teacher") => {
    console.log("Switching to thread:", threadId);
    setActiveThreadId(threadId);
    setCurrentConversationId(threadId);
    setMode(convMode);
    setChatResetFlag(prev => !prev);
  }, []);

  const handleProfileSave = useCallback((savedProfile: UserProfile) => {
    setProfile(savedProfile);
    setMode(savedProfile.role);
    setShowProfileModal(false);
  }, []);

  const handleSwitchProfile = useCallback(() => {
    setShowProfileModal(true);
  }, []);

  const handleModeToggle = useCallback(async () => {
    const newMode = mode === "student" ? "teacher" : "student";
    
    if (profile && profile.id) { // Add check for profile.id
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ role: newMode })
          .eq('id', profile.id)
          .select()
          .single();
          
        if (error) throw error;
        
        setProfile(data);
        setMode(newMode);
      } catch (error) {
        console.error('Error updating role:', error);
      }
    }
  }, [mode, profile]);

  // useEffect hooks must also be at the top level
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Check if user has a profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.log('No profile found, showing profile modal');
          setShowProfileModal(true);
        } else {
          setProfile(profileData);
          setMode(profileData.role);
        }

        setIsHydrated(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
      }
    };

    checkAuthAndProfile();
  }, [router]);

  // Move useChatRuntime to the top level, but handle the case where it might not be ready
  const runtime = useChatRuntime({
    api: "/api/chat",
    body: { 
      role: mode, 
      conversationId: activeThreadId,
      reset: chatResetFlag,
      userProfile: profile,
      threadId: activeThreadId
    },
  });

  // This useEffect must be at the top level as well
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []); // Removed runtime from dependencies to prevent potential issues

  // Conditional return must come AFTER all hooks
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Rest of your component JSX...
  const user = profile || {
    id: undefined, // id is now optional
    name: "Guest",
    role: mode,
    age: 0,
    subject: "General",
    chatStyle: "simple",
    email: "guest@example.com"
  };

  const userEmail = user.email;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        rel="stylesheet"
      />

      <AssistantRuntimeProvider runtime={runtime}>
        <SidebarProvider>
          <div className="flex h-dvh w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative">
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }}
            ></div>

            <AppSidebar
              currentConversationId={activeThreadId}
              onSelectConversation={handleSelectThread}
              userMode={mode}
              onNewChat={handleNewChat}
              userEmail={userEmail}
              userProfile={profile}
            />

            <SidebarInset className="flex flex-col">
              <header className="sticky top-0 z-50 flex h-16 items-center gap-4 px-6 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <SidebarTrigger className="hover:bg-gray-100/50 transition-colors duration-200" />

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg animate__animated animate__fadeIn">
                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </div>

                  <div>
                    <div className="text-lg font-semibold text-gray-900 tracking-tight">
                      {mode === "teacher"
                        ? "Educator Dashboard"
                        : "Learning Assistance"}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {user.name} • {user.role} • {user.subject}
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  {/* <button
                    onClick={handleModeToggle}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 backdrop-blur-sm hover:from-blue-500/20 hover:to-indigo-500/20 transition-all duration-200"
                  >
                    <span className="text-xs font-medium text-blue-700">
                      Switch →
                    </span>
                  </button> */}

                  <div className="px-4 py-1.5 rounded bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/50 backdrop-blur-sm">
                    <span className="text-xs font-medium text-green-700">
                      {mode} Mode
                    </span>
                  </div>

                  <button
                    className="px-4 py-1.5 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-xs font-medium text-gray-700 transition-all duration-200 hover:shadow-sm border border-gray-200/50"
                    onClick={handleSwitchProfile}
                    title="Edit Profile"
                  >
                    Edit Profile
                  </button>
                </div>
              </header>

              <div className="flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/30 rounded-full blur-xl animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-100/30 rounded-full blur-xl animate-pulse delay-1000 pointer-events-none"></div>

                <main className="flex-1 mx-2 mt-2 mb-1 overflow-hidden">
                  <motion.div
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden h-full flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <div className="px-3 py-1.5 bg-gradient-to-r from-white/50 to-blue-50/30 border-b border-gray-200/30 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-medium text-gray-900 tracking-tight leading-tight">
                            AI Assistant
                          </h2>
                          <p className="text-xs text-gray-500 leading-tight -mt-0.5">
                            Personalized learning experience for {user.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-400 font-medium">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-b from-white/50 to-gray-50/30 overflow-hidden min-h-0">
                      <div className="h-full">
                        <Thread
                          userEmail={userEmail}
                          userRole={mode}
                          variant="modern"
                          userProfile={profile}
                          key={activeThreadId}
                        />
                        <div ref={bottomRef} />
                      </div>
                    </div>
                  </motion.div>
                </main>

                <div className="px-4 py-1 bg-white/30 backdrop-blur-sm border-t border-gray-200/20 flex-shrink-0">
                  <div className="flex items-center justify-center">
                    <p className="text-xs text-gray-400 text-center leading-none">
                      Powered by AI • v2.1
                    </p>
                  </div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>

        <ProfileModal
          open={showProfileModal}
          onSave={handleProfileSave}
          onClose={() => setShowProfileModal(false)}
          initialData={profile || undefined}
        />
      </AssistantRuntimeProvider>
    </>
  );
}