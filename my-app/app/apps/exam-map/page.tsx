"use client";
import { useState } from "react";

interface Exam {
  id: number;
  name: string;
  category: string;
  level: string;
  conductingBody: string;
  eligibility: string;
  description: string;
  officialWebsite: string;
  examFrequency: string;
  importantDates?: string;
}

const ExamsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  
  const exams: Exam[] = [
    // National Level Exams
    {
      id: 1,
      name: "JEE Main",
      category: "Engineering",
      level: "National",
      conductingBody: "National Testing Agency (NTA)",
      eligibility: "Class 12 with Physics, Chemistry, and Mathematics",
      description: "Joint Entrance Examination for admission to NITs, IIITs, and other engineering colleges",
      officialWebsite: "https://jeemain.nta.nic.in",
      examFrequency: "Twice a year (January & April)"
    },
    {
      id: 2,
      name: "NEET",
      category: "Medical",
      level: "National",
      conductingBody: "National Testing Agency (NTA)",
      eligibility: "Class 12 with Physics, Chemistry, Biology/Biotechnology",
      description: "National Eligibility cum Entrance Test for admission to MBBS, BDS, and other medical courses",
      officialWebsite: "https://neet.nta.nic.in",
      examFrequency: "Once a year (May)"
    },
    {
      id: 3,
      name: "UPSC Civil Services",
      category: "Civil Services",
      level: "National",
      conductingBody: "Union Public Service Commission (UPSC)",
      eligibility: "Bachelor's degree in any discipline",
      description: "Examination for recruitment to various civil services like IAS, IPS, IFS, etc.",
      officialWebsite: "https://upsc.gov.in",
      examFrequency: "Once a year"
    },
    {
      id: 4,
      name: "CAT",
      category: "Management",
      level: "National",
      conductingBody: "Indian Institutes of Management (IIMs)",
      eligibility: "Bachelor's degree with minimum 50% marks",
      description: "Common Admission Test for admission to MBA programs in IIMs and other business schools",
      officialWebsite: "https://iimcat.ac.in",
      examFrequency: "Once a year (November)"
    },
    {
      id: 5,
      name: "SSC CGL",
      category: "Government Jobs",
      level: "National",
      conductingBody: "Staff Selection Commission (SSC)",
      eligibility: "Bachelor's degree in any discipline",
      description: "Combined Graduate Level examination for various government posts",
      officialWebsite: "https://ssc.nic.in",
      examFrequency: "Once a year"
    },
    {
      id: 6,
      name: "GATE",
      category: "Engineering",
      level: "National",
      conductingBody: "IITs and IISc Bangalore",
      eligibility: "Bachelor's degree in Engineering/Technology or Master's degree in relevant science subjects",
      description: "Graduate Aptitude Test in Engineering for admission to postgraduate programs and PSU recruitment",
      officialWebsite: "https://gate.iitk.ac.in",
      examFrequency: "Once a year (February)"
    },
    {
      id: 7,
      name: "CLAT",
      category: "Law",
      level: "National",
      conductingBody: "Consortium of NLUs",
      eligibility: "10+2 with minimum 45% marks (40% for SC/ST)",
      description: "Common Law Admission Test for admission to National Law Universities",
      officialWebsite: "https://consortiumofnlus.ac.in",
      examFrequency: "Once a year (May)"
    },
    {
      id: 8,
      name: "NDA",
      category: "Defense",
      level: "National",
      conductingBody: "Union Public Service Commission (UPSC)",
      eligibility: "10+2 with Physics and Mathematics (for Army), Physics and Mathematics for Air Force and Navy",
      description: "National Defence Academy examination for entry into Army, Navy, and Air Force wings of NDA",
      officialWebsite: "https://upsc.gov.in",
      examFrequency: "Twice a year"
    },

    // Karnataka State Board Exams
    {
      id: 9,
      name: "SSLC Examination",
      category: "School",
      level: "Karnataka State",
      conductingBody: "Karnataka Secondary Education Examination Board (KSEEB)",
      eligibility: "Class 10 students in Karnataka state board",
      description: "Secondary School Leaving Certificate examination for Class 10 students",
      officialWebsite: "https://sslc.karnataka.gov.in",
      examFrequency: "Once a year (March/April)",
      importantDates: "March-April"
    },
    {
      id: 10,
      name: "2nd PUC Examination",
      category: "School",
      level: "Karnataka State",
      conductingBody: "Department of Pre-University Education, Karnataka",
      eligibility: "Class 12 students in Karnataka PU board",
      description: "Pre-University Course examination for Class 12 students",
      officialWebsite: "https://pue.karnataka.gov.in",
      examFrequency: "Once a year (March/April)",
      importantDates: "March-April"
    },
    {
      id: 11,
      name: "KCET",
      category: "Engineering",
      level: "Karnataka State",
      conductingBody: "Karnataka Examination Authority (KEA)",
      eligibility: "Class 12 with Physics, Chemistry, and Mathematics; must be Karnataka domicile",
      description: "Karnataka Common Entrance Test for admission to engineering colleges in Karnataka",
      officialWebsite: "https://cetonline.karnataka.gov.in",
      examFrequency: "Once a year (April/May)",
      importantDates: "April-May"
    },
    {
      id: 12,
      name: "DCET",
      category: "Engineering",
      level: "Karnataka State",
      conductingBody: "Karnataka Examination Authority (KEA)",
      eligibility: "Diploma holders seeking lateral entry to engineering courses",
      description: "Diploma Common Entrance Test for lateral entry to engineering courses",
      officialWebsite: "https://cetonline.karnataka.gov.in",
      examFrequency: "Once a year (June/July)",
      importantDates: "June-July"
    },
    {
      id: 13,
      name: "Karnataka PGCET",
      category: "Postgraduate",
      level: "Karnataka State",
      conductingBody: "Karnataka Examination Authority (KEA)",
      eligibility: "Bachelor's degree in relevant field",
      description: "Post Graduate Common Entrance Test for admission to MBA, MCA, ME, M.Tech and other PG courses",
      officialWebsite: "https://cetonline.karnataka.gov.in",
      examFrequency: "Once a year (July/August)",
      importantDates: "July-August"
    },
    {
      id: 14,
      name: "Karnataka TET",
      category: "Teaching",
      level: "Karnataka State",
      conductingBody: "Department of Public Instruction, Karnataka",
      eligibility: "Bachelor's degree with B.Ed qualification",
      description: "Karnataka Teacher Eligibility Test for recruitment of teachers in state schools",
      officialWebsite: "https://schooleducation.karnataka.gov.in",
      examFrequency: "Periodically as per requirement",
      importantDates: "Varies"
    },
    {
      id: 15,
      name: "Karnataka Police Recruitment",
      category: "Government Jobs",
      level: "Karnataka State",
      conductingBody: "Karnataka State Police",
      eligibility: "Varies by post (usually 10th/12th/Graduation)",
      description: "Recruitment examination for various posts in Karnataka Police Department",
      officialWebsite: "https://ksp.gov.in",
      examFrequency: "Periodically as per vacancies",
      importantDates: "Varies"
    },
    {
      id: 16,
      name: "Karnataka Forest Department Exam",
      category: "Government Jobs",
      level: "Karnataka State",
      conductingBody: "Karnataka Forest Department",
      eligibility: "Varies by post (usually 10th/12th/Graduation)",
      description: "Recruitment examination for various posts in Karnataka Forest Department",
      officialWebsite: "https://aranya.gov.in",
      examFrequency: "Periodically as per vacancies",
      importantDates: "Varies"
    },

    // More National Exams
    {
      id: 17,
      name: "AIIMS MBBS",
      category: "Medical",
      level: "National",
      conductingBody: "All India Institute of Medical Sciences",
      eligibility: "Class 12 with Physics, Chemistry, Biology and English",
      description: "Entrance exam for MBBS program at AIIMS institutions",
      officialWebsite: "https://aiimsexams.ac.in",
      examFrequency: "Once a year (May/June)"
    },
    {
      id: 18,
      name: "JEE Advanced",
      category: "Engineering",
      level: "National",
      conductingBody: "IITs (Rotating basis)",
      eligibility: "Top 2,50,000 rank holders in JEE Main",
      description: "Entrance exam for admission to IITs and other premier engineering institutes",
      officialWebsite: "https://jeeadv.ac.in",
      examFrequency: "Once a year (May)"
    },
    {
      id: 19,
      name: "NDA",
      category: "Defense",
      level: "National",
      conductingBody: "Union Public Service Commission (UPSC)",
      eligibility: "10+2 with Physics and Mathematics",
      description: "National Defence Academy entrance exam",
      officialWebsite: "https://upsc.gov.in",
      examFrequency: "Twice a year"
    },
    {
      id: 20,
      name: "CDS",
      category: "Defense",
      level: "National",
      conductingBody: "Union Public Service Commission (UPSC)",
      eligibility: "Graduation or equivalent",
      description: "Combined Defence Services examination for officer recruitment in armed forces",
      officialWebsite: "https://upsc.gov.in",
      examFrequency: "Twice a year"
    }
  ];

  const categories = ["all", ...Array.from(new Set(exams.map(exam => exam.category)))];
  const levels = ["all", ...Array.from(new Set(exams.map(exam => exam.level)))];
  
  const filteredExams = exams.filter(exam => {
    const categoryMatch = selectedCategory === "all" || exam.category === selectedCategory;
    const levelMatch = selectedLevel === "all" || exam.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Indian Competitive Exams Information</h1>
          <p className="text-xl opacity-90">
            Comprehensive guide to national and Karnataka state examinations
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-700">Filter by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl text-right font-semibold mb-2 text-gray-700">Filter by Level</h2>
              <div className="flex flex-wrap gap-2 justify-end">
                {levels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedLevel === level
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-green-50"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">
              Showing {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''}
              {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
              {selectedLevel !== 'all' ? ` at ${selectedLevel} level` : ''}
            </p>
          </div>
        </div>

        {/* Exam Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExams.map(exam => (
              <div key={exam.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{exam.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-1">
                        {exam.category}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {exam.level}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Conducting Body:</h4>
                      <p className="text-gray-600">{exam.conductingBody}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Eligibility:</h4>
                      <p className="text-gray-600">{exam.eligibility}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Frequency:</h4>
                      <p className="text-gray-600">{exam.examFrequency}</p>
                    </div>
                    
                    {exam.importantDates && (
                      <div>
                        <h4 className="font-semibold text-gray-700">Important Dates:</h4>
                        <p className="text-gray-600">{exam.importantDates}</p>
                      </div>
                    )}
                  </div>
                  
                  <a
                    href={exam.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Official Website
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white p-6 text-center">
          <p>© {new Date().getFullYear()} Indian Exams Information Portal</p>
          <p className="text-gray-400 mt-2">Information is subject to change. Please check official websites for latest updates.</p>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;