// types/todo.ts
export interface Task {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low" | "Completed";
  dueDate?: string;
  completed: boolean;
  user_id: string;
  created_at?: string;
}

export interface DatabaseTask {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low" | "Completed";
  due_date?: string;
  completed: boolean;
  user_id: string;
  created_at?: string;
}