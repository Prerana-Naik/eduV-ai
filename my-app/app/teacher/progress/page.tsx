"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Users,
  Save,
  Calendar,
  BookOpen,
  GraduationCap,
  CheckCircle,
  XCircle,
  Check,
  X,
  Filter,
  Loader2,
  AlertCircle,
  ChevronDown,
  Plus,
  Trash2,
  Calculator,
  BarChart3,
  Edit3,
} from "lucide-react";

interface ClassItem {
  id: string;
  class_name: string;
  grade: string;
  academic_year: string;
  subject?: string | null;
}

interface Student {
  id: string;
  full_name: string;
  roll_number: string;
  usn: string;
  parent_mobile: string;
  email?: string | null;
  class_id: string;
}

interface AssessmentColumn {
  id: string;
  name: string;
  max_marks: number;
  weightage: number;
  class_id: string;
  semester: string;
  created_at: string;
}

interface StudentMarks {
  student_id: string;
  marks: Record<string, number>; // assessment_id -> marks
  total?: number;
  percentage?: number;
}

const Toast = ({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
      type === "success" 
        ? "bg-green-100 text-green-800 border border-green-200" 
        : "bg-red-100 text-red-800 border border-red-200"
    }`}>
      {type === "success" ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const Button = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  type = "button",
  isLoading = false,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "success" | "danger";
  size?: "default" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  [key: string]: any;
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 bg-white",
    ghost: "text-gray-700 hover:bg-gray-100 bg-transparent",
    success: "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl",
  };
  const sizes: Record<string, string> = {
    default: "h-11 py-2 px-6",
    sm: "h-9 px-4 text-xs",
    lg: "h-12 px-8 text-base",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled || isLoading} type={type} {...props}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      {children}
    </button>
  );
};

const Input = ({
  placeholder,
  value,
  onChange,
  className = "",
  icon: Icon,
  error = false,
  type = "text",
  required = false,
  ...props
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: boolean;
  type?: string;
  required?: boolean;
  [key: string]: any;
}) => {
  const baseStyles = `flex h-12 w-full rounded-lg border-2 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
    Icon ? "pl-12" : ""
  } ${
    error ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  }`;

  return (
    <div className={`relative ${className}`}>
      {Icon && <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Icon className="h-5 w-5 text-gray-400" /></div>}
      <input className={baseStyles} placeholder={placeholder} value={value} onChange={onChange} type={type} required={required} {...props} />
    </div>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-2 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-2xl font-bold text-gray-800 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export default function ProgressTrackerPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assessmentColumns, setAssessmentColumns] = useState<AssessmentColumn[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSemester, setSelectedSemester] = useState<string>("Semester 1");
  const [studentMarks, setStudentMarks] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [newAssessment, setNewAssessment] = useState({ name: "", max_marks: 100, weightage: 100 });
  const [showAddAssessment, setShowAddAssessment] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchUserAndClasses();
  }, []);

  useEffect(() => {
  if (selectedClassId) {
    const loadDataSequentially = async () => {
      setLoading(true);
      try {
        console.log("🔄 Starting data loading sequence...");
        
        // 1. First load students
        await fetchStudents(selectedClassId);
        console.log("✅ Students loaded");
        
        // 2. Then load assessment columns  
        await fetchAssessmentColumns(selectedClassId, selectedSemester);
        console.log("✅ Assessment columns loaded");
        
        // 3. Finally load marks (after students and assessments are loaded)
        await fetchMarks(selectedClassId, selectedSemester);
        console.log("✅ Marks loaded");
        
      } catch (error) {
        console.error("❌ Error in loading sequence:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDataSequentially();
  }
}, [selectedClassId, selectedSemester]);

  const fetchUserAndClasses = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("classes")
        .select(`id, class_name, grade, academic_year, subject`)
        .eq("teacher_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      showToast("Failed to load classes", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId: string) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select(`id, full_name, roll_number, usn, parent_mobile, email, class_id`)
      .eq("class_id", classId)
      .order("roll_number", { ascending: true });

    if (error) throw error;
    
    console.log("✅ Fetched students:", data?.length);
    setStudents(data || []);
    
    // Reset marks when students change
    setStudentMarks({});
  } catch (error) {
    console.error("Error fetching students:", error);
    showToast("Failed to load students", "error");
  }
};

const fetchAssessmentColumns = async (classId: string, semester: string) => {
  try {
    const { data, error } = await supabase
      .from("assessment_columns")
      .select(`id, name, max_marks, weightage, class_id, semester, created_at`)
      .eq("class_id", classId)
      .eq("semester", semester)
      .order("created_at", { ascending: true });

    if (error) throw error;
    
    console.log("✅ Fetched assessment columns:", data?.length);
    setAssessmentColumns(data || []);
  } catch (error) {
    console.error("Error fetching assessment columns:", error);
    showToast("Failed to load assessment columns", "error");
  }
};

 const fetchMarks = async (classId: string, semester: string) => {
  try {
    console.log("📊 FETCHING MARKS for class:", classId, "semester:", semester);
    
    // Check if we have the necessary data first
    if (students.length === 0 || assessmentColumns.length === 0) {
      console.log("⏳ Waiting for students and assessments to load first...");
      return;
    }

    const { data, error } = await supabase
      .from("marks")
      .select(`id, student_id, assessment_id, marks, semester`)
      .eq("class_id", classId)
      .eq("semester", semester);

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log("✅ Raw marks data from database:", data);

    // Create a new marks object instead of mutating the existing one
    const newMarksData: Record<string, Record<string, number>> = {};
    
    // Initialize with empty values for all students and assessments
    students.forEach(student => {
      newMarksData[student.id] = {};
      assessmentColumns.forEach(assessment => {
        // Set default value to 0 or existing value if any
        newMarksData[student.id][assessment.id] = 0;
      });
    });

    // Override with actual data from database
    (data || []).forEach(record => {
      if (record.student_id && record.assessment_id) {
        if (!newMarksData[record.student_id]) {
          newMarksData[record.student_id] = {};
        }
        newMarksData[record.student_id][record.assessment_id] = record.marks;
        console.log("🔢 Setting marks for student:", record.student_id, 
                   "assessment:", record.assessment_id, 
                   "marks:", record.marks);
      }
    });
    
    console.log("🎯 Final marks data to set:", newMarksData);
    setStudentMarks(newMarksData);
  } catch (error) {
    console.error("❌ Error fetching marks:", error);
    showToast("Failed to load marks", "error");
  }
};

  const handleMarksChange = (studentId: string, assessmentId: string, marks: number) => {
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [assessmentId]: marks
      }
    }));
  };

  const addAssessmentColumn = async () => {
    if (!selectedClassId || !user) return;
    
    try {
      const { data, error } = await supabase
        .from("assessment_columns")
        .insert([{ 
          ...newAssessment, 
          class_id: selectedClassId,
          semester: selectedSemester,
          teacher_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;

      setAssessmentColumns([...assessmentColumns, data]);
      setNewAssessment({ name: "", max_marks: 100, weightage: 100 });
      setShowAddAssessment(false);
      showToast("Assessment column added successfully");
    } catch (error) {
      console.error("Error adding assessment column:", error);
      showToast("Failed to add assessment column", "error");
    }
  };

  const deleteAssessmentColumn = async (assessmentId: string) => {
    if (!confirm("Are you sure you want to delete this assessment column? All marks for this assessment will also be deleted.")) return;
    
    try {
      // First delete all marks for this assessment
      const { error: marksError } = await supabase
        .from("marks")
        .delete()
        .eq("assessment_id", assessmentId);

      if (marksError) throw marksError;

      // Then delete the assessment column
      const { error } = await supabase
        .from("assessment_columns")
        .delete()
        .eq("id", assessmentId);

      if (error) throw error;

      setAssessmentColumns(assessmentColumns.filter(a => a.id !== assessmentId));
      showToast("Assessment column deleted successfully");
    } catch (error) {
      console.error("Error deleting assessment column:", error);
      showToast("Failed to delete assessment column", "error");
    }
  };

  const saveMarks = async () => {
    if (!selectedClassId || !user) return;
    
    setSaving(true);
    try {
      // Prepare marks records for upsert
      const marksRecords: any[] = [];
      
      Object.entries(studentMarks).forEach(([student_id, assessmentMarks]) => {
        Object.entries(assessmentMarks).forEach(([assessment_id, marks]) => {
          if (marks !== undefined && marks !== null) {
            marksRecords.push({
              teacher_id: user.id,
              class_id: selectedClassId,
              student_id,
              assessment_id,
              marks,
              date: selectedDate,
              semester: selectedSemester
            });
          }
        });
      });

      // Upsert marks records
      const { error } = await supabase
        .from("marks")
        .upsert(marksRecords, { onConflict: 'student_id,assessment_id,semester' });

      if (error) throw error;

      showToast("Marks saved successfully");
    } catch (error) {
      console.error("Error saving marks:", error);
      showToast("Failed to save marks", "error");
    } finally {
      setSaving(false);
    }
  };

  const calculateTotalMarks = (studentId: string): number => {
    const studentMarksData = studentMarks[studentId];
    if (!studentMarksData) return 0;
    
    let total = 0;
    Object.entries(studentMarksData).forEach(([assessmentId, marks]) => {
      if (marks !== undefined && marks !== null) {
        total += marks;
      }
    });
    
    return total;
  };

  const calculatePercentage = (studentId: string): number => {
    const studentMarksData = studentMarks[studentId];
    if (!studentMarksData) return 0;
    
    let totalMarks = 0;
    let maxPossible = 0;
    
    Object.entries(studentMarksData).forEach(([assessmentId, marks]) => {
      const assessment = assessmentColumns.find(a => a.id === assessmentId);
      if (assessment && marks !== undefined && marks !== null) {
        totalMarks += marks;
        maxPossible += assessment.max_marks;
      }
    });
    
    return maxPossible > 0 ? parseFloat(((totalMarks / maxPossible) * 100).toFixed(2)) : 0;
  };

  // Add this debug function to test the data flow
const debugDataFlow = async () => {
  console.log("🔍 DEBUG DATA FLOW");
  console.log("Selected Class ID:", selectedClassId);
  console.log("Selected Semester:", selectedSemester);
  console.log("Assessment Columns:", assessmentColumns);
  console.log("Students:", students);
  console.log("Student Marks:", studentMarks);
  
  // Test direct database query
  if (selectedClassId) {
    const { data, error } = await supabase
      .from("marks")
      .select("*")
      .eq("class_id", selectedClassId)
      .eq("semester", selectedSemester)
      .limit(5);

    if (error) {
      console.error("❌ Direct query error:", error);
    } else {
      console.log("✅ Direct query result:", data);
    }
  }
};

// Call this when you need to debug
// debugDataFlow();

  const filteredStudents = students.filter(student =>
    `${student.full_name} ${student.roll_number} ${student.usn}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the progress tracker.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl mr-4">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Marksheet Manager</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Class & Semester Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-4 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                      <option value="">Choose a class</option>
                      {classes.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.class_name} - {classItem.grade} ({classItem.academic_year})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Semester</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-4 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3</option>
                      <option value="Semester 4">Semester 4</option>
                      <option value="Semester 5">Semester 5</option>
                      <option value="Semester 6">Semester 6</option>
                      <option value="Semester 7">Semester 7</option>
                      <option value="Semester 8">Semester 8</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    icon={Calendar}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Columns - {selectedSemester}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessmentColumns.map((assessment) => (
                  <div key={assessment.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{assessment.name}</div>
                      <div className="text-sm text-gray-600">Max: {assessment.max_marks} • Weight: {assessment.weightage}%</div>
                    </div>
                    <button 
                      onClick={() => deleteAssessmentColumn(assessment.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete assessment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {showAddAssessment ? (
                  <div className="p-3 bg-green-50 rounded-lg space-y-3">
                    <Input
                      placeholder="Assessment Name"
                      value={newAssessment.name}
                      onChange={(e) => setNewAssessment({...newAssessment, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Max Marks"
                        type="number"
                        value={newAssessment.max_marks.toString()}
                        onChange={(e) => setNewAssessment({...newAssessment, max_marks: parseInt(e.target.value) || 100})}
                        min="1"
                      />
                      <Input
                        placeholder="Weightage %"
                        type="number"
                        value={newAssessment.weightage.toString()}
                        onChange={(e) => setNewAssessment({...newAssessment, weightage: parseInt(e.target.value) || 100})}
                        min="1"
                        max="100"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addAssessmentColumn} size="sm" variant="success">
                        Add
                      </Button>
                      <Button onClick={() => setShowAddAssessment(false)} size="sm" variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setShowAddAssessment(true)} 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Assessment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedClassId && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Student Marks - {selectedSemester}</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Filter}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-500 mb-2">No students in this class</p>
                  <p className="text-gray-400">Add students to the class to track marks</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-500 mb-2">No students found</p>
                  <p className="text-gray-400">Try a different search term</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="p-4 text-left font-semibold text-gray-700">Roll No</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Student Name</th>
                        {assessmentColumns.map((assessment) => (
                          <th key={assessment.id} className="p-4 text-center font-semibold text-gray-700">
                            {assessment.name}
                            <div className="text-xs font-normal">({assessment.max_marks})</div>
                          </th>
                        ))}
                        <th className="p-4 text-center font-semibold text-gray-700">
                          Total
                        </th>
                        <th className="p-4 text-center font-semibold text-gray-700">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-blue-50">
                          <td className="p-4 text-gray-600 font-medium">{student.roll_number}</td>
                          <td className="p-4 text-gray-600 font-medium">{student.full_name}</td>
                          {assessmentColumns.map((assessment) => (
                            <td key={assessment.id} className="p-4">
                              <div className="flex justify-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={assessment.max_marks}
                                  className="w-20 p-2 border border-gray-300 rounded text-center"
                                  value={studentMarks[student.id]?.[assessment.id]?.toString() || ""}
                                  onChange={(e) => handleMarksChange(student.id, assessment.id, parseInt(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                            </td>
                          ))}
                          <td className="p-4 text-center font-bold text-blue-700">
                            {calculateTotalMarks(student.id)}
                          </td>
                          <td className="p-4 text-center font-bold text-green-700">
                            {calculatePercentage(student.id)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        

        {selectedClassId && students.length > 0 && assessmentColumns.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={saveMarks}
              size="lg"
              isLoading={saving}
            >
              <Save className="h-5 w-5 mr-2" /> Save Marks
            </Button>
          </div>
        )}
      </div>

      

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
  
}

