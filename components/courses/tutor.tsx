"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, User, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const AcademicTutor = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error("Erreur serveur");

      // Si ton API renvoie du JSON, on récupère le texte ici
      const data = await response.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.text }]);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[400px] w-full max-w-3xl mx-auto border rounded-xl bg-background shadow-sm overflow-hidden mb-6">
      <div className="p-4 border-b bg-slate-50 flex items-center gap-x-2">
        <Bot className="w-5 h-5 text-sky-600" />
        <h3 className="font-semibold text-sm">Assistant TankAcademy</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-x-3 ${m.role === 'user' ? "flex-row-reverse" : ""}`}>
            <div className={`p-2 rounded ${m.role === 'user' ? "bg-sky-600 text-white" : "bg-slate-200"}`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className="prose prose-sm p-3 bg-slate-100 rounded">
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && <Loader2 className="animate-spin text-sky-600" />}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2 text-sm"
          placeholder="Posez votre question..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} className="bg-sky-600 text-white px-4 py-2 rounded">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};