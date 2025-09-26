// app/api/chat/route.ts - Enhanced with thread isolation
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, role = "student", userProfile, threadId } = await req.json();
  
  console.log(`🚀 Chat API called for thread: ${threadId}`);
  console.log(`🚀 Received ${messages.length} messages`);
  
  // Create personalized system prompt
  let systemPrompt = "You are a helpful AI assistant.";
  if (userProfile) {
    const qualificationText = userProfile.qualification 
      ? `who holds a ${userProfile.qualification}`
      : '';
    
    systemPrompt = `You are an AI learning assistant helping ${userProfile.name}, a ${userProfile.age}-year-old ${userProfile.role} ${qualificationText} studying ${userProfile.subject}.

**User Background:**
- Name: ${userProfile.name}
- Role: ${userProfile.role} 
- Age: ${userProfile.age}
- Subject: ${userProfile.subject}
- Qualification: ${userProfile.qualification || 'Not specified'}
- Chat style preference: ${userProfile.chatStyle}

**Instructions:**
- Always address them by name (${userProfile.name})
- This is thread ${threadId} - treat this as a separate conversation
- Tailor responses to their ${userProfile.subject} background${userProfile.qualification ? ` and ${userProfile.qualification} knowledge` : ''}
- Use ${userProfile.chatStyle} communication style
- Consider their expertise level based on their ${userProfile.qualification ? userProfile.qualification + ' qualification' : 'role as a ' + userProfile.role}`;
  }

  const messagesWithSystem = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  // ✅ Save messages to thread-specific localStorage
  if (threadId && typeof window !== 'undefined') {
    try {
      // Save user message
      if (messages.length > 0) {
        const userMessage = messages[messages.length - 1];
        const threadMessagesKey = `thread_messages_${threadId}`;
        const existingMessages = JSON.parse(localStorage.getItem(threadMessagesKey) || '[]');
        
        // Add user message if it's new
        if (userMessage.role === 'user') {
          existingMessages.push({
            role: 'user',
            content: userMessage.content,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem(threadMessagesKey, JSON.stringify(existingMessages));
          console.log(`✅ Saved user message to thread ${threadId}`);
        }
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages: messagesWithSystem,
    onFinish: async (completion) => {
      // ✅ Save assistant response to thread-specific storage
      if (threadId && completion.text) {
        try {
          const threadMessagesKey = `thread_messages_${threadId}`;
          const existingMessages = JSON.parse(localStorage.getItem(threadMessagesKey) || '[]');
          
          existingMessages.push({
            role: 'assistant',
            content: completion.text,
            timestamp: new Date().toISOString()
          });
          
          localStorage.setItem(threadMessagesKey, JSON.stringify(existingMessages));
          console.log(`✅ Saved assistant response to thread ${threadId}`);
        } catch (error) {
          console.error('Error saving assistant response:', error);
        }
      }
    }
  });

  return result.toDataStreamResponse();
}