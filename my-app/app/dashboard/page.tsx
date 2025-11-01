"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Palette,
  GraduationCap,
  ArrowRight,
  Users,
  BookOpen,
  Zap,
  Shield,
  Rocket,
  Star,
  LogIn,
  UserPlus,
  Calculator,
  FileText,
  Calendar,
  Clock,
  BarChart3,
  Heart,
  QrCode,
  Hash,
  Ruler,
  CheckSquare,
  BookOpenText,
  Home,
  X,
  Play,
  Sigma,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Type definitions
interface Tool {
  icon: any;
  name: string;
  description: string;
  category: string;
  color: string;
  bgColor: string;
}

interface Feature {
  icon: any;
  title: string;
  description: string;
  gradient: string;
  color: string;
  action: string;
}

interface Stat {
  icon: any;
  value: string;
  label: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "teachers">(
    "students"
  );

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features: Feature[] = [
    {
      icon: Brain,
      title: "AI Learning Assistant",
      description:
        "24/7 personalized tutoring and homework help with text-based AI",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      color: "violet",
      action: "Start Chatting",
    },
    {
      icon: Palette,
      title: "Student Dashboard",
      description:
        "10+ essential apps that work completely offline for uninterrupted learning",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      color: "blue",
      action: "Student Tools",
    },
    {
      icon: GraduationCap,
      title: "Teacher Dashboard",
      description: "Complete classroom management suite for educators",
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      color: "emerald",
      action: "Teacher Tools",
    },
  ];

  const studentTools: Tool[] = [
    {
      icon: Clock,
      name: "Timer",
      description: "Focus timer with Pomodoro technique",
      category: "Productivity",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: FileText,
      name: "Notes",
      description: "Rich text editor for organized note-taking",
      category: "Productivity",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: CheckSquare,
      name: "Todo",
      description: "Task management and productivity tracker",
      category: "Productivity",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Sigma,
      name: "Quick Math Formula",
      description: "Comprehensive math formula reference guide",
      category: "Reference",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: BookOpenText,
      name: "Exam Map",
      description: "Visual study planner and exam schedule organizer",
      category: "Planning",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      icon: QrCode,
      name: "QR Generator",
      description: "Create custom QR codes for various purposes",
      category: "Tools",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
    {
      icon: Ruler,
      name: "Unit Converter",
      description: "Convert between different measurement units",
      category: "Tools",
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
    },
    {
      icon: Hash,
      name: "Password Generator",
      description: "Secure password generator for account safety",
      category: "Security",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Calculator,
      name: "Calculator",
      description: "Basic calculator for simple math problems",
      category: "Math",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Heart,
      name: "Wellness",
      description: "Health and wellness tracking for students",
      category: "Health",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  const teacherTools: Tool[] = [
    {
      icon: Users,
      name: "Class Manager",
      description: "Complete classroom and student management",
      category: "Management",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Calendar,
      name: "Timetable",
      description: "Schedule and manage class timetables",
      category: "Planning",
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
    },
    {
      icon: BookOpen,
      name: "Lesson Planner",
      description: "Create and organize lesson plans efficiently",
      category: "Planning",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: FileText,
      name: "Notes",
      description: "Teaching notes and material organization",
      category: "Productivity",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: CheckSquare,
      name: "Attendance",
      description: "Track and manage student attendance records",
      category: "Management",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      icon: BarChart3,
      name: "Progress Tracker",
      description: "Monitor and analyze student progress",
      category: "Analytics",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
    {
      icon: Heart,
      name: "Wellness",
      description: "Teacher wellness and stress management",
      category: "Health",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  const stats: Stat[] = [
    { icon: Users, value: "10", label: "Student Tools" },
    { icon: GraduationCap, value: "7", label: "Teacher Tools" },
    { icon: Zap, value: "100%", label: "Offline Access" },
    { icon: Shield, value: "AI", label: "Assistant" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      } as const,
    },
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCloseDetails = () => {
    setSelectedTool(null);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleFeatureClick = (action: string) => {
    if (action === "Start Chatting") {
      router.push("/signup");
    } else if (action === "Student Tools") {
      setActiveTab("students");
      setTimeout(() => {
        const toolsSection = document.getElementById("tools-section");
        if (toolsSection) {
          const yOffset = -80;
          const y =
            toolsSection.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    } else if (action === "Teacher Tools") {
      setActiveTab("teachers");
      setTimeout(() => {
        const toolsSection = document.getElementById("tools-section");
        if (toolsSection) {
          const yOffset = -80;
          const y =
            toolsSection.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    }
  };

  const currentTools = activeTab === "students" ? studentTools : teacherTools;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 flex flex-col items-center p-4 relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={handleGoHome}
            >
              <motion.div
                className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-violet-500/25 bg-gradient-to-r from-violet-500 to-purple-600"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <img
                  src="/icon-512x512.png"
                  alt="Edu V AI Logo"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent group-hover:from-violet-100 group-hover:to-purple-100 transition-all">
                EduVerse
              </span>
            </motion.div>

            {/* Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium rounded-xl"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button
                onClick={handleSignUp}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-violet-500/25 transition-all duration-300 font-medium rounded-xl"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl w-full relative z-10 mt-24">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-24"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <motion.div
              animate={floatingAnimation}
              className="w-32 h-32 rounded-3xl mx-auto mb-8 shadow-2xl shadow-violet-500/25 overflow-hidden bg-gradient-to-r from-violet-500 to-purple-600"
            >
              <img
                src="/icon-512x512.png"
                alt="Edu V AI Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight"
              variants={itemVariants}
            >
              Learn Smarter
              <span className="block bg-gradient-to-r from-violet-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                With EduVerse
              </span>
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
              variants={itemVariants}
            >
              Your all-in-one educational platform with AI-powered learning and
              essential productivity tools
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-violet-500/10 transition-all"
              >
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-12 py-7 text-xl font-semibold shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 group rounded-2xl"
            >
              <Rocket className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start Learning Free
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Showcase */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-24"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl font-bold text-center text-white mb-6"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-400 text-center mb-16 max-w-2xl mx-auto"
          >
            AI-powered assistance and essential tools for students and teachers
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                className="relative group"
              >
                <Card className="h-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 overflow-hidden rounded-3xl">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <CardHeader className="text-center relative z-10 p-8">
                    <motion.div
                      className={`w-24 h-24 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-center relative z-10 pb-8">
                    <Button
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-lg hover:shadow-violet-500/25 transition-all duration-300 font-semibold rounded-xl py-6"
                      onClick={() => handleFeatureClick(feature.action)}
                    >
                      {feature.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tools Section */}
        <motion.div
          id="tools-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-24"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl font-bold text-center text-white mb-6"
          >
            Essential Tools
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-400 text-center mb-12 max-w-2xl mx-auto"
          >
            Powerful tools designed specifically for students and educators
          </motion.p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
              <button
                onClick={() => setActiveTab("students")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "students"
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Student Tools
              </button>
              <button
                onClick={() => setActiveTab("teachers")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "teachers"
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Teacher Tools
              </button>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {currentTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.05 }}
                className="relative group"
              >
                <Card
                  className="h-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 cursor-pointer rounded-2xl overflow-hidden"
                  onClick={() => handleToolClick(tool)}
                >
                  <CardContent className="p-6 text-center relative">
                    <div
                      className={`absolute inset-0 ${tool.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    <div
                      className={`w-16 h-16 ${tool.color} bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/10 transition-colors relative z-10 border border-white/10`}
                    >
                      <tool.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2 relative z-10">
                      {tool.name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-3 relative z-10">
                      {tool.description}
                    </p>
                    <div className="text-xs font-medium text-slate-400 bg-white/5 rounded-full px-3 py-1 inline-block relative z-10 border border-white/10">
                      {tool.category}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-16"
        >
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-3xl p-16 border border-white/10 backdrop-blur-sm relative overflow-hidden">
            <motion.div
              animate={floatingAnimation}
              className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/25 relative z-10"
            >
              <Star className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-6 relative z-10">
              Ready to Transform Learning?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
              Join our platform and experience the future of education today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Button
                size="lg"
                onClick={handleSignUp}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-12 py-6 text-lg font-semibold shadow-2xl hover:shadow-violet-500/25 rounded-2xl"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Free Account
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLogin}
                className="border-2 border-white/50 hover:border-white/70 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tool Details Modal */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${selectedTool.color} ${selectedTool.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <selectedTool.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {selectedTool.name}
                      </h3>
                      <p className="text-slate-400">{selectedTool.category}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseDetails}
                    className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-6">
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    {selectedTool.description}
                  </p>

                  <div className="flex justify-center">
                    <Button
                      onClick={handleSignUp}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl py-3 px-8"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Try {selectedTool.name}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
