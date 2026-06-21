"use client";

import { useState, useRef } from "react";
import { Mic, Square, Volume2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { similarityScore } from "@/lib/textSimilarity";
import { createClient } from "@/lib/supabase/client";
import type { VocabularyWord } from "@/lib/types/database";

export function SpeakingPractice({ words }: { words: VocabularyWord[] }) {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "saved" | "error">("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const word = words[index];

  function speakTarget() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(word.example_sentence || word.word));
    }
  }

  async function startRecording() {
    setTranscript("");
    setScore(null);
    setAudioUrl(null);
    setUploadState("idle");

    // Speech-to-text
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setTranscript(text);
        setScore(similarityScore(text, word.example_sentence || word.word));
      };
      recognition.start();
      recognitionRef.current = recognition;
    }

    // Audio capture for playback + optional storage upload
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        await uploadRecording(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      // Microphone permission denied or unavailable — speech recognition above
      // (if supported) still works independently in some browsers.
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setRecording(false);
  }

  async function uploadRecording(blob: Blob) {
    setUploadState("uploading");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const path = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage.from("user-recordings").upload(path, blob);
      if (uploadError) throw uploadError;
      await supabase.from("media_uploads").insert({
        user_id: user.id,
        file_name: path,
        file_type: "audio/webm",
        bucket: "user-recordings",
        storage_path: path,
        related_table: "vocabulary_words",
        related_id: word.id,
        size_bytes: blob.size,
      });
      setUploadState("saved");
    } catch {
      setUploadState("error");
    }
  }

  function nextWord() {
    setIndex((i) => (i + 1) % words.length);
    setTranscript("");
    setScore(null);
    setAudioUrl(null);
    setUploadState("idle");
  }

  if (!word) {
    return <Card className="text-center py-12 text-muted text-sm">No vocabulary available yet.</Card>;
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <Card className="text-center space-y-3 py-8">
        <span className="text-3xl">{(word as any).languages?.flag_emoji}</span>
        <p className="font-display text-3xl font-semibold">{word.word}</p>
        <p className="text-muted text-sm">{word.translation}</p>
        {word.example_sentence && (
          <p className="text-sm italic text-foreground/80">&ldquo;{word.example_sentence}&rdquo;</p>
        )}
        <button onClick={speakTarget} className="inline-flex items-center gap-1.5 text-accent text-sm hover:underline">
          <Volume2 size={16} /> Hear it
        </button>
      </Card>

      <div className="flex justify-center">
        {!recording ? (
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-[0_8px_24px_-8px_var(--accent)] hover:brightness-110 transition-all"
            aria-label="Start recording"
          >
            <Mic size={26} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center animate-pulse"
            aria-label="Stop recording"
          >
            <Square size={22} />
          </button>
        )}
      </div>
      <p className="text-center text-xs text-muted">
        {recording ? "Listening… speak the phrase above" : "Tap to record yourself saying the phrase"}
      </p>

      {transcript && (
        <Card className="space-y-2">
          <p className="text-xs text-muted">We heard:</p>
          <p className="text-sm">&ldquo;{transcript}&rdquo;</p>
          {score !== null && (
            <div>
              <div className="h-2 rounded-full bg-background overflow-hidden mt-2">
                <div
                  className="h-full rounded-full bg-teal transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-1">{score}% match</p>
            </div>
          )}
        </Card>
      )}

      {audioUrl && (
        <div className="space-y-1">
          <audio controls src={audioUrl} className="w-full" />
          <p className="text-[11px] text-muted text-center">
            {uploadState === "uploading" && "Saving recording…"}
            {uploadState === "saved" && "Saved to your recordings."}
            {uploadState === "error" && "Couldn't save recording, but you can still listen above."}
          </p>
        </div>
      )}

      <Button variant="secondary" className="w-full" onClick={nextWord}>
        <RefreshCw size={16} /> Next phrase
      </Button>
    </div>
  );
}
