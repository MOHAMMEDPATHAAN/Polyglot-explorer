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
      { error: "Writing feedback isn't configured yet. Add ANTHROPIC_API_KEY in Vercel settings." },
      { status: 503 }
    );
  }

  const { text, prompt, mode } = await request.json();
  if (!text || typeof text !== "string" || text.length > 4000) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: `You are a writing coach inside a language-learning app, mode: ${mode ?? "general"}.
Give brief, encouraging feedback on grammar, clarity, and tone. Point out 2-4 specific issues with corrected examples, and end with one encouraging note. Keep it under 180 words.`,
      messages: [
        {
          role: "user",
          content: `Writing prompt: ${prompt ?? "(free write)"}\n\nLearner's text:\n${text}`,
        },
      ],
    });
    const feedback = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();
    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("Writing feedback error", err);
    return NextResponse.json({ error: "Feedback is unavailable right now." }, { status: 502 });
  }
}
