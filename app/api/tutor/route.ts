import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "AI Tutor isn't configured yet. Add an ANTHROPIC_API_KEY environment variable in your Vercel project settings to enable it.",
      },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { message, sessionId, modeContext, languageContext } = body as {
    message: string;
    sessionId?: string;
    modeContext?: string;
    languageContext?: string;
  };

  if (!message || typeof message !== "string" || message.length > 4000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  // Create or reuse a chat session
  let activeSessionId = sessionId;
  if (!activeSessionId) {
    const { data: session } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        title: message.slice(0, 60),
        mode_context: modeContext ?? null,
        language_context: languageContext ?? null,
      })
      .select("id")
      .single();
    activeSessionId = session?.id;
  }

  if (!activeSessionId) {
    return NextResponse.json({ error: "Could not create chat session" }, { status: 500 });
  }

  // Load recent history for context
  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", activeSessionId)
    .order("created_at")
    .limit(20);

  await supabase.from("chat_messages").insert({
    session_id: activeSessionId,
    role: "user",
    content: message,
  });

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are the AI Tutor inside Polyglot Explorer, a language-learning app.
Current learning mode: ${modeContext ?? "general"}. Target language: ${languageContext ?? "not specified"}.
Help the learner with grammar explanations, example sentences, translations, gentle corrections, and exercises.
Keep replies concise and encouraging. Adapt vocabulary and tone to the mode (simpler and playful for "kids", formal and professional for "business", exam-focused for "exam_prep").
Never produce content unsuitable for the stated mode. If the mode is "kids", keep all content simple, wholesome, and age-appropriate, and avoid any mature themes.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: systemPrompt,
      messages: [
        ...(history ?? []).map((m) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        })),
        { role: "user", content: message },
      ],
    });

    const reply = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();

    await supabase.from("chat_messages").insert({
      session_id: activeSessionId,
      role: "assistant",
      content: reply,
    });
    await supabase
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", activeSessionId);

    return NextResponse.json({ reply, sessionId: activeSessionId });
  } catch (err) {
    console.error("AI Tutor error", err);
    return NextResponse.json({ error: "The AI Tutor is unavailable right now." }, { status: 502 });
  }
}
