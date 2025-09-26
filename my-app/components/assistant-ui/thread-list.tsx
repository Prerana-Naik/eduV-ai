// components/assistant-ui/thread-list.tsx - Enhanced with message counts
import type { FC } from "react";
import { useState, useEffect } from "react";
import { ArchiveIcon, PlusIcon, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

interface Thread {
  id: string;
  title: string;
  type: 'student' | 'teacher';
  messageCount: number; // ✅ Real message count
  createdAt: string;
  updatedAt: string;
  lastMessage?: string; // ✅ Preview of last message
}

const ThreadAvatar = ({ type }: { type: string }) => (
  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs text-white">
    {type === "teacher" ? "👩‍🏫" : "📚"}
  </div>
);

interface ThreadListProps {
  currentThreadId?: string | null;
  onSelectThread?: (threadId: string) => void;
  onNewThread?: () => void;
  userMode?: 'student' | 'teacher';
  userEmail?: string;
}

export const ThreadList: FC<ThreadListProps> = ({
  currentThreadId,
  onSelectThread,
  onNewThread,
  userMode = 'student',
  userEmail = 'guest@example.com'
}) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    loadThreadsFromStorage();
  }, [userEmail]);

  // ✅ Load threads and update message counts
  const loadThreadsFromStorage = () => {
    try {
      const saved = localStorage.getItem(`threads_${userEmail}`);
      if (saved) {
        const parsedThreads: Thread[] = JSON.parse(saved);
        
        // ✅ Update message counts for each thread
        const updatedThreads = parsedThreads.map(thread => {
          const threadMessagesKey = `thread_messages_${thread.id}`;
          const messages = JSON.parse(localStorage.getItem(threadMessagesKey) || '[]');
          const lastMessage = messages.length > 0 ? messages[messages.length - 1]?.content?.substring(0, 50) + '...' : '';
          
          return {
            ...thread,
            messageCount: messages.length,
            lastMessage
          };
        });
        
        setThreads(updatedThreads);
        console.log(`✅ Loaded ${updatedThreads.length} threads with message counts`);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

  const saveThreadsToStorage = (updatedThreads: Thread[]) => {
    try {
      localStorage.setItem(`threads_${userEmail}`, JSON.stringify(updatedThreads));
    } catch (error) {
      console.error('Error saving threads:', error);
    }
  };

  const handleNewThread = () => {
    const newThreadId = `thread_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const newThread: Thread = {
      id: newThreadId,
      title: 'New Chat',
      type: userMode,
      messageCount: 0, // ✅ Start with 0 messages
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // ✅ Initialize empty messages for new thread
    const threadMessagesKey = `thread_messages_${newThreadId}`;
    localStorage.setItem(threadMessagesKey, JSON.stringify([]));

    const updatedThreads = [newThread, ...threads];
    setThreads(updatedThreads);
    saveThreadsToStorage(updatedThreads);
    onSelectThread?.(newThread.id);
    onNewThread?.();
    
    console.log(`✅ Created NEW empty thread: ${newThreadId}`);
  };

  const handleArchiveThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // ✅ Delete thread messages from localStorage
    const threadMessagesKey = `thread_messages_${threadId}`;
    localStorage.removeItem(threadMessagesKey);
    
    const updatedThreads = threads.filter(t => t.id !== threadId);
    setThreads(updatedThreads);
    saveThreadsToStorage(updatedThreads);
    
    if (currentThreadId === threadId) {
      setTimeout(() => handleNewThread(), 100);
    }
    
    console.log(`✅ Archived thread and deleted messages: ${threadId}`);
  };

  // ✅ Refresh threads when switching (to update message counts)
  useEffect(() => {
    const interval = setInterval(() => {
      loadThreadsFromStorage();
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <Button
        onClick={handleNewThread}
        className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
        size="sm"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        New Chat
      </Button>

      <SidebarMenu>
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Click "New Chat" to start</p>
          </div>
        ) : (
          threads.map(thread => (
            <SidebarMenuItem key={thread.id}>
              <div
                className={`group relative flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all hover:bg-sidebar-accent ${
                  currentThreadId === thread.id 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-blue-500' 
                    : ''
                }`}
                onClick={() => onSelectThread?.(thread.id)}
              >
                <ThreadAvatar type={thread.type} />
                
                <div className="flex-1 overflow-hidden">
                  <span className="truncate text-sm font-medium">
                    {thread.messageCount > 0 ? `Chat ${thread.id.slice(-4)}` : 'New Chat'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(thread.updatedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={thread.messageCount > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      {thread.messageCount} msgs
                    </span>
                  </div>
                  {/* ✅ Show last message preview */}
                  {thread.lastMessage && (
                    <div className="text-xs text-muted-foreground/70 truncate mt-1">
                      {thread.lastMessage}
                    </div>
                  )}
                </div>
                
                <div
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                  onClick={(e) => handleArchiveThread(thread.id, e)}
                  title="Archive thread"
                >
                  <ArchiveIcon className="h-3 w-3" />
                </div>
              </div>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </div>
  );
};

export default ThreadList;
