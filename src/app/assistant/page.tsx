"use client";

import * as React from "react";
import { Send, Bot, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SectionHeader } from "@/components/app/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFarmerProfile } from "@/lib/useFarmerProfile";
import { getDashboardStats } from "@/lib/advisoryEngine";
import { getAssistantReply } from "@/lib/assistantEngine";

type ChatMsg = { id: string; role: "user" | "assistant"; text: string };

const SAMPLE_QUESTIONS = [
  "What should I sow in April?",
  "Should I sell cotton now?",
  "Is rain going to affect my crop?",
];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function AssistantPage() {
  const { profile, isLoaded } = useFarmerProfile();
  const stats = React.useMemo(() => getDashboardStats(profile), [profile]);

  const [messages, setMessages] = React.useState<ChatMsg[]>([
    {
      id: uid(),
      role: "assistant",
      text:
        "Hi farmer. I’m your FasalNirnay AI assistant.\n\nTell me what you need help with—what to sow, when to sell, or how to reduce risk with weather alerts.",
    },
  ]);

  const [input, setInput] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q) return;

    setInput("");
    setMessages((prev) => [...prev, { id: uid(), role: "user", text: q }]);
    setIsThinking(true);

    // Mock “AI” computation delay for a believable feel.
    await new Promise((r) => setTimeout(r, 450));

    const reply = getAssistantReply(q, profile, stats);
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "assistant",
        text: reply.text,
      },
    ]);

    setIsThinking(false);
  };

  return (
    <AppShell subtitle={`AI Assistant • ${profile.location}`}>
      <div className="space-y-5">
        <SectionHeader
          title="AI Assistant"
          subtitle="Chat-style advice using mock crop + mandi + weather logic."
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="subtle">
            <span className="inline-flex items-center gap-2">
              <Bot size={14} />
              Prototype chat
            </span>
          </Badge>
          <Badge variant="outline">No authentication</Badge>
          <Badge variant="outline">Mock data only</Badge>
        </div>

        {!isLoaded ? (
          <Skeleton className="h-24" />
        ) : null}

        <Card className="rounded-3xl border-emerald-100 bg-white/80 p-4">
          <div className="space-y-4">
            <div className="max-h-[52vh] overflow-auto pr-2">
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={[
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "max-w-[88%] rounded-3xl border px-4 py-3 whitespace-pre-wrap text-sm",
                        m.role === "user"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white/70 text-emerald-950/85 border-emerald-100",
                      ].join(" ")}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {isThinking ? (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-3xl bg-white/70 border border-emerald-100 px-4 py-3 text-sm text-emerald-950/70">
                      <span className="inline-flex items-center gap-2">
                        <Sparkles size={16} className="text-emerald-700" />
                        Thinking...
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                {SAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={isThinking}
                    className="rounded-2xl border border-emerald-100 bg-white/70 text-emerald-950/85 text-xs font-extrabold py-2 px-3 hover:bg-white transition-colors disabled:opacity-60"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sowing, selling, or weather risk..."
                className="bg-white/60"
                aria-label="Chat input"
              />

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-emerald-950/55">
                  Example: “Should I sell cotton now?”
                </p>
                <Button
                  onClick={() => send(input)}
                  disabled={isThinking || !input.trim()}
                  className="rounded-2xl"
                >
                  <span className="inline-flex items-center gap-2">
                    <Send size={18} />
                    Send
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

