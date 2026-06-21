"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Sparkles } from "lucide-react";

const PROMPTS = [
  { id: "email", label: "Business email", prompt: "Write a short email asking a colleague to reschedule a meeting." },
  { id: "intro", label: "Self introduction", prompt: "Introduce yourself: name, where you're from, and one hobby." },
  { id: "story", label: "Mini story", prompt: "Write 3-4 sentences about your morning routine." },
  { id: "travel", label: "Travel request", prompt: "Politely ask a hotel receptionist for a late checkout." },
];

export function WritingPractice({ mode }: { mode?: string }) {
  const [promptId, setPromptId] = useState(PROMPTS[0].id);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePrompt = PROMPTS.find((p) => p.id === promptId)!;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function getFeedback() {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch("/api/writing-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, prompt: activePrompt.prompt, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setFeedback(data.feedback);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex gap-2 flex-wrap">
        {PROMPTS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPromptId(p.id);
              setFeedback(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              promptId === p.id
                ? "bg-accent text-white border-accent"
                : "border-surface-line text-muted hover:border-accent/50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Card>
        <p className="text-sm font-medium mb-3">{activePrompt.prompt}</p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Start writing here…"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted">{wordCount} words</span>
          <Button onClick={getFeedback} disabled={!text.trim() || loading} size="sm">
            <Sparkles size={14} /> {loading ? "Reviewing…" : "Get AI feedback"}
          </Button>
        </div>
      </Card>

      {error && <p className="text-sm text-accent">{error}</p>}
      {feedback && (
        <Card className="bg-teal/5 border-teal/30">
          <p className="text-xs uppercase tracking-wide text-teal font-medium mb-2">Feedback</p>
          <p className="text-sm whitespace-pre-wrap">{feedback}</p>
        </Card>
      )}
    </div>
  );
}
