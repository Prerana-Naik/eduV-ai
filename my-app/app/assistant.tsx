"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserProfile } from "@/types";
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
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import ProfileModal from "@/components/ProfileModal";
import { Volume2, VolumeX } from "lucide-react";

export default function Assistant() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<"student" | "teacher">("student");
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string>();
  const [chatResetFlag, setChatResetFlag] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const user = profile || {
    id: undefined,
    name: "Guest",
    role: mode,
    age: 0,
    subject: "General",
    chatStyle: "simple",
    qualification: "",
    email: "guest@example.com",
  };

  const userEmail = user.email || "guest@example.com";

  // Text-to-Speech function
  const speakText = useCallback((text: string) => {
    if (!isTextToSpeechEnabled) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Microsoft')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, [isTextToSpeechEnabled]);

  // Stop speech function
  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  // Toggle TTS function
  const toggleTextToSpeech = useCallback(() => {
    if (isTextToSpeechEnabled) {
      stopSpeech();
    }
    setIsTextToSpeechEnabled(!isTextToSpeechEnabled);
  }, [isTextToSpeechEnabled, stopSpeech]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleNewChat = useCallback(() => {
    stopSpeech();
    const newThreadId = `thread_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setActiveThreadId(newThreadId);
    setCurrentConversationId(newThreadId);
    setChatResetFlag((prev) => !prev);
  }, [stopSpeech]);

  const handleSelectThread = useCallback(
    (threadId: string, convMode: "student" | "teacher") => {
      stopSpeech();
      setActiveThreadId(threadId);
      setCurrentConversationId(threadId);
      setMode(convMode);
      setChatResetFlag((prev) => !prev);
    },
    [stopSpeech]
  );

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

    if (profile && profile.id) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .update({ role: newMode })
          .eq("id", profile.id)
          .select()
          .single();

        if (error) throw error;

        setProfile(data);
        setMode(newMode);
      } catch (error) {
        console.error("Error updating role:", error);
      }
    }
  }, [mode, profile]);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.log("No profile found, showing profile modal");
          setShowProfileModal(true);
        } else {
          setProfile(profileData);
          setMode(profileData.role);
        }

        setIsHydrated(true);
      } catch (error) {
        console.error("Error checking auth:", error);
        router.push("/login");
      }
    };

    checkAuthAndProfile();
  }, [router]);

  const runtime = useChatRuntime({
    api: "/api/chat",
    body: {
      role: mode,
      conversationId: activeThreadId,
      reset: chatResetFlag,
      userProfile: profile,
      threadId: activeThreadId,
      userId: user.id || "",
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
                  <button
                    onClick={handleSwitchProfile}
                    className="relative group"
                    title="Profile & Settings"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg animate__animated animate__fadeIn transition-transform group-hover:scale-105">
                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </button>

                  <div>
                    <div className="text-lg font-semibold text-gray-900 tracking-tight">
                      {mode === "teacher" ? "Educator Dashboard" : "Learning Assistance"}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {user.name} • {user.role} • {user.subject}
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  {/* Text-to-Speech Toggle Button */}
                  <button
                    onClick={toggleTextToSpeech}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      isTextToSpeechEnabled 
                        ? "bg-green-500 text-white hover:bg-green-600" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    title={isTextToSpeechEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
                  >
                    {isTextToSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    Speaker {isTextToSpeechEnabled ? "On" : "Off"}
                  </button>

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
                            AI Assistant {isTextToSpeechEnabled && "🔊"}
                          </h2>
                          <p className="text-xs text-gray-500 leading-tight -mt-0.5">
                            Personalized learning experience for {user.name}
                          </p>
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
                          onSpeakText={speakText}
                          isTextToSpeechEnabled={isTextToSpeechEnabled}
                        />
                        <div ref={bottomRef} />
                      </div>
                    </div>
                  </motion.div>
                </main>

                <div className="px-4 py-1 bg-white/30 backdrop-blur-sm border-t border-gray-200/20 flex-shrink-0">
                  <div className="flex items-center justify-center">
                    <p className="text-xs text-gray-400 text-center leading-none">
                      Powered by AI • v2.2 • Enhanced with History
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
