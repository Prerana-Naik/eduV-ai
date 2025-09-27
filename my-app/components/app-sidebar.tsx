// components/app-sidebar.tsx
import { MessageSquare, Settings, User, GraduationCap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { CreativeSidebar } from "@/components/creative-sidebar";
import { TeacherSidebar } from "@/components/teacher-sidebar";

interface AppSidebarProps {
  currentConversationId?: string | null;
  onSelectConversation: (id: string, convMode: "student" | "teacher") => void;
  userMode: "student" | "teacher";
  onNewChat: () => void;
  userEmail?: string;
  userProfile?: any;
}

export function AppSidebar({
  currentConversationId,
  onSelectConversation,
  userMode,
  onNewChat,
  userEmail = 'guest@example.com',
  userProfile
}: AppSidebarProps) {
  // Determine which sidebar to show based on user role
  const isTeacher = userProfile?.role === 'teacher';
  
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EduVerse AI</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {isTeacher ? 'Teaching Platform' : 'Smart Learning Hub'}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ✅ Conditionally render sidebar based on user role */}
      <SidebarContent>
        {isTeacher ? (
          <TeacherSidebar userProfile={userProfile} />
        ) : (
          <CreativeSidebar userProfile={userProfile} />
        )}
      </SidebarContent>

      <SidebarSeparator />

      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="size-4" />
              <span className="capitalize">{userProfile?.role || userMode} Mode</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
