"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types/database";

const SUGGESTIONS = [
  "Explain the difference between ser and estar",
  "Give me 5 example sentences using 'gracias'",
  "Correct this sentence: 'I are go to store'",
  "Quiz me on basic greetings",
];

export function TutorChat({
  initialMessages,
  initialSessionId,
  modeContext,
  languageContext,
}: {
  initialMessages: ChatMessage[];
  initialSessionId: string | null;
  modeContext?: string;
  languageContext?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const userMsg: ChatMessage = {
      id: `tmp-${Date.now()}`,
      session_id: sessionId ?? "",
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId, modeContext, languageContext }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setSessionId(data.sessionId);
      setMessages((m) => [
        ...m,
        {
          id: `tmp-${Date.now()}-r`,
          session_id: data.sessionId,
          role: "assistant",
          content: data.reply,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function startVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice input isn't supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.start();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] lg:h-[calc(100vh-7rem)]">
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <Sparkles className="mx-auto text-accent" size={28} />
            <p className="text-muted text-sm max-w-sm mx-auto">
              Ask me to explain grammar, translate a phrase, correct a sentence, or quiz you.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-surface-line text-muted hover:border-accent/50 hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                m.role === "user" ? "bg-accent text-white" : "bg-surface border border-surface-line"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-surface-line rounded-2xl px-4 py-2.5 text-sm text-muted">
              Thinking…
            </div>
          </div>
        )}
        {error && <p className="text-center text-xs text-accent">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 mt-4 border border-surface-line bg-surface rounded-2xl px-2 py-2"
      >
        <button
          type="button"
          onClick={startVoiceInput}
          className={cn("p-2 rounded-full transition-colors", listening ? "text-accent" : "text-muted hover:text-foreground")}
          aria-label="Voice input"
        >
          <Mic size={18} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI tutor anything…"
          className="flex-1 bg-transparent text-sm outline-none px-1"
        />
        <Button type="submit" size="sm" disabled={!input.trim() || loading}>
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}
