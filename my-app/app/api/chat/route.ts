// app/api/chat/route.ts - Enhanced with thread isolation
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userProfile, threadId } = await req.json(); // Completely remove 'role' from here
  
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

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages: messagesWithSystem,
  });

  return result.toDataStreamResponse();
}
