// components/teacher-sidebar.tsx
"use client";

import type { FC } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  ClipboardList,
  BarChart3,
  BookOpen,
  CheckSquare,
  Clock,
  StickyNote,
  Calculator,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeacherSidebarProps {
  userProfile?: any;
}

interface AppItem {
  name: string;
  icon: any;
  path: string;
  color: string;
}

const TeacherApps: AppItem[] = [
  { name: "Class Manager", icon: Users, path: "/teacher/class-manager", color: "bg-blue-500" },
  { name: "Timetable", icon: Calendar, path: "/teacher/timetable", color: "bg-teal-500" },
  { name: "Lesson Planner", icon: BookOpen, path: "/teacher/lesson-planner", color: "bg-green-500" },
  { name: "Notes", icon: StickyNote, path: "/teacher/notes", color: "bg-yellow-500" },
  { name: "Calculator", icon: Calculator, path: "/teacher/calculator", color: "bg-purple-500" },
  { name: "Attendance", icon: CheckSquare, path: "/teacher/attendance", color: "bg-red-500" },
  { name: "Progress Tracker", icon: BarChart3, path: "/teacher/progress", color: "bg-indigo-500" },
  { name: "Wellness", icon: Heart, path: "/teacher/wellness", color: "bg-cyan-500" }
];

export const TeacherSidebar: FC<TeacherSidebarProps> = () => (
  <div className="space-y-4 p-3 h-full overflow-y-auto">
    <div className="text-center mb-4">
      <h2 className="text-lg font-bold text-gray-800">Teacher's Tools 👩‍🏫</h2>
    </div>

    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Teacher Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {TeacherApps.map((app) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.name}
                href={app.path}
                className="flex flex-col items-center p-3 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full ${app.color} flex items-center justify-center mb-2`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center">{app.name}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  </div>
);


export default TeacherSidebar;
