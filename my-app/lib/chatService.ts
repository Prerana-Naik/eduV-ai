import { supabase } from "@/lib/supabaseClient";

// THREADS
export async function createThread(userEmail: string, title?: string) {
  const { data, error } = await supabase
    .from("threads")
    .insert([{ user_email: userEmail, title }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getThreads(userEmail: string) {
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// MESSAGES
export async function saveMessage(threadId: string, userEmail: string, content: string) {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ thread_id: threadId, user_email: userEmail, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessages(threadId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
