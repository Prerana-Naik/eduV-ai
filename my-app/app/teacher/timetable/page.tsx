"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Calendar,
  Clock,
  Users,
  Save,
  Plus,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Grid,
  Bell
} from "lucide-react";

// Import UI components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ClassItem {
  id: string;
  class_name: string;
  grade: string;
  academic_year: string;
  subject?: string | null;
}

interface TimetableEntry {
  id?: string;
  class_id: string;
  subject: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  teacher_id: string;
  room_number?: string;
  is_recurring: boolean;
  created_at?: string;
}

interface TimetableDay {
  day: string;
  dayIndex: number;
  entries: TimetableEntry[];
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// Toast component
interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Helper function to convert time string to minutes
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to format minutes to time string
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export default function TimetablePage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [newEntry, setNewEntry] = useState<TimetableEntry>({
    class_id: "",
    subject: "",
    day_of_week: 1, // Monday
    start_time: "08:00",
    end_time: "09:00",
    teacher_id: "",
    room_number: "",
    is_recurring: true
  });

  // Generate time slots based on the timetable entries with 1-hour intervals
  const timeSlots = useMemo(() => {
    // Default time slots (8 AM to 5 PM)
    const defaultSlots = [
      "08:00", "09:00", "10:00", "11:00", "12:00", 
      "13:00", "14:00", "15:00", "16:00", "17:00"
    ];
    
    if (timetable.length === 0) {
      return defaultSlots;
    }

    // Get all start and end times from timetable
    const allTimes = timetable.flatMap(entry => [entry.start_time, entry.end_time]);
    
    // Convert to minutes and find min and max
    const timeInMinutes = allTimes.map(timeToMinutes);
    const minTime = Math.min(...timeInMinutes);
    const maxTime = Math.max(...timeInMinutes);
    
    // Generate time slots with 1-hour intervals covering the range
    const slots: string[] = [];
    let currentTime = Math.floor(minTime / 60) * 60; // Round down to nearest hour
    const endTime = Math.ceil(maxTime / 60) * 60; // Round up to nearest hour
    
    // Ensure we have at least the default range
    const startHour = Math.min(currentTime, 8 * 60);
    const finalEndTime = Math.max(endTime, 17 * 60);
    
    currentTime = startHour;
    
    while (currentTime <= finalEndTime) {
      slots.push(minutesToTime(currentTime));
      currentTime += 60;
    }
    
    return slots;
  }, [timetable]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchUserAndClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId && user) {
      fetchTimetable(selectedClassId);
      setNewEntry(prev => ({
        ...prev,
        class_id: selectedClassId,
        teacher_id: user.id
      }));
    }
  }, [selectedClassId, user]);

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

  const fetchTimetable = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from("timetable_entries")
        .select(`id, class_id, subject, day_of_week, start_time, end_time, teacher_id, room_number, is_recurring, created_at`)
        .eq("class_id", classId)
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setTimetable(data || []);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      showToast("Failed to load timetable", "error");
    }
  };

  const saveTimetableEntry = async () => {
    if (!selectedClassId || !user) return;
    
    setSaving(true);
    try {
      if (editingEntry?.id) {
        // Update existing entry
        const { error } = await supabase
          .from("timetable_entries")
          .update(newEntry)
          .eq("id", editingEntry.id);

        if (error) throw error;
        showToast("Timetable entry updated successfully");
      } else {
        // Create new entry
        const { error } = await supabase
          .from("timetable_entries")
          .insert([newEntry]);

        if (error) throw error;
        showToast("Timetable entry created successfully");
      }

      // Refresh timetable
      fetchTimetable(selectedClassId);
      
      // Reset form
      setNewEntry({
        class_id: selectedClassId,
        subject: "",
        day_of_week: 1,
        start_time: "08:00",
        end_time: "09:00",
        teacher_id: user.id,
        room_number: "",
        is_recurring: true
      });
      setShowEntryForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error("Error saving timetable entry:", error);
      showToast("Failed to save timetable entry", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteTimetableEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this timetable entry?")) return;
    
    try {
      const { error } = await supabase
        .from("timetable_entries")
        .delete()
        .eq("id", entryId);

      if (error) throw error;

      setTimetable(timetable.filter(entry => entry.id !== entryId));
      showToast("Timetable entry deleted successfully");
    } catch (error) {
      console.error("Error deleting timetable entry:", error);
      showToast("Failed to delete timetable entry", "error");
    }
  };

  const editTimetableEntry = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setNewEntry(entry);
    setShowEntryForm(true);
  };

  const getEntriesForDay = (dayIndex: number) => {
    return timetable.filter(entry => entry.day_of_week === dayIndex);
  };

  const getClassById = (classId: string) => {
    return classes.find(c => c.id === classId);
  };

  const groupTimetableByDay = (): TimetableDay[] => {
    return daysOfWeek.map((day, index) => ({
      day,
      dayIndex: index,
      entries: getEntriesForDay(index)
    }));
  };

  // Check if a time slot is occupied by an entry
  const isTimeSlotOccupied = (dayIndex: number, timeSlot: string) => {
    const timeMinutes = timeToMinutes(timeSlot);
    return timetable.some(entry => 
      entry.day_of_week === dayIndex && 
      timeToMinutes(entry.start_time) <= timeMinutes && 
      timeToMinutes(entry.end_time) > timeMinutes
    );
  };

  // Get the entry for a specific time slot
  const getEntryForTimeSlot = (dayIndex: number, timeSlot: string) => {
    const timeMinutes = timeToMinutes(timeSlot);
    return timetable.find(entry => 
      entry.day_of_week === dayIndex && 
      timeToMinutes(entry.start_time) <= timeMinutes && 
      timeToMinutes(entry.end_time) > timeMinutes
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-amber-800">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Authentication Required</h2>
          <p className="text-amber-800">Please log in to access the timetable tool.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-xl mr-4">
              <Grid className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-amber-900">Timetable Manager</h1>
          </div>
          <Button 
            onClick={() => setShowEntryForm(true)} 
            className="bg-amber-600 hover:bg-amber-700 text-white"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" /> New Entry
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="lg:col-span-1 bg-amber-50 border-amber-200">
            <CardHeader className="bg-amber-100 rounded-t-lg">
              <CardTitle className="text-amber-900">Class Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">Select Class</label>
                <div className="relative">
                  <select
                    className="w-full h-12 pl-4 pr-10 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-100 appearance-none bg-white text-amber-900"
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
                  <ChevronLeft className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
                </div>
              </div>
              
              {selectedClassId && (
                <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2">Class Info</h3>
                  <p className="text-sm text-amber-800">
                    {getClassById(selectedClassId)?.class_name} - {getClassById(selectedClassId)?.grade}
                  </p>
                  <p className="text-sm text-amber-800">
                    Subject: {getClassById(selectedClassId)?.subject || "Not specified"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-amber-50 border-amber-200">
            <CardHeader className="bg-amber-100 rounded-t-lg">
              <CardTitle className="text-amber-900">Weekly Timetable</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!selectedClassId ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                  <p className="text-amber-600">Please select a class to view and manage its timetable</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-8 min-w-[800px]">
                    {/* Time column */}
                    <div className="p-3 bg-amber-100 font-semibold text-amber-900 border-r border-amber-200">Time</div>
                    
                    {/* Day headers */}
                    {daysOfWeek.map((day, index) => (
                      <div key={`header-${index}`} className="p-3 bg-amber-100 font-semibold text-amber-900 text-center border-r border-amber-200">
                        {day.slice(0, 3)}
                      </div>
                    ))}

                    {/* Time slots */}
                    {timeSlots.map((time, timeIndex) => (
                      <div key={`timeslot-${timeIndex}`} className="contents">
                        <div className="p-3 bg-amber-50 text-sm text-amber-800 border-r border-b border-amber-200">
                          {time}
                        </div>
                        {daysOfWeek.map((day, dayIndex) => {
                          const entry = getEntryForTimeSlot(dayIndex, time);
                          
                          return (
                            <div
                              key={`cell-${dayIndex}-${timeIndex}`}
                              className="p-1 border-r border-b border-amber-200 bg-white min-h-[60px]"
                            >
                              {entry && (
                                <div
                                  key={entry.id || `entry-${dayIndex}-${timeIndex}`}
                                  className="p-2 bg-amber-100 rounded border border-amber-200 text-xs cursor-pointer hover:bg-amber-200 group relative"
                                  onClick={() => editTimetableEntry(entry)}
                                >
                                  <div className="font-medium text-amber-900">{entry.subject}</div>
                                  <div className="text-amber-700">{entry.start_time} - {entry.end_time}</div>
                                  {entry.room_number && (
                                    <div className="text-amber-600">Room: {entry.room_number}</div>
                                  )}
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (entry.id) deleteTimetableEntry(entry.id);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timetable Entry Form Modal */}
        {showEntryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-amber-200">
              <div className="flex items-center justify-between p-6 border-b border-amber-200 bg-amber-50 rounded-t-xl">
                <h2 className="text-xl font-bold text-amber-900">
                  {editingEntry ? "Edit Timetable Entry" : "New Timetable Entry"}
                </h2>
                <button onClick={() => { setShowEntryForm(false); setEditingEntry(null); }} className="text-amber-500 hover:text-amber-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">Day of Week</label>
                  <select
                    className="w-full h-12 pl-4 pr-10 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-amber-900"
                    value={newEntry.day_of_week}
                    onChange={(e) => setNewEntry({...newEntry, day_of_week: parseInt(e.target.value)})}
                    required
                  >
                    {daysOfWeek.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={newEntry.start_time}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEntry({...newEntry, start_time: e.target.value})}
                      className="border-amber-200 focus:border-amber-500 text-amber-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">End Time</label>
                    <Input
                      type="time"
                      value={newEntry.end_time}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEntry({...newEntry, end_time: e.target.value})}
                      className="border-amber-200 focus:border-amber-500 text-amber-900"
                      required
                    />
                  </div>
                </div>

                <Input
                  placeholder="Subject"
                  value={newEntry.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEntry({...newEntry, subject: e.target.value})}
                  className="border-amber-200 focus:border-amber-500 text-amber-900"
                  required
                />

                <Input
                  placeholder="Room Number (Optional)"
                  value={newEntry.room_number || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEntry({...newEntry, room_number: e.target.value})}
                  className="border-amber-200 focus:border-amber-500 text-amber-900"
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_recurring"
                    checked={newEntry.is_recurring}
                    onChange={(e) => setNewEntry({...newEntry, is_recurring: e.target.checked})}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                  />
                  <label htmlFor="is_recurring" className="ml-2 block text-sm text-amber-800">
                    Recurring weekly
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={saveTimetableEntry} 
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingEntry ? "Update Entry" : "Create Entry"}
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => { setShowEntryForm(false); setEditingEntry(null); }} 
                    variant="outline" 
                    className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
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