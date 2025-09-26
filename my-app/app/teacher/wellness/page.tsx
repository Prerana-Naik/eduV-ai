'use client';

import { useState, useEffect } from 'react';

type TipCategory = 'all' | 'classroom' | 'wellness' | 'efficiency' | 'mindfulness' | 'professional';

interface ProductivityTip {
  id: number;
  title: string;
  description: string;
  category: TipCategory;
  icon: string;
  color: string;
}

const teacherTips: ProductivityTip[] = [
  {
    id: 1,
    title: "Batch Lesson Planning",
    description: "Dedicate specific blocks of time to plan multiple lessons at once. This reduces context switching and helps you see connections across units, making your curriculum more cohesive.",
    category: "efficiency",
    icon: "📚",
    color: "bg-indigo-100"
  },
  {
    id: 2,
    title: "Grading Time Caps",
    description: "Set a time limit for grading each assignment (e.g., 2 minutes per paper). Use a timer to maintain focus and efficiency. This prevents perfectionism from consuming your personal time.",
    category: "efficiency",
    icon: "⏱️",
    color: "bg-indigo-100"
  },
  {
    id: 3,
    title: "Classroom Mindfulness Minute",
    description: "Begin each class with 60 seconds of mindful breathing. This centers both you and your students, creating a calmer learning environment and reducing stress throughout the day.",
    category: "mindfulness",
    icon: "🧘",
    color: "bg-teal-100"
  },
  {
    id: 4,
    title: "The Teacher Sanctuary",
    description: "Create a small, designated space in your classroom with items that bring you joy (photos, plants, inspirational quotes). Retreat to this space during breaks for mental reset.",
    category: "wellness",
    icon: "🌿",
    color: "bg-amber-100"
  },
  {
    id: 5,
    title: "Peer Observation Exchange",
    description: "Partner with a colleague to observe each other's classes monthly. This provides fresh perspectives, reduces isolation, and generates new teaching strategies without formal evaluation pressure.",
    category: "professional",
    icon: "👥",
    color: "bg-purple-100"
  },
  {
    id: 6,
    title: "Voice Preservation Technique",
    description: "Use a portable microphone during lectures, practice diaphragmatic breathing, and incorporate 'vocal naps' (5 minutes of silence) between classes to protect your most important teaching tool.",
    category: "wellness",
    icon: "🎤",
    color: "bg-amber-100"
  },
  {
    id: 7,
    title: "The 5-Minute Reset",
    description: "Between classes, take 5 minutes for a quick reset: stretch, hydrate, and take three deep breaths. This small ritual prevents the accumulation of stress throughout the school day.",
    category: "mindfulness",
    icon: "🔁",
    color: "bg-teal-100"
  },
  {
    id: 8,
    title: "Template Library",
    description: "Create and maintain a digital library of reusable templates for lesson plans, assignments, and communications. This saves countless hours over the school year.",
    category: "efficiency",
    icon: "📁",
    color: "bg-indigo-100"
  },
  {
    id: 9,
    title: "Strategic Seating Plans",
    description: "Use data-driven seating arrangements that promote positive behavior and learning. Change seating monthly to refresh classroom dynamics and relationships.",
    category: "classroom",
    icon: "💺",
    color: "bg-rose-100"
  },
  {
    id: 10,
    title: "Email Time Blocks",
    description: "Check and respond to emails only at designated times (e.g., morning, lunch, end of day). This prevents constant interruptions to teaching focus and reduces stress.",
    category: "efficiency",
    icon: "📧",
    color: "bg-indigo-100"
  },
  {
    id: 11,
    title: "Gratitude Circle",
    description: "End each week by having students share one thing they're grateful for about the class. This builds community and sends you into the weekend with positive reflections.",
    category: "classroom",
    icon: "🔄",
    color: "bg-rose-100"
  },
  {
    id: 12,
    title: "Walking Meetings",
    description: "Suggest walking meetings with colleagues instead of sitting in the staff room. The movement boosts creativity, reduces stiffness from sitting, and provides fresh air.",
    category: "wellness",
    icon: "🚶",
    color: "bg-amber-100"
  },
  {
    id: 13,
    title: "Micro-Learning",
    description: "Dedicate 10 minutes daily to professional development through educational podcasts, short articles, or teaching videos. Small consistent learning adds up significantly over time.",
    category: "professional",
    icon: "🎧",
    color: "bg-purple-100"
  },
  {
    id: 14,
    title: "The Two-File System",
    description: "Maintain two files: one for lesson ideas that worked exceptionally well, and another for those that need improvement. Review these when planning future units.",
    category: "classroom",
    icon: "🗂️",
    color: "bg-rose-100"
  },
  {
    id: 15,
    title: "Digital Detox Evenings",
    description: "Designate at least two weeknights as screen-free after school hours. This reduces mental clutter and improves sleep quality, which is essential for teacher resilience.",
    category: "wellness",
    icon: "📵",
    color: "bg-amber-100"
  },
  {
    id: 16,
    title: "Peer Feedback Protocol",
    description: "Establish a structured process for giving and receiving feedback with a trusted colleague. Focus on specific, actionable suggestions rather than general praise or criticism.",
    category: "professional",
    icon: "💬",
    color: "bg-purple-100"
  },
  {
    id: 17,
    title: "Transition Rituals",
    description: "Create a personal ritual to mark the transition from school to home (e.g., changing clothes, 5-minute meditation, listening to a specific playlist). This helps mentally leave work at work.",
    category: "mindfulness",
    icon: "🔄",
    color: "bg-teal-100"
  },
  {
    id: 18,
    title: "Student Assistants Program",
    description: "Train responsible students to handle routine classroom tasks (distributing materials, organizing supplies). This builds student ownership and frees your time for instructional priorities.",
    category: "classroom",
    icon: "👨‍🎓",
    color: "bg-rose-100"
  },
  {
    id: 19,
    title: "Quarterly Reflection",
    description: "Set aside time each quarter to reflect on your teaching practice. What's working? What needs adjustment? Document these insights to track your professional growth.",
    category: "professional",
    icon: "📓",
    color: "bg-purple-100"
  },
  {
    id: 20,
    title: "Hydration Station",
    description: "Keep a water bottle at your desk and take a sip after each learning activity transition. Teaching is vocal and physical work that requires constant hydration for peak performance.",
    category: "wellness",
    icon: "💧",
    color: "bg-amber-100"
  },
  {
    id: 21,
    title: "The Power Pose",
    description: "Before challenging classes or meetings, take two minutes to stand in a confident, expansive posture. Research shows this reduces cortisol and increases confidence.",
    category: "mindfulness",
    icon: "💪",
    color: "bg-teal-100"
  },
  {
    id: 22,
    title: "Gamified Learning",
    description: "Incorporate game elements into review sessions and routine practice. This increases engagement while reducing your preparation time for review activities.",
    category: "classroom",
    icon: "🎮",
    color: "bg-rose-100"
  },
  {
    id: 23,
    title: "Collaborative Planning",
    description: "Share planning responsibilities with grade-level or subject colleagues. Divide units among teachers and share materials to drastically reduce individual preparation time.",
    category: "efficiency",
    icon: "🤝",
    color: "bg-indigo-100"
  },
  {
    id: 24,
    title: "Nourishment Prep",
    description: "Pack healthy snacks and lunches the night before. Teaching requires sustained energy, and proper nutrition prevents afternoon slumps and maintains focus.",
    category: "wellness",
    icon: "🍎",
    color: "bg-amber-100"
  },
  {
    id: 25,
    title: "Digital Exit Tickets",
    description: "Use quick digital assessment tools for exit tickets and formative assessments. These tools often auto-grade, providing immediate data without adding to your grading load.",
    category: "efficiency",
    icon: "🎫",
    color: "bg-indigo-100"
  },
  {
    id: 26,
    title: "Mindful Commuting",
    description: "Transform your commute into a transition time. Listen to educational podcasts on the way to work and relaxing music or audiobooks on the way home to mentally prepare for each space.",
    category: "mindfulness",
    icon: "🚗",
    color: "bg-teal-100"
  },
  {
    id: 27,
    title: "Selective Perfectionism",
    description: "Identify which tasks require 100% effort and which can be completed at 80%. Not every assignment needs detailed comments, and not every bulletin board needs to be Pinterest-perfect.",
    category: "efficiency",
    icon: "🎯",
    color: "bg-indigo-100"
  },
  {
    id: 28,
    title: "Classroom Sound Management",
    description: "Use ambient sound or instrumental music during work periods to create a focused atmosphere. This reduces the cognitive load of monitoring classroom noise constantly.",
    category: "classroom",
    icon: "🎵",
    color: "bg-rose-100"
  },
  {
    id: 29,
    title: "Professional Learning Network",
    description: "Build a network of educators beyond your school through social media and conferences. These connections provide fresh ideas and support when facing challenges.",
    category: "professional",
    icon: "🌐",
    color: "bg-purple-100"
  },
  {
    id: 30,
    title: "Friday Feedback Forms",
    description: "End each week with a simple student feedback form asking what worked well and what could be improved. This provides valuable insights while reinforcing that you value student voice.",
    category: "classroom",
    icon: "📋",
    color: "bg-rose-100"
  }
];

const categoryColors: Record<TipCategory, string> = {
  'all': 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800',
  'classroom': 'bg-rose-100 text-rose-800',
  'wellness': 'bg-amber-100 text-amber-800',
  'efficiency': 'bg-indigo-100 text-indigo-800',
  'mindfulness': 'bg-teal-100 text-teal-800',
  'professional': 'bg-purple-100 text-purple-800'
};

const categoryNames: Record<TipCategory, string> = {
  'all': 'All Tips',
  'classroom': 'Classroom Management',
  'wellness': 'Teacher Wellness',
  'efficiency': 'Time Efficiency',
  'mindfulness': 'Mindfulness',
  'professional': 'Professional Growth'
};

export default function TeacherWellnessHub() {
  const [activeCategory, setActiveCategory] = useState<TipCategory>('all');
  const [activeTip, setActiveTip] = useState<ProductivityTip | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTips = activeCategory === 'all' 
    ? teacherTips 
    : teacherTips.filter(tip => tip.category === activeCategory);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-amber-50/30 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center py-12">
          <h1 className="text-4xl font-serif font-light text-gray-800 mb-4">Teacher Wellness & Productivity Hub</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Evidence-based strategies to support educators in and out of the classroom</p>
        </header>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-lg font-medium text-gray-700 mb-6 text-center">Explore by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {(Object.keys(categoryNames) as TipCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${categoryColors[category]} ${activeCategory === category ? 'ring-2 ring-white shadow-lg transform scale-105' : 'opacity-90 hover:opacity-100 hover:shadow-md'}`}
              >
                {categoryNames[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredTips.map((tip) => (
            <div 
              key={tip.id}
              onClick={() => setActiveTip(tip)}
              className={`${tip.color} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border border-white h-80 flex flex-col group overflow-hidden relative`}
            >
              <div className="absolute top-4 right-4 text-2xl opacity-80 group-hover:scale-110 transition-transform">
                {tip.icon}
              </div>
              
              <h3 className="text-xl font-serif font-light text-gray-800 mb-3 pr-8 group-hover:text-gray-900 transition-colors">
                {tip.title}
              </h3>
              
              <p className="text-gray-600 text-sm flex-grow overflow-hidden leading-relaxed">
                {tip.description.length > 120 
                  ? `${tip.description.substring(0, 120)}...` 
                  : tip.description
                }
              </p>
              
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <span>Read more</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Tip Modal */}
        {activeTip && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
              <button 
                onClick={() => setActiveTip(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 ${activeTip.color}`}>
                {activeTip.icon}
              </div>
              
              <h2 className="text-2xl font-serif font-light text-gray-800 mb-2">{activeTip.title}</h2>
              
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm ${categoryColors[activeTip.category]}`}>
                  {categoryNames[activeTip.category]}
                </span>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">{activeTip.description}</p>
              
              <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Tip {activeTip.id} of {teacherTips.length}
                </p>
                <button 
                  onClick={() => setActiveTip(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-12 text-gray-500 border-t border-gray-100">
          <p className="font-serif text-lg mb-2">Dedicated to supporting educators worldwide</p>
          <p className="text-sm">Teaching is a work of heart—remember to care for yours too</p>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </div>
  );
}