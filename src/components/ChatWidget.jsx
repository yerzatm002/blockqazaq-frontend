import { useRef, useState } from "react";
import { Bot, Loader2, Send, X } from "lucide-react";

import { askChatbot } from "../services/chatService";

export default function ChatWidget() {
  const messagesEndRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Сәлем! Мен блокчейн тақырыбын түсіндіруге көмектесемін.",
      source: "SYSTEM",
    },
  ]);

  async function sendMessage() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    const userMessage = {
      role: "user",
      text: trimmedQuestion,
      source: "USER",
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const result = await askChatbot(trimmedQuestion);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.answer,
          source: result.source,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Кешіріңіз, қазір AI қызметіне қосылу мүмкін болмады. Сұрағыңызды блокчейн, хэш, транзакция немесе смарт-келісімшарт тақырыбы бойынша қайта қойып көріңіз.",
          source: "LOCAL_ERROR",
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {open && (
        <div className="mb-4 w-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl md:w-[380px]">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold leading-5">AI көмекші</h3>
                <p className="text-xs text-slate-300">
                  Блокчейн бойынша оқу кеңесшісі
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-2 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-80 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}

            {loading && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  Жауап дайындалуда...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Сұрағыңызды жазыңыз..."
                rows={1}
                className="max-h-24 min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading || !question.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Жауаптар оқу мақсатына арналған. Қаржылық кеңес берілмейді.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:scale-105 hover:bg-emerald-700"
      >
        {open ? <X className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
      </button>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? "bg-emerald-600 text-white"
            : "bg-white text-slate-700"
        }`}
      >
        <p>{message.text}</p>

        {!isUser && message.source && message.source !== "SYSTEM" && (
          <p
            className={`mt-2 text-[11px] font-semibold ${
              message.source === "OPENROUTER"
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            Дереккөзі: {message.source}
          </p>
        )}
      </div>
    </div>
  );
}