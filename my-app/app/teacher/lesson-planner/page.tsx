"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Calendar,
  BookOpen,
  Clock,
  // Users,
  Save,
  Plus,
  // Trash2,
  // Edit3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

interface ClassItem {
  id: string;
  class_name: string;
  grade: string;
  academic_year: string;
  subject?: string | null;
}

interface LessonPlan {
  id?: string;
  title: string;
  description: string;
  subject: string;
  date: string;
  start_time: string;
  end_time: string;
  class_id: string;
  teacher_id: string;
  materials?: string;
  objectives?: string;
  created_at?: string;
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

const TextArea = ({
  placeholder,
  value,
  onChange,
  className = "",
  error = false,
  required = false,
  rows = 3,
  ...props
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  error?: boolean;
  required?: boolean;
  rows?: number;
  [key: string]: any;
}) => {
  const baseStyles = `flex w-full rounded-lg border-2 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
    error ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  }`;

  return (
    <textarea 
      className={`${baseStyles} ${className}`} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      required={required} 
      rows={rows}
      {...props} 
    />
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

export default function LessonPlannerPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonPlan | null>(null);
  const [newLesson, setNewLesson] = useState<LessonPlan>({
    title: "",
    description: "",
    subject: "",
    date: new Date().toISOString().split('T')[0],
    start_time: "09:00",
    end_time: "10:00",
    class_id: "",
    teacher_id: "",
    materials: "",
    objectives: ""
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  // Generate week dates
  const generateWeekDates = (date: Date) => {
    const dates = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(currentDate);
    }
    
    return dates;
  };

  useEffect(() => {
    fetchUserAndClasses();
    setCurrentWeek(generateWeekDates(new Date()));
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchLessonPlans(selectedClassId);
    } else {
      setLessonPlans([]);
    }
  }, [selectedClassId, selectedDate]);

  useEffect(() => {
    if (user && selectedClassId) {
      setNewLesson(prev => ({
        ...prev,
        class_id: selectedClassId,
        teacher_id: user.id,
        date: selectedDate
      }));
    }
  }, [user, selectedClassId, selectedDate]);

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

  const fetchLessonPlans = async (classId: string) => {
  try {
    const { data, error } = await supabase
      .from("lesson_plans")
      .select(`id, title, description, subject, date, start_time, end_time, class_id, materials, objectives, created_at, teacher_id`) // Add teacher_id here
      .eq("class_id", classId)
      .gte("date", currentWeek[0].toISOString().split('T')[0])
      .lte("date", currentWeek[6].toISOString().split('T')[0])
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    setLessonPlans(data || []);
  } catch (error) {
    console.error("Error fetching lesson plans:", error);
    showToast("Failed to load lesson plans", "error");
  }
};

  const saveLessonPlan = async () => {
    if (!selectedClassId || !user) return;
    
    setSaving(true);
    try {
      if (editingLesson?.id) {
        // Update existing lesson
        const { error } = await supabase
          .from("lesson_plans")
          .update(newLesson)
          .eq("id", editingLesson.id);

        if (error) throw error;
        showToast("Lesson plan updated successfully");
      } else {
        // Create new lesson
        const { error } = await supabase
          .from("lesson_plans")
          .insert([newLesson]);

        if (error) throw error;
        showToast("Lesson plan created successfully");
      }

      // Refresh lesson plans
      fetchLessonPlans(selectedClassId);
      
      // Reset form
      setNewLesson({
        title: "",
        description: "",
        subject: "",
        date: selectedDate,
        start_time: "09:00",
        end_time: "10:00",
        class_id: selectedClassId,
        teacher_id: user.id,
        materials: "",
        objectives: ""
      });
      setShowLessonForm(false);
      setEditingLesson(null);
    } catch (error) {
      console.error("Error saving lesson plan:", error);
      showToast("Failed to save lesson plan", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteLessonPlan = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson plan?")) return;
    
    try {
      const { error } = await supabase
        .from("lesson_plans")
        .delete()
        .eq("id", lessonId);

      if (error) throw error;

      setLessonPlans(lessonPlans.filter(lesson => lesson.id !== lessonId));
      showToast("Lesson plan deleted successfully");
    } catch (error) {
      console.error("Error deleting lesson plan:", error);
      showToast("Failed to delete lesson plan", "error");
    }
  };

  const editLessonPlan = (lesson: LessonPlan) => {
    setEditingLesson(lesson);
    setNewLesson(lesson);
    setShowLessonForm(true);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(generateWeekDates(newDate));
  };

  const getLessonsForDate = (date: string) => {
    return lessonPlans.filter(lesson => lesson.date === date);
  };

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
          <p className="text-gray-600">Please log in to access the lesson planner.</p>
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
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Lesson Planner</h1>
          </div>
          <Button onClick={() => setShowLessonForm(true)} variant="success" size="lg">
            <Plus className="h-5 w-5 mr-2" /> New Lesson
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Class Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <ChevronLeft className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selected Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  icon={Calendar}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                    <ChevronLeft className="h-4 w-4" /> Previous Week
                  </Button>
                  <span className="text-lg font-semibold text-gray-700">
                    {currentWeek[0].toLocaleDateString()} - {currentWeek[6].toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                    Next Week <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4 mb-4">
                {currentWeek.map((date, index) => (
                  <div key={index} className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-sm">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-4">
                {currentWeek.map((date, index) => {
                  const dateString = date.toISOString().split('T')[0];
                  const dailyLessons = getLessonsForDate(dateString);
                  
                  return (
                    <div key={index} className="min-h-40 p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      {dailyLessons.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No lessons planned</p>
                      ) : (
                        dailyLessons.map((lesson) => (
                          <div key={lesson.id} className="p-2 mb-2 bg-green-50 rounded border border-green-100">
                            <div className="font-medium text-sm text-green-800">{lesson.title}</div>
                            <div className="text-xs text-green-600">
                              {lesson.start_time} - {lesson.end_time}
                            </div>
                            <div className="text-xs text-green-700">{lesson.subject}</div>
                            <div className="flex gap-1 mt-2">
                              <button 
                                onClick={() => editLessonPlan(lesson)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteLessonPlan(lesson.id!)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Plan Form Modal */}
        {showLessonForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingLesson ? "Edit Lesson Plan" : "Create New Lesson Plan"}
                </h2>
                <button onClick={() => { setShowLessonForm(false); setEditingLesson(null); }} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <Input
                  placeholder="Lesson Title"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                  icon={BookOpen}
                  required
                />
                <Input
                  placeholder="Subject"
                  value={newLesson.subject}
                  onChange={(e) => setNewLesson({...newLesson, subject: e.target.value})}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={newLesson.date}
                    onChange={(e) => setNewLesson({...newLesson, date: e.target.value})}
                    icon={Calendar}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="time"
                      value={newLesson.start_time}
                      onChange={(e) => setNewLesson({...newLesson, start_time: e.target.value})}
                      icon={Clock}
                      required
                    />
                    <Input
                      type="time"
                      value={newLesson.end_time}
                      onChange={(e) => setNewLesson({...newLesson, end_time: e.target.value})}
                      icon={Clock}
                      required
                    />
                  </div>
                </div>
                <TextArea
                  placeholder="Lesson Description"
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                  rows={3}
                />
                <TextArea
                  placeholder="Learning Objectives"
                  value={newLesson.objectives || ""}
                  onChange={(e) => setNewLesson({...newLesson, objectives: e.target.value})}
                  rows={2}
                />
                <TextArea
                  placeholder="Materials Needed"
                  value={newLesson.materials || ""}
                  onChange={(e) => setNewLesson({...newLesson, materials: e.target.value})}
                  rows={2}
                />
                <div className="flex gap-3 pt-4">
                  <Button onClick={saveLessonPlan} variant="success" className="flex-1" isLoading={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingLesson ? "Update Lesson" : "Create Lesson"}
                  </Button>
                  <Button onClick={() => { setShowLessonForm(false); setEditingLesson(null); }} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}