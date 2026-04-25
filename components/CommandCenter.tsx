"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, MessageSquare, X, ChevronRight, CornerDownLeft } from "lucide-react";
import { navSections, owner, projects, blogPosts } from "@/lib/data";

type Message = {
  role: "user" | "agent";
  content: string;
};

export default function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"command" | "agent">("command");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "Agent Shivam initialized. How can I help you today?" }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setInput("");
      setMode("command");
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCommand = (cmd: string) => {
    const c = cmd.toLowerCase().trim();
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
      setMessages([{ role: "agent", content: "History cleared. Agent Shivam ready." }]);
      setInput("");
      return;
    }

    if (c === "exit" || c === "quit") {
      setIsOpen(false);
      return;
    }

    // Default to agent if in agent mode or command not recognized
    if (mode === "agent") {
      handleAgentChat(cmd);
    } else {
      setMessages(prev => [...prev, 
        { role: "user", content: cmd },
        { role: "agent", content: `Command '${cmd}' not recognized. Try 'goto [section]', 'chat', or 'clear'.` }
      ]);
      setInput("");
    }
  };

  const handleAgentChat = (query: string) => {
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setInput("");

    // Simulate AI response logic
    setTimeout(() => {
      let response = "I'm still learning about that. Try asking about Shivam's projects or tech stack.";
      const q = query.toLowerCase();

      if (q.includes("who") || q.includes("shivam")) {
        response = owner.bio;
      } else if (q.includes("project") || q.includes("work")) {
        response = `Shivam has built ${projects.length} major projects including ${projects.map(p => p.name).join(", ")}. Which one should I tell you about?`;
      } else if (q.includes("stack") || q.includes("tech")) {
        response = `The core stack is ${owner.roleLine}. He specializes in RAG pipelines, Web3, and full-stack development.`;
      } else if (q.includes("contact") || q.includes("email")) {
        response = `You can reach Shivam at ${owner.email} or find him on GitHub at ${owner.github}.`;
      }

      setMessages(prev => [...prev, { role: "agent", content: response }]);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm bg-ink/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-surface border border-paper/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-paper/10 bg-ink/50">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded ${mode === 'command' ? 'bg-acid/20 text-acid' : 'bg-blue-500/20 text-blue-400'}`}>
                  {mode === 'command' ? <Terminal size={14} /> : <MessageSquare size={14} />}
                </div>
                <span className="ui-label text-[10px] text-paper/60 uppercase tracking-widest">
                  {mode === 'command' ? 'System_Command_Center' : 'Agent_Shivam_Uplink'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded border border-paper/20 text-[9px] mono text-paper/40">ESC</span>
                  <span className="text-[9px] ui-label text-paper/30">TO_CLOSE</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-paper/40 hover:text-paper transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div 
              ref={scrollRef}
              className="h-[350px] overflow-y-auto p-4 space-y-4 scrollbar-hide bg-ink/20"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-sm mono text-[12px] leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-paper/5 text-paper border border-paper/10' 
                      : 'bg-acid/5 text-acid border border-acid/10'
                  }`}>
                    {m.role === 'agent' && <span className="mr-2 opacity-50">🤖</span>}
                    {m.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-paper/10 bg-ink/40">
              <div className="relative flex items-center">
                <div className="absolute left-3 text-paper/30">
                  {mode === 'command' ? <ChevronRight size={16} /> : <MessageSquare size={16} />}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'command' ? "Type a command (goto, chat, help)..." : "Ask Agent Shivam anything..."}
                  className="w-full bg-paper/5 border border-paper/10 pl-10 pr-12 py-3 mono text-[13px] text-paper outline-none focus:border-acid/40 transition-colors"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <CornerDownLeft size={14} className="text-paper/20" />
                </div>
              </div>
              
              {/* Quick Suggestions */}
              {mode === 'command' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {['goto projects', 'goto about', 'chat', 'help'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleCommand(s)}
                      className="px-2 py-1 bg-paper/5 border border-paper/10 rounded text-[10px] mono text-paper/40 hover:text-acid hover:border-acid/40 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
