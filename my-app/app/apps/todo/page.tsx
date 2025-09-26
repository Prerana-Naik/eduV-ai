"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low" | "Completed";
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

export default function HorizontalTodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
        return;
      }
      setUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  // Load tasks
  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const addTask = async () => {
    const title = newTaskTitle.trim();
    if (title === "" || !userId) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ 
          user_id: userId, 
          title,
          priority: newTaskPriority,
          due_date: newTaskDueDate || null
        }])
        .select()
        .single();

      if (error) throw error;
      setTasks([data, ...tasks]);
      setNewTaskTitle("");
      setNewTaskDueDate("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id: string) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      const updatedCompleted = !taskToUpdate.completed;
      const updatedPriority = updatedCompleted ? "Completed" : "Medium";
      
      const { error } = await supabase
        .from("tasks")
        .update({ 
          completed: updatedCompleted,
          priority: updatedPriority
        })
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
      
      setTasks(tasks.map(task =>
        task.id === id
          ? {
              ...task,
              completed: updatedCompleted,
              priority: updatedPriority
            }
          : task
      ));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle Enter key in input
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "High": return "before:bg-rose-500 text-rose-700";
      case "Medium": return "before:bg-amber-500 text-amber-700";
      case "Low": return "before:bg-emerald-500 text-emerald-700";
      case "Completed": return "before:bg-indigo-500 text-indigo-700";
      default: return "before:bg-gray-500 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-800">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Task Board
            </h1>
            <div className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-lg font-medium">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>

          {/* Add Task Form */}
          <div className="bg-indigo-50 p-5 rounded-xl mb-8">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Add New Task</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Task title..."
                className="flex-grow px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={onKeyDown}
              />

              <select 
                className="px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as "High" | "Medium" | "Low")}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <input
                type="date"
                className="px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />

              <button
                onClick={addTask}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Task
              </button>
            </div>
          </div>

          {/* Task Board */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full py-12 text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xl">No tasks yet. Add your first task!</p>
                </div>
              ) : (
                tasks.map(({ id, title, priority, due_date, completed }) => (
                  <div
                    key={id}
                    className="w-80 flex-shrink-0 bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden transition-all hover:shadow-lg"
                  >
                    <div className={`p-1 bg-gradient-to-r ${
                      priority === "High" ? "from-rose-500 to-rose-400" :
                      priority === "Medium" ? "from-amber-500 to-amber-400" :
                      priority === "Low" ? "from-emerald-500 to-emerald-400" :
                      "from-indigo-500 to-indigo-400"
                    }`}></div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleComplete(id)}
                            className={`w-6 h-6 flex items-center justify-center rounded-full border-2 mr-3 transition ${
                              completed 
                                ? "bg-indigo-500 border-indigo-500 text-white" 
                                : "border-indigo-400"
                            }`}
                          >
                            {completed && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <span className={`relative text-sm font-medium pl-6 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:rounded-full ${getPriorityColor(priority)}`}>
                            {priority}{priority === "Completed" ? "" : " priority"}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this task?")) {
                              deleteTask(id);
                            }
                          }}
                          className="text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <h3
                        className={`font-semibold text-lg text-indigo-900 mb-2 ${
                          completed ? "line-through opacity-70" : ""
                        }`}
                      >
                        {title}
                      </h3>

                      {due_date && (
                        <div className="flex items-center text-sm text-indigo-600 mt-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Due: {new Date(due_date).toLocaleDateString()}
                        </div>
                      )}

                      <div className="mt-6 pt-4 border-t border-indigo-100 flex justify-between">
                        <span className={`text-sm ${completed ? "text-indigo-500" : "text-gray-500"}`}>
                          {completed ? "Completed" : "In progress"}
                        </span>
                        <span className="text-xs text-gray-400">#{id.substring(0, 6)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}