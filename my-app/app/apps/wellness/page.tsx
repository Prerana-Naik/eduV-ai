'use client';

import { useState, useEffect } from 'react';

type TipCategory = 'all' | 'focus' | 'health' | 'mindfulness' | 'learning' | 'creativity';

interface ProductivityTip {
  id: number;
  title: string;
  description: string;
  category: TipCategory;
  icon: string;
  color: string;
}

const productivityTips: ProductivityTip[] = [
  {
    id: 1,
    title: "Pomodoro Technique",
    description: "Work in focused 25-minute intervals followed by 5-minute breaks. After four cycles, take a longer 15-30 minute break to maintain mental freshness and sustained concentration throughout your work sessions.",
    category: "focus",
    icon: "⏰",
    color: "bg-rose-100"
  },
  {
    id: 2,
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses (2 liters) of water daily. Dehydration can reduce concentration and cognitive function. Keep a water bottle nearby as a visual reminder to hydrate regularly.",
    category: "health",
    icon: "💧",
    color: "bg-blue-100"
  },
  {
    id: 3,
    title: "Mindful Breathing",
    description: "Practice 5-10 minutes of deep breathing daily. Inhale for 4 counts, hold for 4, exhale for 6 counts to activate the parasympathetic nervous system and reduce stress.",
    category: "mindfulness",
    icon: "🌬️",
    color: "bg-lavender-100"
  },
  {
    id: 4,
    title: "Active Recall",
    description: "Test yourself on material you're learning rather than passively reviewing. This strengthens memory retention and identifies knowledge gaps more effectively than re-reading.",
    category: "learning",
    icon: "🧠",
    color: "bg-amber-100"
  },
  {
    id: 5,
    title: "Digital Detox",
    description: "Designate tech-free times each day to reduce digital overload and improve mental clarity. Consider implementing phone-free mornings or screen-free evenings for better sleep.",
    category: "mindfulness",
    icon: "📵",
    color: "bg-lavender-100"
  },
  {
    id: 6,
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for each day to cultivate positive neuropathways, improve mood, and enhance emotional resilience over time.",
    category: "mindfulness",
    icon: "📔",
    color: "bg-lavender-100"
  },
  {
    id: 7,
    title: "The 2-Minute Rule",
    description: "If a task takes less than 2 minutes, do it immediately instead of postponing it. This prevents small tasks from accumulating and becoming overwhelming.",
    category: "focus",
    icon: "⚡",
    color: "bg-rose-100"
  },
  {
    id: 8,
    title: "Standing Breaks",
    description: "Take standing breaks every 30 minutes when sitting for long periods to improve circulation, reduce back pain, and boost energy levels throughout the day.",
    category: "health",
    icon: "🦵",
    color: "bg-blue-100"
  },
  {
    id: 9,
    title: "Mind Mapping",
    description: "Use visual diagrams to organize information hierarchically, showing relationships among pieces of the whole. This engages both hemispheres of the brain for better retention.",
    category: "creativity",
    icon: "🗺️",
    color: "bg-green-100"
  },
  {
    id: 10,
    title: "The 5-4-3-2-1 Grounding Technique",
    description: "When feeling overwhelmed, identify 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This technique brings you back to the present moment.",
    category: "mindfulness",
    icon: "🌎",
    color: "bg-lavender-100"
  },
  {
    id: 11,
    title: "Feynman Technique",
    description: "Learn by teaching: explain concepts in simple terms as if teaching someone else to identify gaps in understanding. This process reinforces learning and reveals areas needing clarification.",
    category: "learning",
    icon: "👨‍🏫",
    color: "bg-amber-100"
  },
  {
    id: 12,
    title: "20-20-20 Rule",
    description: "Every 20 minutes, look at something 20 feet away for 20 seconds to reduce digital eye strain, prevent headaches, and maintain healthy vision during long screen sessions.",
    category: "health",
    icon: "👀",
    color: "bg-blue-100"
  },
  {
    id: 13,
    title: "Time Blocking",
    description: "Schedule specific time blocks for different activities throughout your day to maintain focus, reduce task-switching, and create a realistic structure for your priorities.",
    category: "focus",
    icon: "📅",
    color: "bg-rose-100"
  },
  {
    id: 14,
    title: "Progressive Muscle Relaxation",
    description: "Tense and then release each muscle group in your body, starting from your toes and working up to your head. This practice reduces physical tension and promotes relaxation.",
    category: "mindfulness",
    icon: "💆",
    color: "bg-lavender-100"
  },
  {
    id: 15,
    title: "Spaced Repetition",
    description: "Review information at increasing intervals to optimize long-term retention of knowledge. This evidence-based technique is far more effective than cramming for lasting learning.",
    category: "learning",
    icon: "🔁",
    color: "bg-amber-100"
  },
  {
    id: 16,
    title: "Power Posing",
    description: "Stand in confident, expansive poses for 2 minutes to reduce cortisol levels, increase testosterone, and boost feelings of confidence before important events or presentations.",
    category: "mindfulness",
    icon: "💪",
    color: "bg-lavender-100"
  },
  {
    id: 17,
    title: "The Eisenhower Matrix",
    description: "Prioritize tasks by urgency and importance, sorting out less urgent and important tasks. This clarifies what truly deserves your attention and energy each day.",
    category: "focus",
    icon: "📊",
    color: "bg-rose-100"
  },
  {
    id: 18,
    title: "Blue Light Protection",
    description: "Use blue light filters on screens in the evening to protect your circadian rhythm and improve sleep quality. Consider blue light blocking glasses for extended screen time.",
    category: "health",
    icon: "🛡️",
    color: "bg-blue-100"
  },
  {
    id: 19,
    title: "Mindful Walking",
    description: "Take short walks where you pay close attention to the physical sensations of movement and your surroundings. This meditative practice combines physical activity with mindfulness.",
    category: "mindfulness",
    icon: "🚶",
    color: "bg-lavender-100"
  },
  {
    id: 20,
    title: "The 5-Second Rule",
    description: "When you have an instinct to act on a goal, count 5-4-3-2-1 and physically move before your brain stops you. This interrupts hesitation and prompts immediate action.",
    category: "focus",
    icon: "5️⃣",
    color: "bg-rose-100"
  },
  {
    id: 21,
    title: "Intermittent Fasting",
    description: "Consider time-restricted eating (like 16:8) for potential cognitive and metabolic benefits. Always consult with a healthcare professional before making significant dietary changes.",
    category: "health",
    icon: "⏲️",
    color: "bg-blue-100"
  },
  {
    id: 22,
    title: "Dual Coding",
    description: "Combine verbal and visual information when learning to create stronger memory traces. This approach engages multiple cognitive pathways for more robust learning.",
    category: "learning",
    icon: "👁️‍🗨️",
    color: "bg-amber-100"
  },
  {
    id: 23,
    title: "Digital Mindfulness",
    description: "Set intentional boundaries for technology use rather than reacting to every notification. Designate specific times to check emails and messages to avoid constant interruption.",
    category: "mindfulness",
    icon: "📱",
    color: "bg-lavender-100"
  },
  {
    id: 24,
    title: "The 80/20 Rule",
    description: "Identify the 20% of activities that yield 80% of results and focus your energy there. This principle helps maximize productivity by concentrating on high-impact tasks.",
    category: "focus",
    icon: "🎯",
    color: "bg-rose-100"
  },
  {
    id: 25,
    title: "Nature Exposure",
    description: "Spend at least 20 minutes in nature daily to reduce stress hormone levels and improve well-being. Even viewing nature through a window can provide cognitive restoration.",
    category: "health",
    icon: "🌳",
    color: "bg-blue-100"
  },
  {
    id: 26,
    title: "Brain Dumping",
    description: "Write down everything on your mind to clear mental clutter and organize thoughts. This practice reduces cognitive load and creates space for focused work.",
    category: "creativity",
    icon: "🧹",
    color: "bg-green-100"
  },
  {
    id: 27,
    title: "The 1% Rule",
    description: "Aim to improve by just 1% each day. Small consistent improvements lead to significant growth over time, creating compound interest in your personal development.",
    category: "learning",
    icon: "📈",
    color: "bg-amber-100"
  },
  {
    id: 28,
    title: "Box Breathing",
    description: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4+ times to calm the nervous system. This technique is used by Navy SEALs to maintain calm under pressure.",
    category: "mindfulness",
    icon: "🔲",
    color: "bg-lavender-100"
  },
  {
    id: 29,
    title: "Standing Desk",
    description: "Alternate between sitting and standing while working to reduce sedentary time and improve posture. Aim for a ratio of approximately 15 minutes standing for every 45 minutes sitting.",
    category: "health",
    icon: "🪑",
    color: "bg-blue-100"
  },
  {
    id: 30,
    title: "The 2-Day Rule",
    description: "Never skip a productive habit two days in a row. Consistency matters more than perfection. If you miss one day, ensure you get back on track the next day.",
    category: "focus",
    icon: "🔁",
    color: "bg-rose-100"
  }
];

const categoryColors: Record<TipCategory, string> = {
  'all': 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800',
  'focus': 'bg-rose-100 text-rose-800',
  'health': 'bg-blue-100 text-blue-800',
  'mindfulness': 'bg-lavender-100 text-purple-800',
  'learning': 'bg-amber-100 text-amber-800',
  'creativity': 'bg-green-100 text-green-800'
};

const categoryNames: Record<TipCategory, string> = {
  'all': 'All Tips',
  'focus': 'Focus & Productivity',
  'health': 'Health & Wellness',
  'mindfulness': 'Mindfulness & Balance',
  'learning': 'Learning & Growth',
  'creativity': 'Creativity & Innovation'
};

export default function ProductivityTips() {
  const [activeCategory, setActiveCategory] = useState<TipCategory>('all');
  const [activeTip, setActiveTip] = useState<ProductivityTip | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTips = activeCategory === 'all' 
    ? productivityTips 
    : productivityTips.filter(tip => tip.category === activeCategory);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-blue-50/30 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center py-12">
          <h1 className="text-4xl font-serif font-light text-gray-800 mb-4">Productivity & Wellness Guide</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover techniques to enhance focus, health, and balance in your daily life</p>
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
                  Tip {activeTip.id} of {productivityTips.length}
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
          <p className="font-serif text-lg mb-2">Made with care for students and educators</p>
          <p className="text-sm">Explore these techniques to enhance your productivity and well-being</p>
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
        .bg-lavender-100 {
          background-color: #f4f2ff;
        }
        .text-lavender-800 {
          color: #5b4d9c;
        }
      `}</style>
    </div>
  );
}