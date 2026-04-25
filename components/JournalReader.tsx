"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Clock, Share2, Bookmark } from "lucide-react";
import { BlogPost } from "@/lib/data";
import { useEffect } from "react";

type JournalReaderProps = {
  post: BlogPost | null;
  onClose: () => void;
};

export default function JournalReader({ post, onClose }: JournalReaderProps) {
  useEffect(() => {
    if (post) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [post]);

  if (!post) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[12000] bg-ink overflow-y-auto"
      >
        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 h-1 bg-acid z-[12100]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        />

        {/* Top Navigation */}
        <div className="sticky top-0 z-[12050] bg-ink/80 backdrop-blur-md border-b border-paper/10 px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onClose}
            data-cursor
            data-cursor-label="EXIT"
            className="flex items-center gap-2 text-paper/60 hover:text-acid transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="ui-label text-[10px] tracking-widest uppercase">Back_to_Journal</span>
          </button>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-paper/30">
              <Clock size={14} />
              <span className="mono text-[10px] uppercase">{post.readTime}</span>
            </div>
            <div className="h-4 w-px bg-paper/10 hidden md:block" />
            <div className="flex items-center gap-4">
              <button data-cursor data-cursor-label="SHARE" className="text-paper/40 hover:text-paper transition-colors"><Share2 size={16} /></button>
              <button data-cursor data-cursor-label="SAVE" className="text-paper/40 hover:text-paper transition-colors"><Bookmark size={16} /></button>
              <button 
                onClick={onClose} 
                data-cursor
                data-cursor-label="CLOSE"
                className="text-paper/40 hover:text-paper transition-colors pl-2 border-l border-paper/10"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
          {/* Header */}
          <header className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-2 py-0.5 text-[9px] mono border rounded-sm ${
                post.accent === 'acid' ? 'text-acid border-acid/30 bg-acid/5' : 'text-danger border-danger/30 bg-danger/5'
              }`}>
                {post.category}
              </span>
              <span className="ui-label text-[9px] text-paper/30 uppercase tracking-[0.4em]">LOG_ENTRY_{post.number}</span>
            </div>
            
            <h1 className="playfair italic text-4xl md:text-6xl text-paper mb-8 leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="h-px w-full bg-gradient-to-r from-paper/20 via-paper/5 to-transparent" />
          </header>

          {/* Body */}
          <article className="prose prose-invert prose-acid max-w-none">
            <div className="editorial text-paper/80 text-lg md:text-xl leading-[1.8] space-y-8 whitespace-pre-wrap">
              {post.content}
            </div>
          </article>

          {/* Footer */}
          <footer className="mt-32 pt-16 border-t border-paper/10 text-center">
            <div className="ui-label text-paper/20 text-[10px] tracking-[0.5em] uppercase mb-8">End_of_Transmission</div>
            <button 
              onClick={onClose}
              data-cursor
              data-cursor-label="CLOSE"
              className="brutal-heading text-paper hover:text-acid transition-colors text-3xl md:text-5xl"
            >
              CLOSE_READER
            </button>
          </footer>
        </div>

        {/* Decorative background elements */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]">
           <div className="absolute top-1/4 left-10 brutal-heading text-[15vw] rotate-90 select-none">JOURNAL</div>
           <div className="absolute bottom-1/4 right-10 brutal-heading text-[15vw] -rotate-90 select-none">READ_MODE</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
