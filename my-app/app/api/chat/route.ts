// app/api/chat/route.ts - FIXED CHAT STYLE
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "nodejs";
export const maxDuration = 30;

// Type definitions
type IncomingMessage = { role?: string; content?: string } | { type: "text"; text: string };
type CoreRole = "user" | "assistant" | "system";

interface UserProfile {
  name: string;
  age: number;
  role: "student" | "teacher";
  qualification?: string;
  subject: string;
  chatStyle?: string; // Make sure this matches your database field
}

export async function POST(req: Request) {
  const { messages, userProfile, threadId, userId }: { 
    messages: IncomingMessage[]; 
    userProfile?: UserProfile;
    threadId?: string;
    userId?: string;
  } = await req.json();

  // FIX: Ensure chatStyle has a proper default
  const userChatStyle = userProfile?.chatStyle || "wise"; // Default to "wise" if undefined
  
  console.log(`🚀 Divine Gurukula AI Activated`);
  console.log(`👤 ${userProfile?.role === 'teacher' ? 'Guru' : 'Shishya'}: ${userProfile?.name || 'Guest'}`);
  console.log(`📚 ${userProfile?.role === 'teacher' ? 'Teaching' : 'Studying'}: ${userProfile?.subject || 'General'}`);
  console.log(`🎨 Chat Style: ${userChatStyle}`);
  console.log(`🪶 Thread: ${threadId || 'New Journey'}`);

  // --- CHAT STYLE CONFIGURATIONS ---
  const chatStyleConfig = {
    simple: {
      instruction: "Use simple, clear language. Be warm and friendly. Keep explanations straightforward and easy to understand.",
      tone: "friendly and approachable",
      emoji: "🌟"
    },
    academic: {
      instruction: "Use precise, detailed language. Provide thorough explanations with proper terminology. Maintain professional clarity while being supportive.",
      tone: "knowledgeable and precise", 
      emoji: "📚"
    },
    conversational: {
      instruction: "Use natural, flowing conversation. Be relatable and engaging. Speak like a trusted friend who's also knowledgeable.",
      tone: "casual yet insightful",
      emoji: "💬"
    },
    wise: {
      instruction: "Use philosophical, heart-centered language. Share wisdom and life lessons. Speak with the patience of an ancient guru and warmth of a caring mentor.",
      tone: "profound and nurturing",
      emoji: ""
    }
  };

  // FIX: Get the actual style or default to "wise"
  const selectedStyle = chatStyleConfig[userChatStyle as keyof typeof chatStyleConfig] || chatStyleConfig.wise;

  // --- DIVINE GURUKULA SYSTEM PROMPT WITH CHAT STYLE ---
  let systemPrompt = `You are a wise Gurukula mentor, blending ancient wisdom with modern compassion. 
Speak with patience, kindness, and soulful encouragement.`;

  if (userProfile) {
    const qualificationText = userProfile.qualification ? `, holder of ${userProfile.qualification}` : '';
    
    // TEACHER-SPECIFIC STYLE ADJUSTMENTS
    let roleSpecificStyle = "";
    if (userProfile.role === "teacher") {
      // FOR TEACHERS: Make wise style more collegial, academic more practical
      if (userChatStyle === "wise") {
        roleSpecificStyle = "Share educational wisdom and teaching insights. Speak as a fellow educator who understands classroom challenges.";
      } else if (userChatStyle === "academic") {
        roleSpecificStyle = "Focus on practical pedagogical strategies and evidence-based teaching methods.";
      }
    }

    // ROLE-BASED GUIDANCE
    let roleWisdom = "";
    if (userProfile.role === "teacher") {
      roleWisdom = `You are speaking to ${userProfile.name}, an experienced educator. 
      - Speak as a COLLEGIAL MENTOR, not just an assistant
      - Offer pedagogical insights and classroom strategies  
      - Understand teaching pressures and provide supportive solutions
      - Share wisdom about nurturing young minds
      ${roleSpecificStyle}`;
    } else {
      roleWisdom = `You are guiding ${userProfile.name}, a dedicated student.
      - Be nurturing and patient with learning struggles
      - Celebrate small victories and progress moments
      - Help build confidence and resilience`;
    }

    // AGE-AWARE PHILOSOPHICAL GUIDANCE
    let ageWisdom = "";
    if (userProfile.age <= 15) {
      ageWisdom = "Share simple life lessons like gentle rain nourishing young plants 🌱. Use warm emojis and keep explanations clear and heart-centered.";
    } else if (userProfile.age <= 25) {
      ageWisdom = "Offer deeper reflections like a river finding its path 🏞️. Balance wisdom with practical guidance.";
    } else {
      ageWisdom = "Share mature philosophical insights like an ancient tree offering shade 🌳. Use metaphorical language that speaks to life experience.";
    }

    systemPrompt = `You are the divine Gurukula mentor for ${userProfile.name}, a ${userProfile.age}-year-old ${userProfile.role}${qualificationText} ${userProfile.role === 'teacher' ? 'shaping young minds in' : 'walking the path of'} ${userProfile.subject}.

##  YOUR SACRED ROLE:
${userProfile.role === 'teacher' 
  ? `You are a WISDOM COMPANION to fellow educator ${userProfile.name}. Support their noble work with insights and encouragement.` 
  : `You are a SOUL-GUIDE to shishya ${userProfile.name}. See them as a whole being - mind, heart, and spirit.`
}

## 💫 COMMUNICATION STYLE:
**Chat Style:** ${userChatStyle} ${selectedStyle.emoji}
**Instruction:** ${selectedStyle.instruction}
**Tone:** ${selectedStyle.tone}
${roleSpecificStyle ? `**Teacher Focus:** ${roleSpecificStyle}` : ''}

## 🎯 ROLE-SPECIFIC GUIDANCE:
${roleWisdom}

## 🌟 AGE-APPROPRIATE WISDOM:
${ageWisdom}

**Always address ${userProfile.name} with sacred respect and make them feel valued in their educational journey.**`;
  }

  // --- TYPE-SAFE MESSAGE CONVERSION ---
  const messagesWithSystem = [
    { role: "system" as CoreRole, content: systemPrompt },
    ...messages
      .map((msg: IncomingMessage) => {
        if ("content" in msg && msg.content) {
          return { 
            role: (msg.role === "assistant" ? "assistant" : "user") as CoreRole, 
            content: msg.content 
          };
        }
        if ("type" in msg && msg.type === "text" && msg.text) {
          return { 
            role: "user" as CoreRole, 
            content: msg.text 
          };
        }
        return null;
      })
      .filter(Boolean) as { role: CoreRole; content: string }[],
  ];

  console.log(`📝 Preparing ${messagesWithSystem.length} messages in ${userChatStyle} style`);

  // --- GRACEFUL MESSAGE PERSISTENCE (COMMENTED OUT FOR DEMO) ---
  console.log(`🔄 Message persistence temporarily disabled for demo`);

  // --- DIVINE STREAMING RESPONSE ---
  try {
    console.log(`🌊 Streaming ${userChatStyle} guidance for ${userProfile?.name || 'seeker'}...`);
    
    const result = streamText({
      model: google("gemini-2.0-flash"),
      messages: messagesWithSystem,
      temperature: userChatStyle === 'academic' ? 0.3 : 0.7,
    });

    return result.toDataStreamResponse();
    
  } catch (err) {
    console.error("❌ Divine channel interrupted:", err);
    return new Response(
      JSON.stringify({ 
        error: "The wisdom stream is temporarily unavailable",
        message: "Even the greatest gurus sometimes sit in silence. Please try again soon. 🕉️"
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
