"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, MessageSquare, X, ChevronRight, CornerDownLeft, Mic, MicOff } from "lucide-react";
import { navSections } from "@/lib/data";

type Message = {
  role: "user" | "assistant";
  content: string;
};

import { useUI } from "./UIContext";

export default function CommandCenter() {
  const { isCommandCenterOpen: isOpen, setCommandCenterOpen: setIsOpen } = useUI();
  const [mode, setMode] = useState<"command" | "agent">("command");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Eko initialized. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [showTip, setShowTip] = useState(false);
  const [platform, setPlatform] = useState<"mac" | "windows" | "mobile">("windows");

  const inputRefValue = useRef(input);
  const handleCommandRef = useRef<any>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Failed to fetch response");
      }

      // Handle streaming response manually since ai/react isn't working
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.substring(2));
                assistantContent += text;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last.role === "assistant") {
                    return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                  }
                  return prev;
                });
              } catch (e) { }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: `ERROR: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommand = async (cmd: string) => {
    const c = cmd.toLowerCase().trim();

    // System Commands
    if (c.startsWith("goto ")) {
      const target = c.replace("goto ", "");
      const section = navSections.find(s => s.label.toLowerCase() === target || s.id === target);
      if (section) {
        document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
        return;
      }
    }

    if (c === "chat" || c === "agent") {
      setMode("agent");
      setInput("");
      return;
    }

    if (c === "clear") {
      setMessages([{ role: "assistant", content: "History cleared. Eko ready." }]);
      setInput("");
      return;
    }

    if (c === "exit" || c === "quit") {
      setIsOpen(false);
      return;
    }

    // Default: Handle as conversation
    await sendMessage(cmd);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
    }
  };

  useEffect(() => {
    inputRefValue.current = input;
  }, [input]);

  useEffect(() => {
    handleCommandRef.current = handleCommand;
  }, [handleCommand]);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Changed to false for cleaner sessions
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Auto-submit if there's input
        if (inputRefValue.current.trim()) {
          handleCommandRef.current?.(inputRefValue.current);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        // Play small start sound
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
        audio.volume = 0.1;
        audio.play().catch(() => {});
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  useEffect(() => {
    const ua = typeof window !== "undefined" ? window.navigator.userAgent.toLowerCase() : "";
    const isMobile = ua.includes("iphone") || ua.includes("android") || ua.includes("ipad");
    setPlatform(isMobile ? "mobile" : ua.includes("mac") ? "mac" : "windows");

    const triggerTip = () => {
      if (sessionStorage.getItem("commandTipShown") || localStorage.getItem("commandCenterOpened")) return;
      
      console.log("Triggering Command Tip...");
      setShowTip(true);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.volume = 0.15;
      audio.play().catch(err => console.log("Audio play blocked:", err));
      
      sessionStorage.setItem("commandTipShown", "true");
      setTimeout(() => setShowTip(false), 5000);
    };

    if (isMobile) {
      // Auto-trigger on mobile/iPad after 12s
      const timer = setTimeout(triggerTip, 12000);
      return () => clearTimeout(timer);
    } else {
      // Desktop: wait for first click, then trigger after 6s
      const handleFirstClick = () => {
        setTimeout(triggerTip, 6000);
        window.removeEventListener("click", handleFirstClick);
      };
      window.addEventListener("click", handleFirstClick);
      return () => window.removeEventListener("click", handleFirstClick);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowTip(false);
      localStorage.setItem("commandCenterOpened", "true");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K / Ctrl+K toggle
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
        return;
      }

      // If Command Center is open, handle extra shortcuts
      if (isOpen) {
        if (e.key === "Escape") {
          setIsOpen(false);
          return;
        }

        // Global Enter submission
        if (e.key === "Enter" && !e.shiftKey) {
          if (input.trim()) {
            handleCommand(input);
            return;
          }
        }

        // Auto-focus input when starting to type
        if (
          inputRef.current &&
          document.activeElement !== inputRef.current &&
          e.key.length === 1 &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          inputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen, input]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setInput("");
      setMode("command");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const renderRawUrls = (text: string, keyPrefix: number) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlParts = text.split(urlRegex);

    return urlParts.map((part, i) => {
      if (part.match(urlRegex)) {
        // Handle trailing punctuation: . , ! ? ) ]
        const match = part.match(/^(https?:\/\/[^\s]+?)([.,!?\)\]]+)?$/);
        const cleanUrl = match ? match[1] : part;
        const trailing = match ? (match[2] || "") : "";

        return (
          <span key={`raw-${keyPrefix}-${i}`}>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-acid underline underline-offset-2 hover:text-acid/80 transition-colors break-all"
              data-cursor
              data-cursor-label="OPEN"
            >
              {cleanUrl}
            </a>
            {trailing}
          </span>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (content: string) => {
    // 1. First parse markdown links: [text](url)
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = content.split(mdLinkRegex);

    if (parts.length > 1) {
      const result: React.ReactNode[] = [];
      for (let i = 0; i < parts.length; i += 3) {
        // Text part (processed for raw URLs)
        result.push(<span key={`text-${i}`}>{renderRawUrls(parts[i], i)}</span>);

        // Link part
        if (i + 1 < parts.length) {
          result.push(
            <a
              key={`md-${i}`}
              href={parts[i + 2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-acid underline underline-offset-2 hover:text-acid/80 transition-colors break-all"
              data-cursor
              data-cursor-label="OPEN"
            >
              {parts[i + 1]}
            </a>
          );
        }
      }
      return result;
    }

    return renderRawUrls(content, 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center md:items-center bg-ink/95 backdrop-blur-md pt-[10vh] md:pt-0 p-[4vw] md:p-0"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-ink border border-paper/10 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-paper/10 bg-paper/5">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-sm ${mode === 'command' ? 'bg-acid/20 text-acid' : 'bg-paper/10 text-paper'}`}>
                  {mode === 'command' ? <Terminal size={14} /> : <MessageSquare size={14} />}
                </div>
                <span className="mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
                  {mode === 'command' ? 'System_Command_Center' : 'Eko_AI_Assistant'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-paper/40 hover:text-paper transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Area */}
            <div
              ref={scrollRef}
              className="h-[50vh] md:h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-hide bg-ink/20"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-sm mono text-[12px] leading-relaxed whitespace-pre-wrap ${m.role === 'user'
                      ? 'bg-paper/5 text-paper border border-paper/10'
                      : 'bg-acid/5 text-acid border border-acid/10'
                    }`}>
                    {m.role === 'assistant' && <span className="mr-2 opacity-50">🤖</span>}
                    {renderMessageContent(m.content)}
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1].role === 'user' && (
                <div className="flex justify-start">
                  <div className="bg-acid/5 text-acid border border-acid/10 p-3 rounded-sm mono text-[12px] animate-pulse">
                    Eko is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-paper/10 bg-paper/5">
              <div className="relative flex items-center">
                <div className="absolute left-3 text-paper/40">
                  <ChevronRight size={16} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  data-cursor
                  data-cursor-label="TYPE"
                  placeholder={mode === 'command' ? "Type a command (goto, chat, help)..." : "Ask Eko anything..."}
                  className="w-full bg-paper/5 border border-paper/10 pl-10 pr-12 py-3 mono text-[16px] md:text-[13px] text-paper outline-none focus:border-acid/40 transition-colors"
                />
                <div className="absolute right-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isListening 
                        ? 'bg-acid text-ink animate-pulse shadow-[0_0_15px_rgba(195,255,0,0.5)]' 
                        : 'text-paper/40 hover:text-acid hover:bg-paper/5'
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                  <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-sm bg-paper/5 border border-paper/10 text-[9px] mono text-paper/40">
                    <CornerDownLeft size={8} />
                    <span>ENTER</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer / Suggestions */}
            <div className="px-4 py-2 bg-ink border-t border-paper/5 flex items-center gap-4 overflow-x-auto no-scrollbar">
              <span className="mono text-[9px] text-paper/20 uppercase whitespace-nowrap">Quick_Jump:</span>
              {navSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleCommand(`goto ${s.id}`)}
                  className="mono text-[9px] text-paper/40 hover:text-acid transition-colors whitespace-nowrap"
                >
                  {s.label.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* CMD+K Tip Popup */}
      <AnimatePresence>
        {showTip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-8 right-8 z-[10001] px-6 py-4 bg-ink/90 border border-acid/30 backdrop-blur-md shadow-2xl flex items-center gap-6 group pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-acid/10 flex items-center justify-center text-acid animate-pulse">
                <Terminal size={16} />
              </div>
              <div className="flex flex-col">
                <span className="mono text-[10px] text-acid/60 tracking-[0.2em] uppercase mb-0.5">System_Alert</span>
                <span className="text-sm font-medium text-paper/90 tracking-tight">
                  {platform === "mobile" ? (
                    "Tap the terminal icon to access the AI Command Center"
                  ) : (
                    <>
                      Press <kbd className="px-2 py-0.5 rounded bg-paper/10 border border-paper/20 text-[11px] font-mono text-acid mx-1">{platform === "mac" ? "⌘" : "Ctrl"}</kbd> + <kbd className="px-2 py-0.5 rounded bg-paper/10 border border-paper/20 text-[11px] font-mono text-acid">K</kbd> to access the Command Center
                    </>
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="p-1 hover:text-acid text-paper/30 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="absolute -bottom-1 left-0 h-[2px] bg-acid animate-[scan_2s_ease-in-out_infinite]" style={{ width: '100%' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
