"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectNavbar({ title, github, live }: { title: string, github?: string, live?: string }) {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-paper/10 bg-ink/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-paper/40 hover:text-acid transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="ui-label text-[10px] tracking-widest uppercase">Back_to_System</span>
        </button>
        <div className="h-4 w-px bg-paper/10 hidden md:block" />
        <h1 className="ui-label text-[11px] text-paper/80 hidden md:block tracking-[0.3em]">
          DOSSIER // {title.toUpperCase()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {github && (
          <a 
            href={github} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 border border-paper/10 hover:border-paper/30 transition-colors text-paper/60 hover:text-paper"
          >
            <Github size={14} />
            <span className="mono text-[9px] uppercase tracking-wider hidden sm:inline">Source</span>
          </a>
        )}
        {live && (
          <a 
            href={live} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-paper/5 border border-paper/20 hover:border-acid/30 transition-colors text-paper hover:text-acid group"
          >
            <span className="mono text-[9px] uppercase tracking-wider">Live_View</span>
            <ExternalLink size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}
      </div>
    </nav>
  );
}
