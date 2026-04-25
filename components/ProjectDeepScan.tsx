"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Cpu, Database, Terminal, ShieldCheck } from "lucide-react";
import { Project } from "@/lib/data";
import { useEffect, useState } from "react";

type ProjectDeepScanProps = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectDeepScan({ project, onClose }: ProjectDeepScanProps) {
  const [activeTab, setActiveTab] = useState<"arch" | "perf" | "logs">("arch");

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [project]);

  if (!project || !project.deepScan) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-ink/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl h-full max-h-[850px] bg-ink border border-acid/20 shadow-[0_0_50px_-12px_rgba(0,255,148,0.15)] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-acid/10">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="ui-label text-[10px] text-acid tracking-widest uppercase">Deep_Scan_Init</span>
                <h2 className="brutal-heading text-2xl md:text-3xl text-paper">
                  {project.name}<span className="text-acid">.{project.accent}</span>
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-acid/10 border border-acid/20 rounded-full">
                <Activity size={12} className="text-acid animate-pulse" />
                <span className="mono text-[9px] text-acid uppercase">System_Healthy</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-acid/10 text-paper/40 hover:text-acid transition-all border border-transparent hover:border-acid/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-acid/10 p-4 space-y-2">
              {[
                { id: "arch", label: "ARCHITECTURE", icon: Cpu },
                { id: "perf", label: "PERFORMANCE", icon: Activity },
                { id: "logs", label: "SYSTEM_LOGS", icon: Terminal },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 mono text-[11px] tracking-widest transition-all border ${
                    activeTab === tab.id 
                      ? "bg-acid/10 border-acid/30 text-acid" 
                      : "border-transparent text-paper/40 hover:text-paper hover:bg-paper/5"
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}

              <div className="mt-8 pt-8 border-t border-acid/10 hidden md:block">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={14} className="text-acid/40" />
                  <span className="ui-label text-[9px] text-paper/30 uppercase">Security_Verified</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="ui-label text-[8px] text-paper/20 mb-1">STAMP_ID</div>
                    <div className="mono text-[10px] text-paper/40">SEC-992-ALPHA</div>
                  </div>
                  <div>
                    <div className="ui-label text-[8px] text-paper/20 mb-1">ENCRYPTION</div>
                    <div className="mono text-[10px] text-paper/40">AES-256-GCM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-acid/[0.02]">
              {activeTab === "arch" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="ui-label text-acid/60 text-[10px] tracking-[0.3em]">/ SYSTEM_NODES</h4>
                      <div className="space-y-3">
                        {project.deepScan.architecture.map((node, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-paper/5 border border-paper/10 group hover:border-acid/30 transition-all">
                            <div className="h-2 w-2 bg-acid/40 group-hover:bg-acid transition-colors" />
                            <span className="mono text-[13px] text-paper/80">{node}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="relative aspect-square border border-acid/10 bg-acid/[0.03] flex items-center justify-center overflow-hidden">
                       {/* Mock Blueprint Visual */}
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--acid) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                       <motion.div 
                         className="relative z-10 w-48 h-48 border-2 border-acid/40 flex items-center justify-center"
                         animate={{ rotate: 360 }}
                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                       >
                         <div className="w-32 h-32 border border-acid/20 animate-pulse" />
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-acid/20" />
                         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-acid/20" />
                       </motion.div>
                       <div className="absolute bottom-4 left-4 ui-label text-[8px] text-acid/40">MODEL_RENDER_v0.4.2</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "perf" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {project.deepScan.performance.map((stat, i) => (
                    <div key={i} className="p-6 bg-paper/5 border border-paper/10 flex flex-col justify-between h-48">
                      <span className="ui-label text-[9px] text-paper/40 uppercase tracking-widest">{stat.label}</span>
                      <div>
                        <div className="brutal-heading text-4xl text-acid mb-2">{stat.value}</div>
                        <div className="h-1 w-full bg-acid/10 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className="h-full bg-acid"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "logs" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 border border-acid/20 p-6 font-mono text-[12px] text-acid/80 h-full overflow-y-auto"
                >
                  {project.deepScan.logs.map((log, i) => (
                    <div key={i} className="mb-2 flex gap-4">
                      <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-acid">{log}</span>
                    </div>
                  ))}
                  <div className="mt-4 flex gap-4 animate-pulse">
                    <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                    <span className="text-acid">WAITING_FOR_INPUT...</span>
                    <span className="h-4 w-2 bg-acid" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="px-6 py-3 border-t border-acid/10 bg-ink/50 flex justify-between items-center">
            <div className="flex gap-6">
               <div className="flex flex-col">
                  <span className="ui-label text-[8px] text-paper/20 uppercase">Core_Version</span>
                  <span className="mono text-[10px] text-paper/40">3.4.1-STABLE</span>
               </div>
               <div className="flex flex-col">
                  <span className="ui-label text-[8px] text-paper/20 uppercase">Buffer_Status</span>
                  <span className="mono text-[10px] text-acid/60">SYNCHRONIZED</span>
               </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse" />
              <span className="ui-label text-[9px] text-acid uppercase tracking-tighter">Live_Telemetry</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
