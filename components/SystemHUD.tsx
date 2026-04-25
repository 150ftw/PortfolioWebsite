"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Cpu, Shield, Wifi } from "lucide-react";
import { useUI } from "./UIContext";

export default function SystemHUD() {
  const { isHudVisible } = useUI();
  const [metrics, setMetrics] = useState({
    cpu: 42,
    mem: 68,
    uptime: "00:00:00",
    latency: 12
  });

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(30 + Math.random() * 20),
        mem: Math.floor(60 + Math.random() * 10),
        latency: Math.floor(10 + Math.random() * 15),
        uptime: `${hours}:${minutes}:${seconds}`
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-24 left-6 md:bottom-6 md:left-6 z-[9000] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {isHudVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            className="flex flex-col gap-4 overflow-hidden"
          >
            <motion.div 
              className="bg-ink/60 backdrop-blur-md border border-paper/10 p-4 w-64 shadow-2xl pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-paper/5">
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-acid" />
                  <span className="ui-label text-[9px] text-paper/40 uppercase tracking-widest">System_Monitor_v2.1</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse" />
              </div>

              <div className="space-y-4">
                <MetricBar label="CPU_LOAD" value={metrics.cpu} />
                <MetricBar label="MEM_USED" value={metrics.mem} />
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-paper/5">
                  <div>
                    <div className="ui-label text-[8px] text-paper/30 mb-1">UPTIME</div>
                    <div className="mono text-[10px] text-paper/80">{metrics.uptime}</div>
                  </div>
                  <div>
                    <div className="ui-label text-[8px] text-paper/30 mb-1">LATENCY</div>
                    <div className="mono text-[10px] text-acid">{metrics.latency}ms</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-acid/5 backdrop-blur-md border border-acid/20 p-3 w-64 flex items-center justify-between pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-acid" />
                <span className="mono text-[10px] text-acid uppercase tracking-tighter">Heartbeat_Sync_Active</span>
              </div>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-3 w-1 bg-acid/40"
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="mono text-[9px] text-paper/40 uppercase">{label}</span>
        <span className="mono text-[9px] text-paper/60">{value}%</span>
      </div>
      <div className="h-1 w-full bg-paper/5 overflow-hidden">
        <motion.div 
          className="h-full bg-acid/60"
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}
