"use client";

import { useChat } from "@ai-sdk/react";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export const AcademicTutor = () => {
  const chatHelpers = useChat({
    api: "/api/chat",
  } as any) as any;

  const messages: any[] = chatHelpers.messages || [];
  const [localInput, setLocalInput] = useState("");

  const isCurrentlyLoading = 
    chatHelpers.isLoading === true || 
    chatHelpers.status === "streaming" || 
    chatHelpers.status === "submitted";

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!localInput.trim() || isCurrentlyLoading) return;

    const messageToSend = localInput;
    setLocalInput("");

    try {
      if (typeof chatHelpers.append === "function") {
        await chatHelpers.append({
          role: "user",
          content: messageToSend,
        });
      } else if (typeof chatHelpers.handleSubmit === "function") {
        chatHelpers.setInput?.(messageToSend);
        chatHelpers.handleSubmit(e);
      }
    } catch (error) {
      console.error("Erreur d'envoi:", error);
    }
  };

  return (
    /* 🛡️ FIX ABSOLU UX : Utilisation d'un viewport-based calc pour bloquer le composant dans l'écran */
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[400px] w-full max-w-3xl mx-auto border rounded-xl bg-background shadow-sm overflow-hidden mb-6">
      
      {/* Header */}
      <div className="p-4 border-b bg-slate-50 dark:bg-slate-900 flex items-center gap-x-2 shrink-0">
        <Bot className="w-5 h-5 text-sky-600" />
        <div>
          <h3 className="font-semibold text-sm">Assistant TankAcademy</h3>
          <p className="text-xs text-muted-foreground">Posez-moi toutes vos questions de cours ou d'exercices</p>
        </div>
      </div>

      {/* Zone des messages (Seule cette partie a le droit de scroller) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/10">
        {(!messages || messages.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <Bot className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-sm font-medium">Bonjour ! Qu'aimeriez-vous comprendre ou approfondir aujourd'hui ?</p>
          </div>
        )}

        {messages?.map((m: any, index: number) => {
          const isUser = m.role === "user";
          const messageContent = m.content || m.text || "";

          return (
            <div
              key={m.id || index}
              className={`flex gap-x-3 text-sm p-4 rounded-lg ${
                isUser
                  ? "bg-sky-50 dark:bg-sky-950/40 ml-12 flex-row-reverse"
                  : "bg-muted mr-12"
              }`}
            >
              <div className={`p-2 rounded-md h-fit shrink-0 ${isUser ? "bg-sky-600 text-white" : "bg-slate-200 dark:bg-slate-800"}`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex-1 pt-0.5 leading-relaxed overflow-hidden">
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 break-words">
                  <ReactMarkdown>{messageContent}</ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}
        
        {isCurrentlyLoading && messages && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-x-3 text-sm p-4 bg-muted mr-12 rounded-lg items-center text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>Grok réfléchit...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Formulaire d'envoi (Totalement sécurisé et ancré au-dessus du bas) */}
      <div className="p-4 border-t bg-background shrink-0">
        <form onSubmit={handleFormSubmit} className="flex gap-x-2 items-center">
          <input
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)} 
            placeholder="Ex: Explique-moi le théorème de Bayes ou corrige mon code..."
            className="flex-1 px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 bg-background border-slate-200 dark:border-slate-800"
            disabled={isCurrentlyLoading}
          />
          <button
            type="submit"
            disabled={!localInput.trim() || isCurrentlyLoading}
            className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg disabled:opacity-40 transition-all flex items-center justify-center shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};