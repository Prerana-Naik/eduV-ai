// components/creative-sidebar.tsx
"use client";

import type { FC } from "react";
import Link from "next/link";
import {
  Calculator,
  Clock,
  StickyNote,
  CheckSquare,
  Code as Function,
  Book,
  QrCode,
  Ruler,
  Hash,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreativeSidebarProps {
  userProfile?: any;
}

interface AppItem {
  name: string;
  icon: any; // lucide-react icon component
  path: string;
  color: string;
}

const CreativeApps: AppItem[] = [
  { name: "Calculator", icon: Calculator, path: "/apps/calculator", color: "bg-blue-500" },
  { name: "Timer", icon: Clock, path: "/apps/timer", color: "bg-orange-500" },
  { name: "Notes", icon: StickyNote, path: "/apps/notes", color: "bg-yellow-500" },
  { name: "Todo", icon: CheckSquare, path: "/apps/todo", color: "bg-green-500" },
  { name: "Quick Math Formula", icon: Function, path: "/apps/math-formula", color: "bg-purple-500" },
  { name: "Exam Map", icon: Book, path: "/apps/exam-map", color: "bg-red-500" },
  { name: "QRGenerator", icon: QrCode, path: "/apps/qr-generator", color: "bg-indigo-500" },
  { name: "UnitConverter", icon: Ruler, path: "/apps/unit-converter", color: "bg-teal-500" },
  { name: "PasswordGen", icon: Hash, path: "/apps/password-gen", color: "bg-pink-500" },
  { name: "Wellness", icon: Heart, path: "/apps/wellness", color: "bg-cyan-500" }
];

export const CreativeSidebar: FC<CreativeSidebarProps> = () => (
  <div className="space-y-4 p-3 h-full overflow-y-auto">
    <div className="text-center mb-4">
      <h2 className="text-lg font-bold text-gray-800">Creative Tools 🎨</h2>
      <p className="text-sm text-gray-600">Offline apps ready to use!</p>
    </div>

    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Available Apps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {CreativeApps.map((app) => {
            const Icon = app.icon; // Proper dynamic rendering
            return (
              <Link
                key={app.name}
                href={app.path}
                className="flex flex-col items-center p-3 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full ${app.color} flex items-center justify-center mb-2`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium">{app.name}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default CreativeSidebar;
