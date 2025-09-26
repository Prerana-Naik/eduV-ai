"use client";
import { useState, useEffect } from "react";
import type React from "react";
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  ArrowLeft,
  X,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Save,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  User,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface ClassItem {
  id: string;
  class_name: string;
  grade: string;
  academic_year: string;
  subject?: string | null;
  student_count?: number;
  created_at?: string;
  teacher_id?: string;
}

interface Student {
  id: string;
  full_name: string;
  roll_number: string;
  usn: string;
  parent_mobile: string;
  email?: string | null;
  class_id?: string;
  created_at?: string;
  class_name?: string;
}

type ViewType = "classes" | "add-class" | "view-class" | "table-view";

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

const Modal = ({ isOpen, onClose, children, title, isLoading = false }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; isLoading?: boolean }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0" disabled={isLoading}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default function ClassManager() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [view, setView] = useState<ViewType>("classes");
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);

  const [newClass, setNewClass] = useState({ class_name: "", grade: "", academic_year: "", subject: "" });
  const [newStudent, setNewStudent] = useState({ full_name: "", roll_number: "", usn: "", parent_mobile: "", email: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: "ascending" | "descending" } | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && (view === "view-class" || view === "table-view")) {
      fetchStudents(selectedClass.id);
    }
  }, [selectedClass, view]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user ?? null;
      if (!user) {
        setClasses([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("classes")
        .select(`id, class_name, grade, academic_year, subject, created_at, teacher_id`)
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const classesWithCounts = await Promise.all(
        (data || []).map(async (cls) => {
          const { count, error: countError } = await supabase
            .from("students")
            .select('*', { count: 'exact' })
            .eq('class_id', cls.id);
          
          if (countError) throw countError;
          return { ...cls, student_count: count || 0 };
        })
      );
      
      setClasses(classesWithCounts);
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
        .select(`*, classes(class_name)`)
        .eq("class_id", classId)
        .order("roll_number", { ascending: true });

      if (error) throw error;

      const studentsWithClass = (data || []).map(student => ({
        ...student,
        class_name: student.classes?.class_name || 'Unknown Class'
      }));
      
      setStudents(studentsWithClass);
    } catch (error) {
      console.error("Error fetching students:", error);
      showToast("Failed to load students", "error");
    }
  };

  const createClass = async () => {
    setOperationLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user ?? null;
      if (!user) {
        showToast("You must be logged in to create a class", "error");
        return;
      }

      const { data, error } = await supabase
        .from("classes")
        .insert([{ ...newClass, teacher_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const created = data as ClassItem;
      setClasses([{ ...created, student_count: 0 }, ...classes]);
      setNewClass({ class_name: "", grade: "", academic_year: "", subject: "" });
      setView("classes");
      showToast("Class created successfully");
    } catch (error) {
      console.error("Error creating class:", error);
      showToast("Failed to create class", "error");
    } finally {
      setOperationLoading(false);
    }
  };

  const updateClass = async () => {
    if (!editingClass) return;
    setOperationLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("classes")
        .update({
          class_name: editingClass.class_name,
          grade: editingClass.grade,
          academic_year: editingClass.academic_year,
          subject: editingClass.subject,
        })
        .eq("id", editingClass.id)
        .select()
        .single();

      if (error) throw error;

      setClasses(classes.map((cls) => (cls.id === editingClass.id ? data : cls)));
      if (selectedClass?.id === editingClass.id) setSelectedClass(data);
      setIsEditClassModalOpen(false);
      setEditingClass(null);
      showToast("Class updated successfully");
    } catch (error) {
      console.error("Error updating class:", error);
      showToast("Failed to update class", "error");
    } finally {
      setOperationLoading(false);
    }
  };

  const addStudent = async () => {
    if (!selectedClass) return;
    setOperationLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("students")
        .insert([{ ...newStudent, class_id: selectedClass.id }])
        .select(`*, classes(class_name)`)
        .single();

      if (error) throw error;

      const newStudentWithClass = {
        ...data,
        class_name: data.classes?.class_name || 'Unknown Class'
      };
      
      setStudents((prev) => [...prev, newStudentWithClass]);
      setNewStudent({ full_name: "", roll_number: "", usn: "", parent_mobile: "", email: "" });

      setClasses((prev) =>
        prev.map((cls) => (cls.id === selectedClass.id ? { ...cls, student_count: (cls.student_count || 0) + 1 } : cls))
      );
      
      showToast("Student added successfully");
    } catch (error) {
      console.error("Error adding student:", error);
      showToast("Failed to add student", "error");
    } finally {
      setOperationLoading(false);
    }
  };

 const updateStudent = async () => {
  if (!editingStudent) return;
  setOperationLoading(true);
  
  try {
    const { data, error } = await supabase
      .from("students")
      .update({
        full_name: editingStudent.full_name,
        roll_number: editingStudent.roll_number,
        usn: editingStudent.usn,
        parent_mobile: editingStudent.parent_mobile,
        email: editingStudent.email,
      })
      .eq("id", editingStudent.id)
      .select(`*, classes(class_name)`)
      .single();

    if (error) throw error;

    const updatedStudent = {
      ...data,
      class_name: data.classes?.class_name || 'Unknown Class'
    };
    
    setStudents((prev) => prev.map((s) => (s.id === editingStudent.id ? updatedStudent : s)));
    setIsEditStudentModalOpen(false);
    setEditingStudent(null);
    showToast("Student updated successfully");
  } catch (error) {
    console.error("Error updating student:", error);
    showToast("Failed to update student", "error");
  } finally {
    setOperationLoading(false);
  }
};

  const deleteClass = async (classId: string) => {
    if (!confirm("Are you sure you want to delete this class? This will also delete all students in this class.")) return;
    
    setOperationLoading(true);
    try {
      const { error: studentError } = await supabase
        .from("students")
        .delete()
        .eq("class_id", classId);

      if (studentError) throw studentError;

      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", classId);

      if (error) throw error;

      setClasses((prev) => prev.filter((c) => c.id !== classId));
      setStudents((prev) => prev.filter((student) => student.class_id !== classId));
      
      if (selectedClass?.id === classId) {
        setSelectedClass(null);
        setView("classes");
      }
      
      showToast("Class deleted successfully");
    } catch (error) {
      console.error("Error deleting class:", error);
      showToast("Failed to delete class", "error");
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    if (!selectedClass) return;
    
    setOperationLoading(true);
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId);

      if (error) throw error;

      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      setClasses((prev) =>
        prev.map((cls) => (cls.id === selectedClass.id ? { ...cls, student_count: Math.max(0, (cls.student_count || 0) - 1) } : cls))
      );
      
      showToast("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      showToast("Failed to delete student", "error");
    } finally {
      setOperationLoading(false);
    }
  };

  const openEditClass = (classItem: ClassItem) => {
    setEditingClass({ ...classItem });
    setIsEditClassModalOpen(true);
  };

const openEditStudent = (student: Student) => {
  if (operationLoading) {
    return;
  }
  setEditingStudent({ ...student });
  setIsEditStudentModalOpen(true);
};

  const requestSort = (key: keyof Student) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedStudents = () => {
    if (!sortConfig) return students;
    const sorted = [...students].sort((a, b) => {
      const aVal = (a[sortConfig.key] ?? "").toString().toLowerCase();
      const bVal = (b[sortConfig.key] ?? "").toString().toLowerCase();
      if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const filteredClasses = classes.filter((cls) =>
    `${cls.class_name} ${cls.grade} ${cls.academic_year}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = getSortedStudents().filter((student) =>
    `${student.full_name} ${student.roll_number} ${student.usn}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (view === "add-class") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-2xl">
          <Button variant="outline" onClick={() => setView("classes")} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Classes
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                Create New Class
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                placeholder="Class Name (e.g., Section A)"
                value={newClass.class_name}
                onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })}
                icon={BookOpen}
                required
              />
              <Input
                placeholder="Grade/Standard (e.g., Grade 5)"
                value={newClass.grade}
                onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                icon={GraduationCap}
                required
              />
              <Input
                placeholder="Academic Year (e.g., 2023-2024)"
                value={newClass.academic_year}
                onChange={(e) => setNewClass({ ...newClass, academic_year: e.target.value })}
                icon={Calendar}
                required
              />
              <Input 
                placeholder="Subject (Optional)" 
                value={newClass.subject} 
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })} 
                icon={BookOpen} 
              />
              <Button 
                onClick={createClass} 
                variant="success" 
                size="lg" 
                className="w-full"
                isLoading={operationLoading}
                disabled={!newClass.class_name || !newClass.grade || !newClass.academic_year}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Class
              </Button>
            </CardContent>
          </Card>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  if (view === "table-view" && selectedClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => {
                  setView("view-class");
                  setSearchTerm("");
                }}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Card View
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">
                {selectedClass.class_name} - {selectedClass.grade} - Students
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setView("view-class")}>
                <Grid3X3 className="h-4 w-4 mr-2" /> Card View
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setView("classes")} className="h-10 w-10 p-0">
                <X className="h-5 w-5" />
              </Button>
              
            </div>
          </div>
                
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input placeholder="Search students..." className="pl-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort("roll_number")}>
                      <div className="flex items-center">
                        Roll No
                        {sortConfig?.key === "roll_number" && (sortConfig.direction === "ascending" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort("full_name")}>
                      <div className="flex items-center">
                        Student Name
                        {sortConfig?.key === "full_name" && (sortConfig.direction === "ascending" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort("usn")}>
                      <div className="flex items-center">
                        USN
                        {sortConfig?.key === "usn" && (sortConfig.direction === "ascending" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort("parent_mobile")}>
                      <div className="flex items-center">
                        Parent Mobile
                        {sortConfig?.key === "parent_mobile" && (sortConfig.direction === "ascending" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort("email")}>
                      <div className="flex items-center">
                        Email
                        {sortConfig?.key === "email" && (sortConfig.direction === "ascending" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />)}
                      </div>
                    </th>
                    <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
               <tbody>
  {filteredStudents.length === 0 ? (
    <tr>
      <td colSpan={6} className="p-8 text-center text-gray-500">
        <div className="flex flex-col items-center">
          <Users className="h-12 w-12 text-gray-300 mb-2" />
          <p>No students found.</p>
        </div>
      </td>
    </tr>
  ) : (
    filteredStudents.map((student) => (
      <tr key={student.id} className="border-b border-gray-100 hover:bg-blue-50">
        <td className="p-4 text-gray-600 font-medium">{student.roll_number}</td>
        <td className="p-4 text-gray-600 font-medium">{student.full_name}</td>
        <td className="p-4 text-gray-600">{student.usn}</td>
        <td className="p-4 text-gray-600">{student.parent_mobile}</td>
        <td className="p-4 text-gray-600">{student.email || "-"}</td>
        <td className="p-4">
          <div className="flex gap-2 justify-center">
            <button 
              className="p-1.5 bg-blue-100 text-blue-700 rounded-md cursor-pointer hover:bg-blue-200 transition-colors"
              onClick={() => openEditStudent(student)}
              title="Edit student"
              disabled={operationLoading}
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button 
              className="p-1.5 bg-red-100 text-red-700 rounded-md cursor-pointer hover:bg-red-200 transition-colors"
              onClick={() => deleteStudent(student.id)}
              title="Delete student"
              disabled={operationLoading}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
          </Card>
        </div>
        {/* Edit Student Modal (available in table view) */}
        <Modal
          isOpen={isEditStudentModalOpen}
          onClose={() => {
            setIsEditStudentModalOpen(false);
            setEditingStudent(null);
          }}
          title="Edit Student"
          isLoading={operationLoading}
        >
          {editingStudent && (
            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={editingStudent.full_name}
                onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
                icon={User}
                required
              />
              <Input
                placeholder="Roll Number"
                value={editingStudent.roll_number}
                onChange={(e) => setEditingStudent({ ...editingStudent, roll_number: e.target.value })}
                required
              />
              <Input
                placeholder="USN"
                value={editingStudent.usn}
                onChange={(e) => setEditingStudent({ ...editingStudent, usn: e.target.value })}
              />
              <Input
                placeholder="Parent's Mobile"
                value={editingStudent.parent_mobile}
                onChange={(e) => setEditingStudent({ ...editingStudent, parent_mobile: e.target.value })}
                icon={Phone}
                required
              />
              <Input
                placeholder="Email (Optional)"
                value={editingStudent.email || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                icon={Mail}
              />
              <div className="flex gap-3 pt-4">
                <Button onClick={updateStudent} variant="success" className="flex-1" isLoading={operationLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={() => { setIsEditStudentModalOpen(false); setEditingStudent(null); }} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  if (view === "view-class" && selectedClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setView("classes");
                setSelectedClass(null);
                setSearchTerm("");
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Classes
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              {selectedClass.class_name} - {selectedClass.grade}
            </h1>
            <Button variant="outline" onClick={() => setView("table-view")}>
              <Grid3X3 className="h-4 w-4 mr-2" /> Table View
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-3 text-green-600" /> Add New Student
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  placeholder="Full Name" 
                  value={newStudent.full_name} 
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })} 
                  icon={User} 
                  required 
                />
                <Input 
                  placeholder="Roll Number" 
                  value={newStudent.roll_number} 
                  onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })} 
                  required 
                />
                <Input 
                  placeholder="USN (University Seat Number)" 
                  value={newStudent.usn} 
                  onChange={(e) => setNewStudent({ ...newStudent, usn: e.target.value })} 
                />
                <Input 
                  placeholder="Parent's Mobile Number" 
                  value={newStudent.parent_mobile} 
                  onChange={(e) => setNewStudent({ ...newStudent, parent_mobile: e.target.value })} 
                  icon={Phone} 
                  required 
                />
                <Input 
                  placeholder="Email (Optional)" 
                  value={newStudent.email} 
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} 
                  className="md:col-span-2" 
                  icon={Mail} 
                />
              </div>
              <Button 
                onClick={addStudent} 
                variant="success" 
                size="lg" 
                className="w-full"
                isLoading={operationLoading}
                disabled={!newStudent.full_name || !newStudent.roll_number || !newStudent.parent_mobile}
              >
                <Plus className="h-5 w-5 mr-2" /> Add Student
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-3 text-blue-600" /> Students ({students.length})
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-12 w-64" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-500 mb-2">No students added yet</p>
                  <p className="text-gray-400">Add your first student to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-gray-800">{student.full_name}</h3>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 h-8 w-8 p-0" 
                              onClick={() => openEditStudent(student)}
                              disabled={operationLoading}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 h-8 w-8 p-0" 
                              onClick={() => deleteStudent(student.id)}
                              disabled={operationLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-600 w-20">Roll No:</span>
                            <span className="text-gray-800">{student.roll_number}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-600 w-20">USN:</span>
                            <span className="text-gray-800">{student.usn}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-800">{student.parent_mobile}</span>
                          </div>
                          {student.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-800">{student.email}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Edit Student Modal (available in card view) */}
        <Modal
          isOpen={isEditStudentModalOpen}
          onClose={() => {
            setIsEditStudentModalOpen(false);
            setEditingStudent(null);
          }}
          title="Edit Student"
          isLoading={operationLoading}
        >
          {editingStudent && (
            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={editingStudent.full_name}
                onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
                icon={User}
                required
              />
              <Input
                placeholder="Roll Number"
                value={editingStudent.roll_number}
                onChange={(e) => setEditingStudent({ ...editingStudent, roll_number: e.target.value })}
                required
              />
              <Input
                placeholder="USN"
                value={editingStudent.usn}
                onChange={(e) => setEditingStudent({ ...editingStudent, usn: e.target.value })}
              />
              <Input
                placeholder="Parent's Mobile"
                value={editingStudent.parent_mobile}
                onChange={(e) => setEditingStudent({ ...editingStudent, parent_mobile: e.target.value })}
                icon={Phone}
                required
              />
              <Input
                placeholder="Email (Optional)"
                value={editingStudent.email || ""}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                icon={Mail}
              />
              <div className="flex gap-3 pt-4">
                <Button onClick={updateStudent} variant="success" className="flex-1" isLoading={operationLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={() => { setIsEditStudentModalOpen(false); setEditingStudent(null); }} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl mr-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Class Manager</h1>
          </div>
          <Button onClick={() => setView("add-class")} variant="success" size="lg">
            <Plus className="h-5 w-5 mr-2" /> New Class
          </Button>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search classes..." 
              className="pl-12" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-full mb-6">
                <Users className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No classes yet</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">Create your first class to start managing students and organizing your educational content</p>
              <Button onClick={() => setView("add-class")} variant="success" size="lg">
                <Plus className="h-5 w-5 mr-2" /> Create Your First Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-gray-800">{classItem.class_name}</CardTitle>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span className="text-sm">{classItem.grade} • {classItem.academic_year}</span>
                  </div>
                  {classItem.subject && (
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="text-sm">{classItem.subject}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-lg font-semibold text-gray-700">{classItem.student_count ?? 0} students</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClass(classItem);
                        setView("view-class");
                      }}
                      disabled={operationLoading}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditClass(classItem)}
                      disabled={operationLoading}
                    >
                      <Edit3 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700" 
                      onClick={() => deleteClass(classItem.id)}
                      disabled={operationLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Class Modal */}
      <Modal
        isOpen={isEditClassModalOpen}
        onClose={() => {
          setIsEditClassModalOpen(false);
          setEditingClass(null);
        }}
        title="Edit Class"
        isLoading={operationLoading}
      >
        {editingClass && (
          <div className="space-y-4">
            <Input 
              placeholder="Class Name" 
              value={editingClass.class_name} 
              onChange={(e) => setEditingClass({ ...editingClass, class_name: e.target.value })} 
              icon={BookOpen} 
              required 
            />
            <Input 
              placeholder="Grade/Standard" 
              value={editingClass.grade} 
              onChange={(e) => setEditingClass({ ...editingClass, grade: e.target.value })} 
              icon={GraduationCap} 
              required 
            />
            <Input 
              placeholder="Academic Year" 
              value={editingClass.academic_year} 
              onChange={(e) => setEditingClass({ ...editingClass, academic_year: e.target.value })} 
              icon={Calendar} 
              required 
            />
            <Input 
              placeholder="Subject (Optional)" 
              value={editingClass.subject || ""} 
              onChange={(e) => setEditingClass({ ...editingClass, subject: e.target.value })} 
              icon={BookOpen} 
            />
            <div className="flex gap-3 pt-4">
              <Button onClick={updateClass} variant="success" className="flex-1" isLoading={operationLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={() => { setIsEditClassModalOpen(false); setEditingClass(null); }} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Student Modal */}
{/* Edit Student Modal */}
        <Modal
  isOpen={isEditStudentModalOpen}
  onClose={() => {
    setIsEditStudentModalOpen(false);
    setEditingStudent(null);
  }}
  title="Edit Student"
  isLoading={operationLoading}
>
  {editingStudent && (
    <div className="space-y-4">
      <Input 
        placeholder="Full Name" 
        value={editingStudent.full_name} 
        onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })} 
        icon={User} 
        required 
      />
      <Input 
        placeholder="Roll Number" 
        value={editingStudent.roll_number} 
        onChange={(e) => setEditingStudent({ ...editingStudent, roll_number: e.target.value })} 
        required 
      />
      <Input 
        placeholder="USN" 
        value={editingStudent.usn} 
        onChange={(e) => setEditingStudent({ ...editingStudent, usn: e.target.value })} 
      />
      <Input 
        placeholder="Parent's Mobile" 
        value={editingStudent.parent_mobile} 
        onChange={(e) => setEditingStudent({ ...editingStudent, parent_mobile: e.target.value })} 
        icon={Phone} 
        required 
      />
      <Input 
        placeholder="Email (Optional)" 
        value={editingStudent.email || ""} 
        onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })} 
        icon={Mail} 
      />
      <div className="flex gap-3 pt-4">
        <Button onClick={updateStudent} variant="success" className="flex-1" isLoading={operationLoading}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button onClick={() => { setIsEditStudentModalOpen(false); setEditingStudent(null); }} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )}
</Modal>


      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}