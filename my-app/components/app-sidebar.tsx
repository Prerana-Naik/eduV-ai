"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { CreativeSidebar } from "@/components/creative-sidebar";
import { TeacherSidebar } from "@/components/teacher-sidebar";

// 🎇 Enhanced Animated Popup Component
function SparklePopup({ onClose }: { onClose: () => void }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Large Container - Covers 80% of screen */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative w-[90vw] h-[85vh] max-w-6xl max-h-[800px] bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-900/60 rounded-3xl p-8 border border-indigo-300/40 shadow-2xl overflow-hidden popup-container"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Orbs */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-20 blur-xl"
                style={{
                  background: `radial-gradient(circle, ${
                    i % 3 === 0 ? 'rgba(147,197,253,0.6)' : 
                    i % 3 === 1 ? 'rgba(192,132,252,0.6)' : 'rgba(244,114,182,0.6)'
                  })`,
                  width: `${100 + i * 40}px`,
                  height: `${100 + i * 40}px`,
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 15 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-10 gap-4 h-full">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="border border-white/20 rounded"
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full gap-8">
            
            {/* Left Side - Logo & Animation */}
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Enhanced Logo Animation */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 40px rgba(147,197,253,0.4)",
                        "0 0 80px rgba(129,140,248,0.7)",
                        "0 0 40px rgba(147,197,253,0.4)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="rounded-3xl p-4"
                  >
                    <Image
                      src="/icon-512x512.png"
                      alt="EduVerse Logo"
                      width={200}
                      height={200}
                      className="rounded-2xl object-cover"
                    />
                  </motion.div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl -z-10" />
                  
                  {/* Rotating Ring */}
                  <motion.div
                    className="absolute -inset-4 border-2 border-blue-300/30 rounded-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>

              {/* Enhanced Sparkle Particles */}
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-300 to-purple-300"
                  initial={{
                    opacity: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 4,
                  }}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}

              {/* Floating Emojis */}
              {["✨", "🚀", "🎓", "🌟", "💫"].map((emoji, i) => (
                <motion.div
                  key={emoji}
                  className="absolute text-2xl"
                  animate={{
                    y: [0, -30, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${10 + i * 20}%`,
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>

            {/* Right Side - Welcome Content */}
            <div className="flex flex-col justify-center space-y-6 text-white">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Welcome to EduVerse
                </h1>
                
                <div className="space-y-3 text-lg text-blue-100">
                  <motion.p 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="text-2xl">🚀</span>
                    Explore infinite learning possibilities
                  </motion.p>
                  
                  <motion.p 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="text-2xl">🎨</span>
                    Create, discover, and grow
                  </motion.p>
                  
                  <motion.p 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <span className="text-2xl">🌟</span>
                    Your educational journey begins now
                  </motion.p>
                </div>

                {/* Feature Highlights */}
                <motion.div 
                  className="grid grid-cols-2 gap-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  {[
                    { icon: "📚", text: "Smart Learning", color: "from-blue-500 to-cyan-500" },
                    { icon: "☺️", text: "AI Companion", color: "from-purple-500 to-pink-500" },
                    { icon: "🎯", text: "Personalized", color: "from-green-500 to-emerald-500" },
                    { icon: "⚡", text: "Interactive", color: "from-orange-500 to-red-500" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.text}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: "rgba(255,255,255,0.15)",
                        boxShadow: "0 0 20px rgba(255,255,255,0.2)"
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 + index * 0.1 }}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center text-white`}>
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  onClick={onClose}
                  className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-white shadow-lg text-lg relative overflow-hidden group"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 0 40px rgba(129,140,248,0.6)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  Begin Your Journey ✨
                </motion.button>

                {/* Additional Info */}
                <motion.p 
                  className="text-center text-blue-200/70 text-sm mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  Click anywhere outside to close and start exploring
                </motion.p>
              </motion.div>
            </div>
          </div>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 z-50 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface AppSidebarProps {
  currentConversationId?: string | null;
  onSelectConversation: (id: string, convMode: "student" | "teacher") => void;
  userMode: "student" | "teacher";
  onNewChat: () => void;
  userEmail?: string;
  userProfile?: any;
}

export function AppSidebar({
  currentConversationId,
  onSelectConversation,
  userMode,
  onNewChat,
  userEmail = "guest@example.com",
  userProfile,
}: AppSidebarProps) {
  const isTeacher = userProfile?.role === "teacher";
  const [showPopup, setShowPopup] = useState(false);

  // Hide assistant header when popup is open
  useEffect(() => {
    if (showPopup) {
      // Add class to body to hide assistant header
      document.body.classList.add('popup-open');
    } else {
      document.body.classList.remove('popup-open');
    }

    return () => {
      document.body.classList.remove('popup-open');
    };
  }, [showPopup]);

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-3">
                  {/* ✨ Clickable Animated Logo */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex aspect-square size-9 items-center justify-center rounded-lg overflow-hidden cursor-pointer relative"
                    onClick={() => setShowPopup(true)}
                  >
                    <Image
                      src="/icon-512x512.png"
                      alt="EduVerse Logo"
                      width={36}
                      height={36}
                      className="rounded-lg object-cover select-none"
                    />
                    {/* Tiny sparkle effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-lg"
                      whileHover={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* App Title */}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold tracking-wide">
                      EduVerse AI
                    </span>
                    <span className="truncate text-xs text-muted-foreground italic">
                      {isTeacher ? "Inspire & Teach" : "Learn. Create. Grow."}
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          {isTeacher ? (
            <TeacherSidebar userProfile={userProfile} />
          ) : (
            <CreativeSidebar userProfile={userProfile} />
          )}
        </SidebarContent>

        <SidebarSeparator />
      </Sidebar>

      {/* 🌌 Enhanced Popup animation window */}
      <AnimatePresence>
        {showPopup && <SparklePopup onClose={() => setShowPopup(false)} />}
      </AnimatePresence>
    </>
  );
}
