"use client";

import { projects } from "@/lib/data";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import ProjectNavbar from "@/components/ProjectNavbar";
import { Cpu, Zap, Target, CheckCircle2, ChevronRight } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import Link from "next/link";

export default function ProjectCaseStudy({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const { caseStudy } = project;

  return (
    <main className="min-h-screen bg-ink text-paper selection:bg-acid selection:text-ink">
      <CustomCursor />
      <ProjectNavbar title={project.name} github={project.github} live={project.live} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-[10vw] border-b border-paper/10">
        <div className="absolute top-32 right-[10vw] hidden lg:block opacity-20">
          <div className="flex flex-col gap-2 items-end">
            <span className="ui-label text-[10px] tracking-[0.5em]">SYSTEM_ENTRY_0{project.number}</span>
            <span className="mono text-[9px]">{new Date().toISOString()}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-2 py-0.5 text-[10px] mono border border-acid/30 text-acid bg-acid/5 rounded-sm">
              {project.accent || "CORE"}
            </span>
            <span className="ui-label text-[10px] text-paper/30 tracking-[0.3em]">/ {project.year}</span>
          </div>

          <h1 className="brutal-heading text-[12vw] md:text-[8vw] leading-[0.85] mb-8">
            {project.name}
          </h1>

          <p className="editorial italic text-2xl md:text-4xl text-paper/80 max-w-4xl leading-tight">
            {project.tagline}
          </p>
        </motion.div>

        {/* Tech Stack Pills */}
        <div className="mt-16 flex flex-wrap gap-3">
          {project.stack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="px-4 py-2 bg-paper/5 border border-paper/10 mono text-[11px] text-paper/60 uppercase tracking-widest"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Overview Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-[10vw] py-24">
        <div className="md:col-span-8 space-y-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Cpu size={18} className="text-acid" />
              <h3 className="ui-label text-[12px] tracking-[0.4em] text-paper/40 uppercase">System_Overview</h3>
            </div>
            <p className="text-xl md:text-2xl leading-relaxed text-paper/70 font-light">
              {caseStudy.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target size={18} className="text-danger/60" />
                <h3 className="ui-label text-[12px] tracking-[0.4em] text-paper/40 uppercase">The_Challenge</h3>
              </div>
              <p className="text-base leading-relaxed text-paper/60">
                {caseStudy.problem}
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-acid" />
                <h3 className="ui-label text-[12px] tracking-[0.4em] text-paper/40 uppercase">The_Solution</h3>
              </div>
              <p className="text-base leading-relaxed text-paper/60">
                {caseStudy.solution}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-12 bg-paper/5 p-8 border border-paper/10 self-start sticky top-32">
          <h4 className="ui-label text-[10px] tracking-[0.3em] text-acid">ARCHITECTURE_STACK</h4>
          <div className="space-y-4">
            {project.deepScan.architecture.map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <span className="mono text-[10px] text-paper/20">0{i+1}</span>
                <span className="mono text-[11px] text-paper/70 group-hover:text-acid transition-colors uppercase">{item}</span>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-paper/10">
            <h4 className="ui-label text-[10px] tracking-[0.3em] text-paper/30 mb-6">KEY_RESULTS</h4>
            <div className="space-y-6">
              {caseStudy.results.map((result, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={14} className="text-acid shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed text-paper/60 italic">{result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Deep Dive */}
      <section className="bg-paper/5 border-y border-paper/10 py-24 px-6 md:px-[10vw]">
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="text-center">
            <h2 className="brutal-heading text-5xl md:text-7xl mb-4">TECHNICAL_DEEP_DIVE</h2>
            <div className="h-1 w-24 bg-acid mx-auto" />
          </div>

          <div className="space-y-32">
            {caseStudy.technicalDeepDive.map((section, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                <div className="md:col-span-4 sticky top-32">
                  <span className="mono text-[10px] text-acid mb-4 block">SEC_0{i+1}</span>
                  <h3 className="brutal-heading text-3xl md:text-4xl text-paper uppercase leading-tight">
                    {section.title}
                  </h3>
                </div>
                <div className="md:col-span-8 p-8 border border-paper/10 bg-ink relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-paper/10 group-hover:bg-acid transition-colors" />
                  <p className="text-lg md:text-xl leading-relaxed text-paper/50 italic">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-32 px-6 text-center border-t border-paper/10">
        <h3 className="ui-label text-paper/20 tracking-[0.5em] mb-12 uppercase">End_of_Transmission</h3>
        <Link 
          href="/#projects"
          className="group inline-flex flex-col items-center gap-6"
        >
          <div className="brutal-heading text-5xl md:text-8xl hover:text-acid transition-colors cursor-pointer">
            NEXT_PROJECT
          </div>
          <div className="flex items-center gap-2 text-paper/40 group-hover:text-acid transition-colors">
            <span className="ui-label text-[10px] tracking-widest uppercase">Return_to_Main_Frame</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </footer>
    </main>
  );
}
