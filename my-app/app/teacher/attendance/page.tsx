"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Users,
  Save,
  Calendar,
  // BookOpen,
  // GraduationCap,
  CheckCircle,
  XCircle,
  Check,
  X,
  Filter,
  Loader2,
  AlertCircle,
  ChevronDown,
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

interface AttendanceRecord {
  student_id: string;
  status: "present" | "absent";
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

export default function AttendancePage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [user, setUser] = useState<any>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchUserAndClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudents(selectedClassId);
      fetchAttendance(selectedClassId, selectedDate);
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedClassId, selectedDate]);

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
      setStudents(data || []);
      
      // Initialize all students as absent by default
      const initialAttendance: Record<string, "present" | "absent"> = {};
      (data || []).forEach(student => {
        initialAttendance[student.id] = "absent";
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
      showToast("Failed to load students", "error");
    }
  };

  const fetchAttendance = async (classId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select(`student_id, status`)
        .eq("class_id", classId)
        .eq("date", date);

      if (error) throw error;

      // Update attendance state with fetched data
      const attendanceData: Record<string, "present" | "absent"> = {};
      (data || []).forEach(record => {
        attendanceData[record.student_id] = record.status;
      });
      
      setAttendance(prev => ({ ...prev, ...attendanceData }));
    } catch (error) {
      console.error("Error fetching attendance:", error);
      showToast("Failed to load attendance records", "error");
    }
  };

  const handleAttendanceChange = (studentId: string, status: "present" | "absent") => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: "present" | "absent") => {
    const newAttendance: Record<string, "present" | "absent"> = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const saveAttendance = async () => {
    if (!selectedClassId || !user) return;
    
    setSaving(true);
    try {
      // Prepare attendance records for upsert
      const attendanceRecords = Object.entries(attendance).map(([student_id, status]) => ({
        teacher_id: user.id,
        class_id: selectedClassId,
        student_id,
        date: selectedDate,
        status,
      }));

      // Upsert attendance records
      const { error } = await supabase
        .from("attendance")
        .upsert(attendanceRecords, { onConflict: 'class_id,student_id,date' });

      if (error) throw error;

      showToast("Attendance saved successfully");
    } catch (error) {
      console.error("Error saving attendance:", error);
      showToast("Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student =>
    `${student.full_name} ${student.roll_number} ${student.usn}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = Object.values(attendance).filter(status => status === "present").length;
  const absentCount = Object.values(attendance).filter(status => status === "absent").length;

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
          <p className="text-gray-600">Please log in to access the attendance system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl mr-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Attendance Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Class & Date Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
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
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    <span className="text-lg font-semibold">Present</span>
                  </div>
                  <span className="text-2xl font-bold text-green-700">{presentCount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="h-6 w-6 text-red-600 mr-3" />
                    <span className="text-lg font-semibold">Absent</span>
                  </div>
                  <span className="text-2xl font-bold text-red-700">{absentCount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="text-lg font-semibold">Total</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">{students.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedClassId && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Student Attendance</CardTitle>
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
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => markAll("present")}
                    disabled={students.length === 0}
                  >
                    <Check className="h-4 w-4 mr-1" /> Mark All Present
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => markAll("absent")}
                    disabled={students.length === 0}
                  >
                    <X className="h-4 w-4 mr-1" /> Mark All Absent
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-500 mb-2">No students in this class</p>
                  <p className="text-gray-400">Add students to the class to take attendance</p>
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
                        <th className="p-4 text-left font-semibold text-gray-700">USN</th>
                        <th className="p-4 text-center font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-blue-50">
                          <td className="p-4 text-gray-600 font-medium">{student.roll_number}</td>
                          <td className="p-4 text-gray-600 font-medium">{student.full_name}</td>
                          <td className="p-4 text-gray-600">{student.usn}</td>
                          <td className="p-4">
                            <div className="flex justify-center">
                              <div className="flex gap-2">
                                <button
                                  className={`px-4 py-2 rounded-lg font-medium ${
                                    attendance[student.id] === "present"
                                      ? "bg-green-600 text-white"
                                      : "bg-green-100 text-green-800 hover:bg-green-200"
                                  }`}
                                  onClick={() => handleAttendanceChange(student.id, "present")}
                                >
                                  Present
                                </button>
                                <button
                                  className={`px-4 py-2 rounded-lg font-medium ${
                                    attendance[student.id] === "absent"
                                      ? "bg-red-600 text-white"
                                      : "bg-red-100 text-red-800 hover:bg-red-200"
                                  }`}
                                  onClick={() => handleAttendanceChange(student.id, "absent")}
                                >
                                  Absent
                                </button>
                              </div>
                            </div>
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

        {selectedClassId && students.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={saveAttendance}
              size="lg"
              isLoading={saving}
              disabled={saving || Object.keys(attendance).length === 0}
            >
              <Save className="h-5 w-5 mr-2" /> Save Attendance
            </Button>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}